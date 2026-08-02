import os
from elasticsearch import Elasticsearch

ES_HOST = os.getenv("ELASTICSEARCH_URL", "http://localhost:9200")
INDEX_NAME = "soc-logs"

def get_es_client() -> Elasticsearch:
    """Returns a connected Elasticsearch client."""
    client = Elasticsearch(ES_HOST)
    return client

def check_connection() -> bool:
    """Quick health check - call this once at startup."""
    client = get_es_client()
    try:
        return client.ping()
    except Exception as e:
        print(f"ES connection failed: {e}")
        return False