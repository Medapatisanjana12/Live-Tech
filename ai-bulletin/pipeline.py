from datetime import datetime, timezone
import requests
from datetime import date
from supabase_client import supabase

PRODUCTHUNT_TOKEN = "TilE3Hm1LUZjgNjMZP8tkaQozkkktzBsouWiUE7z0NM"  # from producthunt.com/v2/oauth/applications

def calculate_trending_score(created_at_str, topics):
    """
    Calculates a trending score based on freshness and topic relevance.
    Formula: freshness_score (max 100) + topic_bonus (5 per topic)
    """
    try:
        # Parse Product Hunt created_at (ISO format)
        created_at = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        
        # Calculate freshness (hours old)
        hours_old = (now - created_at).total_seconds() / 3600
        freshness_score = max(0, 100 - hours_old)
        
        # Calculate topic bonus
        topic_bonus = len(topics) * 5
        
        return round(freshness_score + topic_bonus, 2)
    except Exception as e:
        print(f"[Error] Failed to calculate score: {e}")
        return 0

def fetch_ai_tools():
    # ... (rest of the function remains same)
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
    
    if response.status_code != 200:
        print(f"[Error] Failed to fetch data: {response.status_code} - {response.text}")
        return []
        
    data = response.json()
    return data.get("data", {}).get("posts", {}).get("edges", [])

def run_fetch_and_save():
    print("[Pipeline] Fetching AI tools from Product Hunt...")
    tools = fetch_ai_tools()
    today = str(date.today())

    if not tools:
        print("[Pipeline] No tools found or failed to fetch.")
        return

    print(f"[Pipeline] Found {len(tools)} tools. Saving to Supabase...")
    
    for edge in tools:
        tool = edge["node"]
        topics = [t["node"]["name"] for t in tool["topics"]["edges"]]
        
        # Calculate trending score
        score = calculate_trending_score(tool["createdAt"], topics)
        
        data = {
            "id": int(tool["id"]),
            "date": today,
            "name": tool["name"],
            "tagline": tool["tagline"],
            "description": tool["description"],
            "votes": tool["votesCount"],
            "website": tool["website"],
            "created_at": tool["createdAt"],
            "topics": topics,
            "trending_score": score
        }

        try:
            response = supabase.table("ai_tools").upsert(data).execute()
            try:
                print(f"[Pipeline] Saved: {tool['name']} (Score: {score})")
            except UnicodeEncodeError:
                print(f"[Pipeline] Saved: {tool['name'].encode('ascii', 'replace').decode('ascii')} (Score: {score})")
        except Exception as e:
            try:
                print(f"[Error] Failed to save {tool['name']}: {e}")
            except UnicodeEncodeError:
                print(f"[Error] Failed to save (unprintable name): {e}")

    print("[Pipeline] All tools saved to Supabase successfully.")
