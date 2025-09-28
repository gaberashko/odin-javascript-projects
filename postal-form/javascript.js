const postalFormats = {
    us: {
        format: "^(US-)?\\d{5}$",
        errorMessage: "US postal code must be in format (US-)NNNNN",
    },
    gh: {
        format: "^(GH-)?[A-Z]{2}\\d{3}$",
        errorMessage: "Ghana postal code must be in format (GH-)CCNNN",
    },
    th: {
        format: "^(TH-)?\\d{5}$",
        errorMessage: "Thailand postal code must be in format (TH-)NNNNN",
    },
};

const validationConfig = {
    email: {
        required: true,
        pattern: "^[^\\s@]+@[^\\s@]+\\.[a-zA-Z]{2,}$",
        messages: {
            required: "Email is required",
            pattern: 'Your email should be in form of "name@website.domain"',
        },
    },
    pass: {
        required: true,
        minLength: 8,
        messages: {
            required: "Password is required",
            minLength: "Password should be at least 8 characters long",
        },
    },
    passConfirm: {
        matchInput: "pass",
        messages: {
            matchInput: "Your passwords don't match",
        },
    },
    postalCode: {
        required: true,
        conditionalPattern: {
            conditionValue: "postalCountry",
            patternConfig: postalFormats,
        },
        messages: {
            required: "Postal code is required",
            conditionalPattern: (country) =>
                postalFormats[country]?.errorMessage || "Invalid postal code",
        },
    },
};

function initializeForm(form, config) {
    const inputs = form.querySelectorAll("input");
    for (const input of inputs) {
        input.addEventListener("input", (e) => {
            // If no rule specified, don't add any validation.
            const rules = config[input.id];
            if (!rules) return;
            // Rules were specified, so check each rule for the input.
            input.setCustomValidity("");
            // Check if required input is empty.
            if (rules.required && !input.value.trim()) {
                input.setCustomValidity(rules.messages.required);
                // Check if input matches specified pattern.
            } else if (rules.pattern) {
                const constraint = new RegExp(rules.pattern);
                if (!constraint.test(input.value))
                    input.setCustomValidity(rules.messages.pattern);
                // Check if min length requirement is met.
            } else if (
                rules.minLength &&
                input.value.trim().length < rules.minLength
            ) {
                input.setCustomValidity(rules.messages.minLength);
                // Check if input matches its argument input.
            } else if (rules.matchInput) {
                const valueToMatch = document.getElementById(
                    rules.matchInput
                ).value;
                if (input.value != valueToMatch)
                    input.setCustomValidity(rules.messages.matchInput);
                // Check if conditional pattern is matched.
            } else if (rules.conditionalPattern) {
                if (rules.conditionalPattern.conditionValue) {
                    const condition = document.getElementById(
                        rules.conditionalPattern.conditionValue
                    ).value;
                    // Use the condition value with the conditional pattern.
                    if (
                        rules.conditionalPattern.patternConfig &&
                        rules.conditionalPattern.patternConfig[condition] &&
                        rules.conditionalPattern.patternConfig[condition]
                            .format &&
                        rules.conditionalPattern.patternConfig[condition]
                            .errorMessage
                    ) {
                        const constraint = new RegExp(
                            rules.conditionalPattern.patternConfig[
                                condition
                            ].format
                        );
                        if (!constraint.test(input.value))
                            input.setCustomValidity(
                                rules.messages.conditionalPattern(condition)
                            );
                    }
                }
            }
            input.reportValidity();
        });
    }
}

function validateForm(form, config) {
    const inputs = form.querySelectorAll("input");
    let noErrors = true;
    for (const input of inputs) {
        // If no rule specified, don't add any validation.
        const rules = config[input.id];
        if (!rules) return;
        // Rules were specified, so check each rule for the input.
        input.setCustomValidity("");
        // Check if required input is empty.
        if (rules.required && !input.value.trim()) {
            input.setCustomValidity(rules.messages.required);
            // Check if input matches specified pattern.
        } else if (rules.pattern) {
            const constraint = new RegExp(rules.pattern);
            if (!constraint.test(input.value))
                input.setCustomValidity(rules.messages.pattern);
            // Check if min length requirement is met.
        } else if (
            rules.minLength &&
            input.value.trim().length < rules.minLength
        ) {
            input.setCustomValidity(rules.messages.minLength);
            // Check if input matches its argument input.
        } else if (rules.matchInput) {
            const valueToMatch = document.getElementById(
                rules.matchInput
            ).value;
            if (input.value != valueToMatch)
                input.setCustomValidity(rules.messages.matchInput);
            // Check if conditional pattern is matched.
        } else if (rules.conditionalPattern) {
            if (rules.conditionalPattern.conditionValue) {
                const condition = document.getElementById(
                    rules.conditionalPattern.conditionValue
                ).value;
                // Use the condition value with the conditional pattern.
                if (
                    rules.conditionalPattern.patternConfig &&
                    rules.conditionalPattern.patternConfig[condition] &&
                    rules.conditionalPattern.patternConfig[condition].format &&
                    rules.conditionalPattern.patternConfig[condition]
                        .errorMessage
                ) {
                    const constraint = new RegExp(
                        rules.conditionalPattern.patternConfig[condition].format
                    );
                    if (!constraint.test(input.value))
                        input.setCustomValidity(
                            rules.messages.conditionalPattern(condition)
                        );
                }
            }
        }
        input.reportValidity();

        if (!input.checkValidity()) {
            noErrors = false;
        }
    }
    // No errors found on form submission attempt.
    if (noErrors) {
        alert("Nice job!");
    }
}

const postalForm = document.getElementById("postalForm");
const postalFormSubmit = document.getElementById("postalFormSubmit");

initializeForm(postalForm, validationConfig);
postalFormSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    validateForm(postalForm, validationConfig);
});
