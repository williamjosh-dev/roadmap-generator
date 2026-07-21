document.addEventListener("DOMContentLoaded", () => {
    // === 1. MODAL OVERLAY LOGIC ENGINE ===
    const modal = document.getElementById("notesModal");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.getElementById("closeModalBtn");

    if (modal && openBtn && closeBtn) {
        openBtn.addEventListener("click", () => {
            modal.style.display = "flex";
        });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    // === 2. DYNAMIC CONTROLS & ELEMENT MAPPING ===
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

    // Operational boundary range system safety check
    if (ui.ageInput) {
        ui.ageInput.addEventListener("input", () => {
            const currentAge = parseInt(ui.ageInput.value, 10);
            const isOutOfRange = isNaN(currentAge) || currentAge < 1 || currentAge > 120;
            
            ui.ageInput.setCustomValidity(
                isOutOfRange ? "Age boundary constraint must lie between 1 and 120." : ""
            );
        });
    }

    // Staggered text presentation renderer
    const animateTextNode = (listElement, itemsArray, fallbackText = "No sector tracking data returned.") => {
        listElement.innerHTML = ""; 
        
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

    // === 3. LOCAL STORAGE USER HISTORY LOGIC ENGINE ===
    const HISTORY_KEY = "roadmap_user_history";

    // Reads memory registry snap arrays and draws button filter token options
    const renderHistoryLog = () => {
        const historyListContainer = document.getElementById("historyLogList");
        const historySection = document.getElementById("historySection");
        if (!historyListContainer || !historySection) return;

        const savedData = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

        if (savedData.length === 0) {
            historySection.style.display = "none";
            return;
        }

        historySection.style.display = "block";
        historyListContainer.innerHTML = ""; 

        savedData.forEach((item, index) => {
            const token = document.createElement("button");
            token.type = "button";
            token.className = "history-token";
            token.textContent = `[#0${index + 1}] Stage:${item.meta.age} // ${item.meta.interest}`;
            
            // Populates dashboard view from the cached local archive item map data snapshot on click
            token.addEventListener("click", () => {
                ui.viewport.style.display = "block";
                ui.viewport.scrollIntoView({ behavior: "smooth", block: "nearest" });
                
                animateTextNode(ui.nodes.list30, item.payload.roadmap_30);
                setTimeout(() => animateTextNode(ui.nodes.list6, item.payload.roadmap_6), 150);
                setTimeout(() => animateTextNode(ui.nodes.list12, item.payload.roadmap_12), 300);
            });

            historyListContainer.appendChild(token);
        });
    };

    // Appends telemetry logs directly into browser device registry space
    const saveToHistory = (metaInput, payloadOutput) => {
        const currentLogs = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        
        const newLogEntry = {
            meta: metaInput,
            payload: payloadOutput,
            timestamp: new Date().toISOString()
        };

        currentLogs.unshift(newLogEntry);
        
        // Limits total stored items visibility tracking log block array items to 5 items maximum
        if (currentLogs.length > 5) currentLogs.pop();

        localStorage.setItem(HISTORY_KEY, JSON.stringify(currentLogs));
        renderHistoryLog();
    };

    // Setup clear storage handler wipe click event mapping
    const clearBtn = document.getElementById("clearHistoryBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            localStorage.removeItem(HISTORY_KEY);
            renderHistoryLog();
        });
    }

    // Trigger history loading checking run cycle tracking evaluation loops on startup
    renderHistoryLog();


    // === 4. ASYMMETRIC FORM LIFECYCLE CONTROLLER ENGINE ===
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
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(pipelinePayload)
            });

            if (!rawResponse.ok) {
                throw new Error(`Pipeline Network Fault: ${rawResponse.status}`);
            }

            const clientData = await rawResponse.json();

            // Commit query snapshots directly into your browser device storage cache instantly
            saveToHistory(pipelinePayload, clientData);

            ui.viewport.style.display = "block";
            ui.viewport.scrollIntoView({ behavior: "smooth", block: "nearest" });

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
            if (ui.triggerBtn) {
                ui.triggerBtn.disabled = false;
                ui.triggerBtn.textContent = "Launch Roadmap Compilation";
                ui.triggerBtn.style.cursor = "pointer";
            }
        }
    });
});
