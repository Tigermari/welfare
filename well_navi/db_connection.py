import os
import psycopg2

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
