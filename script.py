import subprocess
import json
from collections import defaultdict
from datetime import datetime

USERNAME = "Farhan-25"

GRAPHQL_QUERY = f"""
{{
  search(query: "type:pr author:{USERNAME}", type: ISSUE, first: 100) {{
    nodes {{
      ... on PullRequest {{
        title
        url
        state
        mergedAt
        updatedAt
        repository {{
          name
          owner {{
            login
          }}
          url
          description
          primaryLanguage {{
            name
          }}
        }}
      }}
    }}
  }}
}}
"""

def fetch_prs():
    try:
        result = subprocess.run(
            ["gh", "api", "graphql", "-f", f"query={GRAPHQL_QUERY}"],
            capture_output=True,
            text=True,
            check=True
        )
        data = json.loads(result.stdout)
        return data["data"]["search"]["nodes"]
    except subprocess.CalledProcessError as e:
        print("Error running gh command:")
        print(e.stderr)
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def classify_pr(pr):
    if pr["mergedAt"] is not None:
        return "Merged"
    elif pr["state"] == "CLOSED":
        return "Closed"
    else:
        return "Open"

def generate_json(prs):
    projects = {}

    for pr in prs:
        repo_owner = pr['repository']['owner']['login']
        repo_name = pr['repository']['name']
        full_name = f"{repo_owner}/{repo_name}"
        project_key = full_name.replace('/', '-')

        if project_key not in projects:
            lang = "Unknown"
            if pr['repository'].get('primaryLanguage'):
                lang = pr['repository']['primaryLanguage']['name']
            
            projects[project_key] = {
                "title": repo_name,
                "repoName": full_name,
                "repoUrl": pr['repository']['url'],
                "lang": lang,
                "description": pr['repository']['description'] or "No description available.",
                "prs": []
            }

        projects[project_key]["prs"].append({
            "title": pr["title"],
            "status": classify_pr(pr),
            "link": pr["url"],
            "updatedAt": pr["updatedAt"]
        })

    # Sort PRs by date (newest first)
    for key in projects:
        projects[key]["prs"].sort(key=lambda x: x["updatedAt"], reverse=True)

    with open("opensource_data.json", "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2)

    print("opensource_data.json updated successfully.")

def main():
    prs = fetch_prs()
    if prs:
        generate_json(prs)
    else:
        print("No PRs found or error occurred.")

if __name__ == "__main__":
    main()