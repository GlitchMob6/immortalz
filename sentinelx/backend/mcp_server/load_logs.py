import json
from elasticsearch import Elasticsearch, helpers
from es_client import get_es_client, INDEX_NAME

def load_logs(filepath="sample_logs.json"):
    client = get_es_client()

    with open(filepath, "r") as f:
        logs = json.load(f)

    # Bulk index all logs
    actions = [
        {
            "_index": INDEX_NAME,
            "_source": log,
        }
        for log in logs
    ]

    success, errors = helpers.bulk(client, actions, raise_on_error=False)
    print(f"Indexed {success} logs successfully.")
    if errors:
        print(f"{len(errors)} errors occurred. First error: {errors[0]}")

if __name__ == "__main__":
    load_logs()