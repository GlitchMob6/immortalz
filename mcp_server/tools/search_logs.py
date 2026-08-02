from mcp_server.es_client import get_es_client, INDEX_NAME

def search_logs(query: str = None, event_type: str = None, source_ip: str = None, severity: str = None, size: int = 20):
    """
    Search security logs in Elasticsearch with optional filters.

    Args:
        query: free-text search across the 'message' field
        event_type: filter by event type (failed_login, port_scan, suspicious_payload, etc.)
        source_ip: filter by source IP address
        severity: filter by severity (low, medium, high, critical)
        size: max number of results to return
    """
    client = get_es_client()

    must_clauses = []
    if query:
        must_clauses.append({"match": {"message": query}})
    if event_type:
        must_clauses.append({"term": {"event_type.keyword": event_type}})
    if source_ip:
        must_clauses.append({"term": {"source_ip.keyword": source_ip}})
    if severity:
        must_clauses.append({"term": {"severity.keyword": severity}})

    es_query = {"query": {"bool": {"must": must_clauses}} if must_clauses else {"match_all": {}}}

    response = client.search(index=INDEX_NAME, body=es_query, size=size)
    hits = [hit["_source"] for hit in response["hits"]["hits"]]

    return {
        "total_matches": response["hits"]["total"]["value"],
        "results": hits,
    }