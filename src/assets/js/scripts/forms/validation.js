// Очистка input и textarea при закрытии модалки и отправки формы / Удаление классов ошибки
let inputs = document.querySelectorAll('input, textarea');

export function clearInputs() {
	inputs.forEach(element => {
		element.classList.remove('wpcf7-not-valid', 'error');
	});
}

export function checkInputDateValue(input) {
	input.classList.toggle('empty', input.value.length === 0);
}

inputs.forEach(input => {
	const parentElement = input.parentElement;
	const submitButton = input.closest('form')?.querySelector('.submit');

	if (input.type === 'date' && input.value.length === 0) {
		// input.classList.add('empty');
	}

	const updateActiveState = () => {
		if (input.type === 'text' || input.type === 'date') {
			parentElement.classList.toggle('active', input.value.length > 0);
		}
	};

	const resetValidation = () => {
		input.setCustomValidity('');
		submitButton.disabled = false;
	};

	input.addEventListener('keyup', updateActiveState);
	input.addEventListener('change', () => {
		input.classList.remove('wpcf7-not-valid');
		updateActiveState();

		// if (input.type === 'date') {
		// 	checkInputDateValue(input);
		// }
	});

	input.addEventListener('input', () => {
		// Форматирование чисел
		if (input.getAttribute('data-number')) {
			input.value = input.value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
		}

		// Валидация email
		if (input.type === 'email') {
			input.value = input.value.replace(/[^0-9a-zA-Zа-яА-ЯёЁ@.-]+/g, '');
		}

		// Валидация имени
		if (input.name === 'name') {
			input.value = input.value.replace(/[^а-яА-ЯёЁa-zA-Z ]+/g, '');
		}

		// Валидация даты
		if (input.type === 'date') {
			// checkInputDateValue(input);
		}
	});

	if (input.type === 'tel' || input.type === 'email') {
		input.addEventListener('input', resetValidation);
	}
});

// Проверка формы перед отправкой
export function initFormValidation(form) {
	// Функция для проверки обязательных полей на выбор
	const checkRequiredChoice = () => {
		let requiredChoice = form.querySelectorAll('[data-required-choice]')
		let hasValue = Array.from(requiredChoice).some(input => input.value.trim() !== '' && input.value !== '+7 ')

		requiredChoice.forEach(input => {
			if (!hasValue) {
				input.setAttribute('required', 'true')
			} else {
				input.removeAttribute('required')
			}
		})
	}

	// Проверка при загрузке страницы
	checkRequiredChoice()

	form.addEventListener('submit', (e) => {
		let isValid = true

		form.querySelectorAll('input[type="tel"]').forEach(input => {
			if (input.value.length < 16 && input.value.length > 3) {
				input.setCustomValidity('Телефон должен содержать 11 цифр')
				input.reportValidity()
				isValid = false
			} else {
				input.setCustomValidity('')
			}
		})

		// Проверяем обязательные поля на выбор перед отправкой
		checkRequiredChoice()

		if (!isValid || !form.checkValidity()) e.preventDefault()
	})

	// Обновление `required` при вводе
	let requiredChoice = form.querySelectorAll('[data-required-choice]')

	requiredChoice.forEach(input => {
		input.addEventListener('input', checkRequiredChoice)
	})
}

document.querySelectorAll('form').forEach(initFormValidation)
