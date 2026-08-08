interface FieldState {
	text: string;
	valid: boolean;
}

const form = document.querySelector<HTMLFormElement>("[data-form]");
if (form) {
	const nameField = form.querySelector<HTMLInputElement>('[data-field="name"]');
	const emailField = form.querySelector<HTMLInputElement>(
		'[data-field="email"]',
	);
	const messageField = form.querySelector<HTMLTextAreaElement>(
		'[data-field="message"]',
	);
	const submitButton = form.querySelector<HTMLButtonElement>("[data-submit]");
	const clearButton = form.querySelector<HTMLButtonElement>("[data-clear]");
	const success = document.querySelector<HTMLElement>("[data-success]");

	const nameRegex = /\S/;
	const emailRegex = /^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\.([a-zA-Z]{2,5})$/;
	const messageRegex = /\S/;

	const fields = {
		name: { text: "", valid: false, regex: nameRegex, el: nameField },
		email: { text: "", valid: false, regex: emailRegex, el: emailField },
		message: { text: "", valid: false, regex: messageRegex, el: messageField },
	};

	const checkValid = () => Object.values(fields).every((field) => field.valid);

	const setBorderColour = (
		state: FieldState & { regex: RegExp },
		el: Element | null,
	) => {
		if (!el) return;
		const wrap = el.closest("[data-field-wrap]");
		if (!wrap) return;
		const value =
			state.text.length === 0 ? "empty" : state.valid ? "valid" : "invalid";
		wrap.setAttribute("data-valid", value);
	};

	const updateSubmit = () => {
		if (submitButton) submitButton.disabled = !checkValid();
	};

	const handleChange = (
		state: FieldState & { regex: RegExp },
		el: HTMLInputElement | HTMLTextAreaElement | null,
	) => {
		if (!el) return;
		el.addEventListener("input", () => {
			state.text = el.value;
			state.valid = state.regex.test(el.value);
			setBorderColour(state, el);
			updateSubmit();
		});
	};

	const clearForm = () => {
		Object.values(fields).forEach((field) => {
			if (field.el) field.el.value = "";
			field.text = "";
			field.valid = false;
			setBorderColour(field, field.el);
		});
		updateSubmit();
	};

	handleChange(fields.name, nameField);
	handleChange(fields.email, emailField);
	handleChange(fields.message, messageField);
	updateSubmit();

	clearButton?.addEventListener("click", clearForm);

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		if (!checkValid()) return;
		fetch("/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				"form-name": "contact",
				name: fields.name.text,
				email: fields.email.text,
				message: fields.message.text,
			}).toString(),
		})
			.then((res) => {
				if (res.ok) {
					clearForm();
					if (success) success.hidden = false;
					form.hidden = true;
				} else {
					throw Error(
						"something went horribly wrong! Your message was not sent!",
					);
				}
			})
			.catch((error) => alert(error));
	});
}
