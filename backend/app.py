from pathlib import Path

from flask import Flask, render_template, request

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

app = Flask(
    __name__,
    template_folder=str(FRONTEND_DIR),
    static_folder=str(FRONTEND_DIR),
    static_url_path="/static",
)

# Home Page
@app.route("/")
def index():
    return render_template("index.html", show_result=False)

# Roadmap Generate Route
@app.route("/generate", methods=["POST"])
def generate():
    # ---------- INPUT ----------
    age_raw = request.form.get("age")
    interest = request.form.get("interest")
    level = request.form.get("level")
    problem = request.form.get("problem")

    age = 0
    if age_raw and age_raw.isdigit():
        age = int(age_raw)

    age_group = "under18" if age < 18 else "adult"

    roadmap_30 = []
    roadmap_6 = []
    roadmap_12 = []

    # ================= TECH =================
    if interest == "Tech":

        if level == "Beginner":
            # BASE
            roadmap_30 = [
                "Learn programming basics",
                "Practice daily for 30 minutes",
                "Stay consistent without pressure"
            ]
            roadmap_6 = [
                "Pick ONE tech path you enjoyed most",
                "Build 2 small exploratory projects",
                "Learn from free resources only"
            ]
            roadmap_12 = [
                "Focus deeply on chosen path",
                "Build one meaningful project",
                "Decide long-term direction"
            ]

            # PROBLEM TWEAK
            if problem == "Confusion":
                roadmap_30.append("Do not decide career yet, just explore")
            elif problem == "Discipline":
                roadmap_30.append("Fix a daily learning time and follow it")
            elif problem == "Resources":
                roadmap_30.append("Use only free tools and platforms")

            # AGE TWEAK
            if age_group == "under18":
                roadmap_30.append("Focus on learning, not earning")
            else:
                roadmap_12.append("Prepare for internships, freelancing, or jobs")

        elif level == "Intermediate":
            roadmap_30 = [
                "Revise core programming concepts",
                "Solve logic problems regularly",
                "Improve code quality"
            ]
            roadmap_6 = [
                "Build 2 real-world projects",
                "Learn Git & GitHub",
                "Understand basic system design"
            ]
            roadmap_12 = [
                "Create strong portfolio",
                "Apply for internships or freelance",
                "Prepare for advanced studies or jobs"
            ]

    # ================= CREATIVE =================
    elif interest == "Creative":

        if level == "Beginner":
            roadmap_30 = [
                "Explore design, writing, video, music",
                "Create small things daily",
                "Observe others' creative work"
            ]
            roadmap_6 = [
                "Pick ONE creative field",
                "Practice consistently",
                "Learn basics from free resources"
            ]
            roadmap_12 = [
                "Build a small portfolio",
                "Develop your own style",
                "Decide creative direction"
            ]

            if problem == "Confusion":
                roadmap_30.append("Experiment without pressure")
            elif problem == "Discipline":
                roadmap_30.append("Fix a daily creative routine")
            elif problem == "Resources":
                roadmap_30.append("Use only free tools")

        elif level == "Intermediate":
            roadmap_30 = [
                "Analyze your past creative work",
                "Improve weak areas",
                "Refine your style"
            ]
            roadmap_6 = [
                "Create high-quality projects",
                "Collaborate with others",
                "Share work publicly"
            ]
            roadmap_12 = [
                "Build strong portfolio",
                "Start monetizing your skill",
                "Grow audience or clients"
            ]

    # ================= BUSINESS =================
    elif interest == "Business":

        if level == "Beginner":
            roadmap_30 = [
                "Understand basics of business",
                "Learn profit, cost, value",
                "Observe small businesses"
            ]
            roadmap_6 = [
                "Learn marketing basics",
                "Study one business model",
                "Test a small idea"
            ]
            roadmap_12 = [
                "Work on real business project",
                "Improve sales & communication",
                "Plan growth"
            ]

        elif level == "Intermediate":
            roadmap_30 = [
                "Analyze business models",
                "Understand customer psychology",
                "Review past attempts"
            ]
            roadmap_6 = [
                "Build or join a business project",
                "Learn financial planning",
                "Improve execution"
            ]
            roadmap_12 = [
                "Scale one idea",
                "Build strong network",
                "Create systems"
            ]

    return render_template(
        "index.html",
        roadmap_30=roadmap_30,
        roadmap_6=roadmap_6,
        roadmap_12=roadmap_12,
        show_result=True
    )

if __name__ == "__main__":
    print("Starting Flask app...")
    app.run(debug=True)
