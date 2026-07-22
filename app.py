import os 
from pathlib import Path
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
if os.environ.get("VERCEL"):
    FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"
else:
    FRONTEND_DIR = BASE_DIR.parent / "frontend"

app = Flask(
    __name__,
    template_folder=str(FRONTEND_DIR),
    static_folder=str(FRONTEND_DIR),
    static_url_path="/static",
)
CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json() or {}
    
    age_raw = data.get("age")
    interest = data.get("interest")
    level = data.get("level")
    problem = data.get("problem")

    age = 0
    try:
        age = int(age_raw)
    except (ValueError, TypeError):
        pass

    age_group = "under18" if age < 18 else "adult"

    roadmap_30 = []
    roadmap_6 = []
    roadmap_12 = []

 
    if interest == "Tech" or interest == "Technology & Engineering":
        if level == "Beginner":
            roadmap_30 = ["Learn programming basics", "Practice daily for 30 minutes", "Stay consistent without pressure"]
            roadmap_6 = ["Pick ONE tech path you enjoyed most", "Build 2 small exploratory projects", "Learn from free resources only"]
            roadmap_12 = ["Focus deeply on chosen path", "Build one meaningful project", "Decide long-term direction"]
            
            if age_group == "under18": 
                roadmap_30.append("Focus on learning, not earning")
            else: 
                roadmap_12.append("Prepare for internships, freelancing, or jobs")
                
        elif level == "Intermediate":
            roadmap_30 = ["Revise core programming concepts", "Solve logic problems regularly", "Improve code quality"]
            roadmap_6 = ["Build 2 real-world projects", "Learn Git & GitHub", "Understand basic system design"]
            roadmap_12 = ["Create strong portfolio", "Apply for internships or freelance", "Prepare for advanced studies or jobs"]

   
    elif interest == "Creative":
        if level == "Beginner":
            roadmap_30 = ["Explore design, writing, video, music", "Create small things daily", "Observe others' creative work"]
            roadmap_6 = ["Pick ONE creative field", "Practice consistently", "Learn basics from free resources"]
            roadmap_12 = ["Build a small portfolio", "Develop your own style", "Decide creative direction"]
        elif level == "Intermediate":
            roadmap_30 = ["Analyze your past creative work", "Improve weak areas", "Refine your style"]
            roadmap_6 = ["Create high-quality projects", "Collaborate with others", "Share work publicly"]
            roadmap_12 = ["Build strong portfolio", "Start monetizing your skill", "Grow audience or clients"]

   
    elif interest == "Business":
        if level == "Beginner":
            roadmap_30 = ["Understand basics of business", "Learn profit, cost, value", "Observe small businesses"]
            roadmap_6 = ["Learn marketing basics", "Study one business model", "Test a small idea"]
            roadmap_12 = ["Work on real business project", "Improve sales & communication", "Plan growth"]
        elif level == "Intermediate":
            roadmap_30 = ["Analyze business models", "Understand customer psychology", "Review past attempts"]
            roadmap_6 = ["Build or join a business project", "Learn financial planning", "Improve execution"]
            roadmap_12 = ["Scale one idea", "Build strong network", "Create systems"]

    
    if problem == "Confusion": 
        roadmap_30.append("Dedicate this month solely to exploration without choosing a fixed path yet.")
    elif problem == "Discipline": 
        roadmap_30.append("Fix a strict, unskippable time window daily to counter procrastination.")
    elif problem == "Resources": 
        roadmap_6.append("Restrict your curriculum exclusively to open-source and free community tooling.")

    return jsonify({
        "roadmap_30": roadmap_30,
        "roadmap_6": roadmap_6,
        "roadmap_12": roadmap_12
    })

if __name__ == "__main__":
    print("Starting Flask API dashboard environment...")
    app.run(debug=True)

