document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("roadmapForm");
    if (!form) return;

    const ageInput = document.getElementById("ageInput");
    const submitButton = document.getElementById("submitBtn");
    const resultContainer = document.getElementById("resultContainer");
    
    const list30 = document.getElementById("list30");
    const list6 = document.getElementById("list6");
    const list12 = document.getElementById("list12");

    // Native age validation logic
    if (ageInput) {
        ageInput.addEventListener("input", () => {
            const value = Number(ageInput.value);
            if (Number.isNaN(value)) {
                ageInput.setCustomValidity("Enter a valid age.");
            } else if (value < 0 || value > 120) {
                ageInput.setCustomValidity("Age should be between 0 and 120.");
            } else {
                ageInput.setCustomValidity("");
            }
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevents dashboard reload

        if (!ageInput || ageInput.value.trim() === "" || !ageInput.checkValidity()) {
            ageInput?.focus();
            return;
        }

        // Visual loading feedback
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Generating Roadmap...";
        }

        // Collect inputs into a payload object
        const payload = {
            age: ageInput.value,
            interest: document.getElementById("interestInput").value,
            level: document.getElementById("levelInput").value,
            problem: document.getElementById("problemInput").value
        };

        // Call the Flask endpoint locally or on production
        fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) throw new Error("Network response error.");
            return res.json();
        })
        .then(data => {
            // Helper function to turn strings into list tags safely
            const buildList = (element, itemsArray) => {
                element.innerHTML = "";
                if (itemsArray && itemsArray.length > 0) {
                    itemsArray.forEach(item => {
                        const li = document.createElement("li");
                        li.textContent = item;
                        element.appendChild(li);
                    });
                }
            };

            // Inject the data arrays right into the HTML structure
            buildList(list30, data.roadmap_30);
            buildList(list6, data.roadmap_6);
            buildList(list12, data.roadmap_12);

            // Display the parent container grid smoothly
            resultContainer.style.display = "block";
        })
        .catch(err => {
            console.error("API error:", err);
            alert("Failed to reach server. Please check your backend.");
        })
        .finally(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Generate Roadmap";
            }
        });
    });
});
