import psycopg2
import os
import numpy as np
import faiss
from llama_index.core import Document, Settings, VectorStoreIndex
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.vector_stores.faiss import FaissVectorStore
from llama_index.core.tools import FunctionTool
from llama_index.core.agent import FunctionCallingAgent
from typing import List, Dict

# Initialize models and settings
os.environ["GOOGLE_API_KEY"] = "AIzaSyAHDmtExFX-FOTgXZ6tclhxFCC3_PoYnEA"
llm = GoogleGenAI(model="gemini-2.0-flash")
Settings.llm = llm
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
Settings.embed_model = embed_model

def get_db_connection():
    """Create and return a database connection."""
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "aws-0-ap-south-1.pooler.supabase.com"),
        database=os.getenv("DB_NAME", "postgres"),
        user=os.getenv("DB_USER", "postgres.rvisbxmyjeawkexzbjzz"),
        password=os.getenv("DB_PASSWORD", "Tigermari@20020"),
        port=os.getenv("DB_PORT", "6543")
    )

def setup_vector_extension():
    """Set up vector extension in database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('CREATE EXTENSION IF NOT EXISTS vector;')
    cursor.execute('ALTER TABLE public."Schemes" ALTER COLUMN embedding TYPE vector(384);')
    conn.commit()
    conn.close()

def update_scheme_embeddings():
    """Update embeddings for schemes without them."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, "Scheme_Name", "Description", "Benefits", 
               "Eligibility_Criteria", "Documents_Required", 
               "Application_Process"
        FROM public."Schemes" where embedding is null;
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

def get_scheme_recommendations(query: str) -> List[Dict]:
    """
    Find government schemes based on user query.
    
    Args:
        query: Search query describing the scheme requirements
    
    Returns:
        List of relevant schemes with details
    """
    schemes = search_similar_schemes(query, match_threshold=0.7)
    return [
        {
            "name": scheme[0],
            "description": scheme[1],
            "benefits": scheme[2],
            "relevance": float(scheme[3])
        }
        for scheme in schemes[:5]
    ]

# def get_scheme_details(scheme_name: str) -> Dict:
#     """
#     Get detailed information about a specific scheme.
    
#     Args:
#         scheme_name: Name of the government scheme
    
#     Returns:
#         Detailed information about the scheme
#     """
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute('''
#         SELECT "Scheme_Name", "Description", "Benefits", 
#                "Eligibility_Criteria", "Documents_Required", 
#                "Application_Process"
#         FROM public."Schemes"
#         WHERE "Scheme_Name" ILIKE %s
#         LIMIT 1;
#     ''', (f"%{scheme_name}%",))
    
#     result = cursor.fetchone()
#     conn.close()
    
#     if result:
#         return {
#             "name": result[0],
#             "description": result[1],
#             "benefits": result[2],
#             "eligibility": result[3],
#             "documents": result[4],
#             "application_process": result[5]
#         }
#     return {"error": "Scheme not found"}

def main():
    """Main execution function."""
    setup_vector_extension()
    update_scheme_embeddings()
    
    tools = [FunctionTool.from_defaults(get_scheme_recommendations)]
    
    system_prompt = """You are a government scheme recommendation assistant. Your goal is to help users find relevant schemes by:

    1. Start with broad scheme recommendations based on initial information
    2. Ask relevant follow-up questions to gather more details like:
       - Caste category 
       - Income level
       - Education status
       - Age
       - State of residence
    3. Refine recommendations as more information is provided
    4. For each scheme recommended, explain:
       - Why it matches their criteria
       - Key benefits they can expect
       - Basic eligibility requirements
    
    Remember to:
    - Maintain context from previous interactions
    - Update recommendations when new information is provided
    - Be clear about what additional information would help narrow down schemes
    """
    
    agent = FunctionCallingAgent.from_tools(
        llm=llm,
        tools=tools,
        verbose=True,
        system_prompt=system_prompt,
    )
    
    while True:
        print("\nGovernment Scheme Recommendation System")
        print("=====================================")
        query = input("Enter your query (or 'quit' to exit): ")
        
        if query.lower() == 'quit':
            break
        
        try:
            response = agent.chat(query)
            print("\nRecommended Schemes:")
            print(response)
        except Exception as e:
            print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
