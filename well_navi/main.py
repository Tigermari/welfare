from embedding_service import update_scheme_embeddings
from rag_engine import get_rag_response

def main():
    # Update embeddings if needed
    update_scheme_embeddings()
    
    # Example usage
    query = "I am a SC category student from Tamil Nadu looking for education scholarships. My family income is below 2 lakhs per year."
    response = get_rag_response(query)
    print("RAG Response:")
    print(response)

if __name__ == "__main__":
    main()
