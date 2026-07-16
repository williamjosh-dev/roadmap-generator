document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("form[action='/generate']");

	if (!form) {
		return;
	}

	const ageInput = form.querySelector("input[name='age']");
	const submitButton = form.querySelector("button[type='submit']");

	form.addEventListener("submit", (event) => {
		if (!ageInput || ageInput.value.trim() === "") {
			event.preventDefault();
			ageInput?.focus();
			return;
		}

		if (submitButton) {
			submitButton.disabled = true;
			submitButton.textContent = "Generating...";
		}
	});

	if (ageInput) {
		ageInput.addEventListener("input", () => {
			const value = Number(ageInput.value);

			if (Number.isNaN(value)) {
				ageInput.setCustomValidity("Enter a valid age.");
				return;
			}

			if (value < 0 || value > 120) {
				ageInput.setCustomValidity("Age should be between 0 and 120.");
				return;
			}

			ageInput.setCustomValidity("");
		});
	}
});
