import os
import numpy as np
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core import Settings
from db_connection import get_db_connection

# Initialize models
os.environ["GOOGLE_API_KEY"] = "AIzaSyAHDmtExFX-FOTgXZ6tclhxFCC3_PoYnEA"
llm = GoogleGenAI(model="gemini-2.0-flash")
Settings.llm = llm
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
Settings.embed_model = embed_model

def update_scheme_embeddings():
    """Update embeddings for schemes in database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get schemes without embeddings
    cursor.execute('''
        SELECT id, "Scheme_Name", "Description", "Benefits", 
               "Eligibility_Criteria", "Documents_Required", 
               "Application_Process"
        FROM public."Schemes" WHERE embedding is null;
    ''')
    results = cursor.fetchall()
    
    for result in results:
        scheme_id = result[0]
        text_content = " ".join(str(field) for field in result[1:])
        embedding = embed_model.get_text_embedding(text_content)
        embedding_list = np.array(embedding).tolist()
        
        cursor.execute(
            'UPDATE public."Schemes" SET embedding = %s WHERE id = %s',
            (embedding_list, scheme_id)
        )
        conn.commit()
    
    conn.close()

def search_similar_schemes(query_text, match_threshold=0.7):
    """Search for similar schemes using vector similarity."""
    query_embedding = embed_model.get_text_embedding(query_text)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT "Scheme_Name", "Description", "Benefits",
               1 - (embedding <=> %s::vector) as similarity
        FROM public."Schemes"
        WHERE 1 - (embedding <=> %s::vector) > %s
        ORDER BY similarity DESC
        LIMIT 50;
    ''', (query_embedding, query_embedding, match_threshold))
    
    results = cursor.fetchall()
    conn.close()
    return results
