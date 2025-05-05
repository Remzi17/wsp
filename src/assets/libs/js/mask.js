window.addEventListener('DOMContentLoaded', () => {
	maskPhone()
})

function maskPhone() {
	const phoneInputs = document.querySelectorAll('[type="tel"]')
	const phoneMaskPattern = '+7 (___) ___ ____'
	const minValidLength = 5
	const minTrimmedLength = 3

	phoneInputs.forEach(input => {
		let keyCode

		function applyMask(event) {
			if (event.keyCode) keyCode = event.keyCode

			let cursorPosition = this.selectionStart
			if (cursorPosition < minTrimmedLength) event.preventDefault()

			let inputIndex = 0
			let defaultDigits = phoneMaskPattern.replace(/\D/g, '')
			let currentDigits = this.value.replace(/\D/g, '')

			let maskedValue = phoneMaskPattern.replace(/[_\d]/g, char => {
				return inputIndex < currentDigits.length ? currentDigits.charAt(inputIndex++) : char
			})

			let firstEmptyIndex = maskedValue.indexOf('_')
			if (firstEmptyIndex !== -1) {
				firstEmptyIndex < minValidLength && (firstEmptyIndex = minTrimmedLength)
				maskedValue = maskedValue.slice(0, firstEmptyIndex)
			}

			let validationPattern = new RegExp(
				'^' +
				phoneMaskPattern
					.substr(0, this.value.length)
					.replace(/_+/g, match => `\\d{1,${match.length}}`)
					.replace(/[+()]/g, '\\$&') +
				'$'
			)

			if (!validationPattern.test(this.value) || this.value.length < minValidLength || (keyCode > 47 && keyCode < 58)) {
				this.value = maskedValue
			}

			if (event.type === 'blur' && this.value.length < minValidLength) {
				this.value = ''
			}

			if (this.value.length < phoneMaskPattern.length) {
				let errorContainer = this.closest('.input-item') || this
				errorContainer.classList.add('error')
			}
		}

		input.addEventListener('input', applyMask)
		input.addEventListener('focus', function (event) {
			setTimeout(applyMask.bind(this, event), 800)
		})
		input.addEventListener('blur', applyMask)
		input.addEventListener('keydown', applyMask)

		input.addEventListener('change', function () {
			if (this.value.startsWith('+8')) {
				this.value = this.value.replace('+8', '+7')
			}

			let submitButton = input.closest('form')?.querySelector('[type="submit"]')

			if (submitButton) {
				if (input.value.length < phoneMaskPattern.length) {
					submitButton.setAttribute('disabled', true)
					input.classList.add('error')
				} else {
					submitButton.removeAttribute('disabled')
					input.classList.remove('error')
				}
			}
		})
	})
}
