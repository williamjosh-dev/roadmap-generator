document.addEventListener("DOMContentLoaded", () => {
    const ui = {
        form: document.getElementById("roadmapForm"),
        ageInput: document.getElementById("ageInput"),
        triggerBtn: document.getElementById("submitBtn"),
        viewport: document.getElementById("resultContainer"),
        nodes: {
            list30: document.getElementById("list30"),
            list6: document.getElementById("list6"),
            list12: document.getElementById("list12")
        }
    };

    if (!ui.form) return;

    console.log(
        "%c READY %c Core system initialization successful.", 
        "background: #ff9f00; color: #000; font-weight: bold; padding: 2px 4px;", 
        "color: #00f0ff;"
    );


    if (ui.ageInput) {
        ui.ageInput.addEventListener("input", () => {
            const currentAge = parseInt(ui.ageInput.value, 10);
            const isOutOfRange = isNaN(currentAge) || currentAge < 1 || currentAge > 120;
            
            ui.ageInput.setCustomValidity(
                isOutOfRange ? "Age boundary constraint must lie between 1 and 120." : ""
            );
        });
    }

    const animateTextNode = (listElement, itemsArray, fallbackText = "No sector tracking data returned.") => {
        listElement.innerHTML = ""; // Hard reset node layout
        
        const payload = itemsArray && itemsArray.length ? itemsArray : [fallbackText];
        
        payload.forEach((textString, index) => {
            const li = document.createElement("li");
            li.style.opacity = "0";
            li.style.transform = "translateX(-8px)";
            li.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
            li.textContent = textString;
            
            listElement.appendChild(li);

            
            setTimeout(() => {
                li.style.opacity = "1";
                li.style.transform = "translateX(0)";
            }, index * 120); 
        });
    };

    // Main Operation Lifecycle Event Listener
    ui.form.addEventListener("submit", async (event) => {
        event.preventDefault();

       
        if (!ui.form.checkValidity()) {
            ui.form.reportValidity();
            return;
        }

        
        if (ui.triggerBtn) {
            ui.triggerBtn.disabled = true;
            ui.triggerBtn.textContent = "SYNCHRONIZING SYSTEM LOGS...";
            ui.triggerBtn.style.cursor = "not-allowed";
        }

        const pipelinePayload = {
            age: ui.ageInput.value.trim(),
            interest: document.getElementById("interestInput").value,
            level: document.getElementById("levelInput").value,
            problem: document.getElementById("problemInput").value
        };

        try {
            const rawResponse = await fetch("/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest" // Signature explicit header flag
                },
                body: JSON.stringify(pipelinePayload)
            });

            if (!rawResponse.ok) {
                throw new Error(`Pipeline Network Fault: ${rawResponse.status}`);
            }

            const clientData = await rawResponse.json();

            ui.viewport.style.display = "block";
            ui.viewport.scrollIntoView({ behavior: "smooth", block: "nearest" });

            // Sequentially render lists with slight micro-delays for visual premium feel
            animateTextNode(ui.nodes.list30, clientData.roadmap_30);
            
            setTimeout(() => {
                animateTextNode(ui.nodes.list6, clientData.roadmap_6);
            }, 250);

            setTimeout(() => {
                animateTextNode(ui.nodes.list12, clientData.roadmap_12);
            }, 500);

        } catch (networkError) {
            console.error("%c CORE FAULT ", "background:#ff0033; color:#fff;", networkError);
            alert("Application data packet drops detected. Verify your active local Flask server runtime environment config.");
        } finally {
            // Restore input operational controls 
            if (ui.triggerBtn) {
                ui.triggerBtn.disabled = false;
                ui.triggerBtn.textContent = "Launch Roadmap Compilation";
                ui.triggerBtn.style.cursor = "pointer";
            }
        }
    });
});
