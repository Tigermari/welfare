from embedding_service import search_similar_schemes, llm

def get_relevant_schemes(query, threshold=0.7, max_results=5):
    """Retrieve relevant schemes using similarity search."""
    schemes = search_similar_schemes(query, match_threshold=threshold)
    schemes = schemes[:max_results]
    
    context = ""
    for scheme in schemes:
        context += f"\nSCHEME: {scheme[0]}\n"
        context += f"DESCRIPTION: {scheme[1]}\n"
        context += f"BENEFITS: {scheme[2]}\n"
        context += "-" * 50
    
    return context, schemes

def get_rag_response(user_query):
    """Generate a RAG response for user query."""
    context, schemes = get_relevant_schemes(user_query)
    
    prompt = f"""Based on the following government schemes:
    {context}
    
    User Query: {user_query}
    
    Please provide a helpful response that:
    1. Summarizes the most relevant schemes
    2. Explains why these schemes are suitable
    3. Provides key eligibility criteria and benefits
    4. Gives next steps for applying keep response in short
    
    Response:"""
    
    response = llm.complete(prompt)
    return response.text
