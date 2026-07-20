document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("roadmapForm");
    if (!form) return;

    const ageInput = document.getElementById("ageInput");
    const submitButton = document.getElementById("submitBtn");
    const resultContainer = document.getElementById("resultContainer");
    
    const list30 = document.getElementById("list30");
    const list6 = document.getElementById("list6");
    const list12 = document.getElementById("list12");

    // Quick runtime guard for boundary checks
    if (ageInput) {
        ageInput.addEventListener("input", () => {
            const val = parseInt(ageInput.value, 10);
            if (isNaN(val) || val < 1 || val > 120) {
                ageInput.setCustomValidity("Provide a valid range (1-120).");
            } else {
                ageInput.setCustomValidity("");
            }
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Native validation fallback check
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Lock form during API flight
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "COMPILING TELEMETRY DATA...";
        }

        const payload = {
            age: ageInput.value,
            interest: document.getElementById("interestInput").value,
            level: document.getElementById("levelInput").value,
            problem: document.getElementById("problemInput").value
        };

        fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
            return response.json();
        })
        .then(resData => {
            // Safe DOM insertion function to prevent layout crashes
            const parseOutput = (domElement, dataArray) => {
                domElement.innerHTML = "";
                const items = dataArray || [];
                
                if (items.length === 0) {
                    const fallbackLi = document.createElement("li");
                    fallbackLi.textContent = "No sector vectors returned.";
                    domElement.appendChild(fallbackLi);
                    return;
                }

                items.forEach(str => {
                    const li = document.createElement("li");
                    li.textContent = str;
                    domElement.appendChild(li);
                });
            };

            // Parse response payload keys mapping back to Flask dict structures
            parseOutput(list30, resData.roadmap_30);
            parseOutput(list6, resData.roadmap_6);
            parseOutput(list12, resData.roadmap_12);

            resultContainer.style.display = "block";
        })
        .catch(err => {
            console.error("Critical flight path compilation failure:", err);
            alert("Network packet dropped. Ensure your Flask process is up and running.");
        })
        .finally(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "LAUNCH ROADMAP COMPILATION";
            }
        });
    });
});
