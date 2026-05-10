import os
import json
import requests
from kafka import KafkaProducer
from datetime import date
from dotenv import load_dotenv

# Load variables from .env.local
load_dotenv(".env.local")

PRODUCTHUNT_TOKEN = os.environ.get("PRODUCTHUNT_TOKEN")

def fetch_ai_tools():
    query = """
    {
      posts(order: VOTES, topic: "artificial-intelligence") {
        edges {
          node {
            id
            name
            tagline
            description
            votesCount
            website
            createdAt
            topics {
              edges { node { name } }
            }
          }
        }
      }
    }
    """
    response = requests.post(
        "https://api.producthunt.com/v2/api/graphql",
        json={"query": query},
        headers={"Authorization": f"Bearer {PRODUCTHUNT_TOKEN}"}
    )
    data = response.json()
    return data["data"]["posts"]["edges"]

def run_producer():
    producer = KafkaProducer(
        bootstrap_servers="localhost:9092",
        api_version=(0, 10),
        value_serializer=lambda v: json.dumps(v).encode("utf-8")
    )

    tools = fetch_ai_tools()
    today = str(date.today())

    for edge in tools:
        tool = edge["node"]
        message = {
            "date": today,
            "id": tool["id"],
            "name": tool["name"],
            "tagline": tool["tagline"],
            "description": tool["description"],
            "votes": tool["votesCount"],
            "website": tool["website"],
            "created_at": tool["createdAt"],
            "topics": [t["node"]["name"] for t in tool["topics"]["edges"]]
        }
        producer.send("producthunt-ai-tools", value=message)
        print(f"[Producer] Published: {tool['name']}")

    producer.flush()
    producer.close()
    print("[Producer] Done.")