(function () {
	'use strict';

	// 
	// 
	// 
	// 
	// Переменные
	const body = document.querySelector('body');
	const html = document.querySelector('html');
	const popup$1 = document.querySelectorAll('.popup');

	const headerTop = document.querySelector('.header-fixed') ? document.querySelector('.header-fixed') : document.querySelector('head');
	let fixedElements = document.querySelectorAll('[data-fixed]');

	const menuClass = '.header__mobile';
	const menu = document.querySelector(menuClass) ? document.querySelector(menuClass) : document.querySelector('head');
	const menuLink = document.querySelector('.menu-link') ? document.querySelector('.menu-link') : document.querySelector('head');
	const menuActive = 'active';

	const burgerMedia = 991;
	const bodyOpenModalClass = 'popup-show';

	let windowWidth = window.innerWidth;
	document.querySelector('.container')?.offsetWidth || 0;

	const checkWindowWidth = () => {
		windowWidth = window.innerWidth;
		document.querySelector('.container')?.offsetWidth || 0;
	};

	//
	//  
	//
	//
	// Проверки

	// Проверка на мобильное устройство
	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
	}

	// Проверка на десктоп разрешение 
	function isDesktop() {
		return windowWidth > burgerMedia
	}

	// Проверка поддержки webp 
	function checkWebp() {
		const webP = new Image();
		webP.onload = webP.onerror = function () {
			if (webP.height !== 2) {
				document.querySelectorAll('[style]').forEach(item => {
					const styleAttr = item.getAttribute('style');
					if (styleAttr.indexOf('background-image') === 0) {
						item.setAttribute('style', styleAttr.replace('.webp', '.jpg'));
					}
				});
			}
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	// Проверка на браузер safari
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	// Проверка есть ли скролл 
	function haveScroll() {
		return document.documentElement.scrollHeight !== document.documentElement.clientHeight
	}

	// Закрытие бургера на десктопе
	function checkBurgerAndMenu() {
		if (isDesktop()) {
			menuLink.classList.remove('active');
			if (menu) {
				menu.classList.remove(menuActive);
				if (!body.classList.contains(bodyOpenModalClass)) {
					body.classList.remove('no-scroll');
				}
			}
		}

		if (html.classList.contains('lg-on')) {
			if (isMobile()) {
				body.style.paddingRight = '0';
			} else {
				body.style.paddingRight = getScrollBarWidth() + 'px';
			}
		}
	}

	// Задержка при вызове функции
	function throttle(fn, delay) {
		let timer;
		return () => {
			clearTimeout(timer);
			timer = setTimeout(() => fn.apply(this, arguments), delay);
		};
	}

	// Закрытие элемента при клике вне него
	function closeOutClick(closedElement, clickedButton, clickedButtonActiveClass, callback) {
		document.addEventListener('click', (e) => {
			const button = document.querySelector(clickedButton);
			const element = document.querySelector(closedElement);
			const withinBoundaries = e.composedPath().includes(element);

			if (!withinBoundaries && button?.classList.contains(clickedButtonActiveClass) && e.target !== button) {
				element.classList.remove('active');
				button.classList.remove(clickedButtonActiveClass);
			}
		});
	}

	window.addEventListener('resize', throttle(checkWindowWidth, 100));

	// Изменение ссылок в меню 
	if (!document.querySelector('body').classList.contains('home') && document.querySelector('body').classList.contains('wp')) {
		let menu = document.querySelectorAll('.menu li a');

		for (let i = 0; i < menu.length; i++) {
			if (menu[i].getAttribute('href').indexOf('#') > -1) {
				menu[i].setAttribute('href', '/' + menu[i].getAttribute('href'));
			}
		}
	}

	// Добавление класса loaded после полной загрузки страницы
	function loaded() {
		document.addEventListener('DOMContentLoaded', function () {
			html.classList.add('loaded');
			if (document.querySelector('header')) {
				document.querySelector('header').classList.add('loaded');
			}
			if (haveScroll()) {
				setTimeout(() => {
					html.classList.remove('scrollbar-auto');
				}, 500);
			}
		});
	}

	// Для локалки
	if (window.location.hostname == 'localhost' || window.location.hostname.includes('192.168')) {
		document.querySelectorAll('.logo, .crumbs>li:first-child>a').forEach(logo => {
			logo.setAttribute('href', '/');
		});

		document.querySelectorAll('.menu a').forEach(item => {
			let firstSlash = 0;
			let lastSlash = 0;

			if (item.href.split('/').length - 1 == 4) {
				for (let i = 0; i < item.href.length; i++) {
					if (item.href[i] == '/') {
						if (i > 6 && firstSlash == 0) {
							firstSlash = i;
							continue
						}

						if (i > 6 && lastSlash == 0) {
							lastSlash = i;
						}
					}
				}

				let newLink = '';
				let removeProjectName = '';

				for (let i = 0; i < item.href.length; i++) {
					if (i > firstSlash && i < lastSlash + 1) {
						removeProjectName += item.href[i];
					}
				}

				newLink = item.href.replace(removeProjectName, '');
				item.href = newLink;
			}
		});
	}

	function setHeaderFixedHeight() {
		document.documentElement.style.removeProperty('--headerFixedHeight');
		void headerTop.offsetHeight;
		requestAnimationFrame(() => {
			document.documentElement.style.setProperty(
				'--headerFixedHeight',
				headerTop.offsetHeight + 'px'
			);
		});
	}

	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(setHeaderFixedHeight, 1);
	});

	setHeaderFixedHeight();

	// Проверка на браузер safari
	if (isSafari) document.documentElement.classList.add('safari');

	// Проверка поддержки webp 
	checkWebp();

	// Закрытие бургера на десктопе
	window.addEventListener('resize', throttle(checkBurgerAndMenu, 100));
	checkBurgerAndMenu();

	// Добавление класса loaded при загрузке страницы
	loaded();

	// Скрытие скроллбара
	function hideScrollbar() {
		// changeScrollbarGutter()

		popup$1.forEach(element => {
			element.style.display = 'none';
		});

		if (haveScroll()) {
			body.classList.add('no-scroll');
			body.classList.add(bodyOpenModalClass);
		}

		changeScrollbarPadding();
	}

	function showScrollbar() {
		if (!menu.classList.contains(menuActive)) {
			body.classList.remove('no-scroll');
		}

		changeScrollbarPadding(false);

		if (haveScroll()) {
			body.classList.add('scrollbar-auto');
			html.classList.add('scrollbar-auto');
		}
	}

	// Ширина скроллбара
	function getScrollBarWidth$1() {
		let div = document.createElement('div');
		div.style.overflowY = 'scroll';
		div.style.width = '50px';
		div.style.height = '50px';
		document.body.append(div);
		let scrollWidth = div.offsetWidth - div.clientWidth;
		div.remove();

		if (haveScroll()) {
			return scrollWidth
		} else {
			return 0
		}
	}

	// Добавление и удаление отступа у body и фиксированных элементов
	function changeScrollbarPadding(add = true) {
		if (add) {
			body.style.paddingRight = getScrollBarWidth$1() + 'px';

			fixedElements.forEach(elem => {
				elem.style.paddingRight = getScrollBarWidth$1() + 'px';
			});
		} else {
			body.style.paddingRight = '0';

			fixedElements.forEach(elem => {
				elem.style.paddingRight = '0';
			});
		}
	}

	// Добавление прокрутки мышью для горизонтальных блоков
	let dataScrollingBlocks = document.querySelectorAll('[data-scrolling]');

	if (dataScrollingBlocks) {
		dataScrollingBlocks.forEach(element => {
			let isDragging = false;
			let startX;
			let scrollLeft;
			let moved = false;

			element.addEventListener('mousedown', event => {
				isDragging = true;
				moved = false;
				element.classList.add('dragging');
				startX = event.pageX - element.offsetLeft;
				scrollLeft = element.scrollLeft;

				element.querySelectorAll('img, a').forEach(item => item.ondragstart = () => false);
			});

			element.addEventListener('mousemove', event => {
				if (!isDragging) return
				event.preventDefault();
				moved = true;
				const x = event.pageX - element.offsetLeft;
				const walk = x - startX;
				element.scrollLeft = scrollLeft - walk;
			});

			element.addEventListener('mouseup', event => {
				isDragging = false;
				element.classList.remove('dragging');

				element.querySelectorAll('img, a').forEach(item => item.ondragstart = null);

				if (moved) {
					event.preventDefault();
					event.stopPropagation();
				}
			});

			element.addEventListener('mouseleave', () => {
				isDragging = false;
				element.classList.remove('dragging');
				element.querySelectorAll('img, a').forEach(item => item.ondragstart = null);
			});

			element.querySelectorAll('a').forEach(link => {
				link.addEventListener('click', event => {
					if (moved) {
						event.preventDefault();
						event.stopPropagation();
					}
				});
			});
		});
	}

	/* 
		================================================
		  
		Бургер
		
		================================================
	*/

	function burger() {
		if (menuLink) {
			let marginTop = 0;
			let isAnimating = false;

			menuLink.addEventListener('click', function (e) {
				if (isAnimating) return
				isAnimating = true;

				marginTop = headerTop.getBoundingClientRect().height + headerTop.getBoundingClientRect().y;
				menuLink.classList.toggle('active');
				menu.style.marginTop = marginTop + 'px';
				menu.classList.toggle(menuActive);

				if (menu.classList.contains(menuActive)) {
					hideScrollbar();
				} else {
					setTimeout(() => {
						showScrollbar();
					}, 400);
				}

				setTimeout(() => {
					isAnimating = false;
				}, 500);
			});

			function checkHeaderOffset() {
				if (isMobile()) {
					changeScrollbarPadding(false);
				} else {
					if (body.classList.contains(bodyOpenModalClass)) {
						changeScrollbarPadding();
					}
				}

				if (isDesktop()) {
					menu.removeAttribute('style');
				} else {
					if (marginTop != headerTop.getBoundingClientRect().height) {
						menu.style.marginTop = headerTop.getBoundingClientRect().height + 'px';
					}
				}
			}

			window.addEventListener('resize', throttle(checkHeaderOffset, 50));

			if (document.querySelector('.header__mobile')) {
				closeOutClick('.header__mobile', '.menu-link', 'active');
			}
		}
	}

	// 
	// 
	// 
	// 
	// Анимации 

	// Плавное появление
	const fadeIn = (el, isItem = false, display, timeout = 400) => {

		let elements = isItem ? el : document.querySelectorAll(el);

		if (elements.length > 0) {
			elements.forEach(element => {
				element.style.opacity = 0;
				element.style.display = 'block';
				element.style.transition = `opacity ${timeout}ms`;
				setTimeout(() => {
					element.style.opacity = 1;
				}, 10);
			});
		} else {
			el.style.opacity = 0;
			el.style.display = 'block';
			el.style.transition = `opacity ${timeout}ms`;
			setTimeout(() => {
				el.style.opacity = 1;
			}, 10);
		}
	};

	// Плавное исчезание
	const fadeOut = (el, isItem = false, timeout = 400) => {
		let elements = isItem ? el : document.querySelectorAll(el);

		if (elements.length > 0) {
			elements.forEach(element => {
				element.style.opacity = 1;
				element.style.transition = `opacity ${timeout}ms`;
				element.style.opacity = 0;
				setTimeout(() => {
					element.style.display = 'none';
				}, timeout);
				setTimeout(() => {
					element.removeAttribute('style');
				}, timeout + 400);
			});
		} else {
			el.style.opacity = 1;
			el.style.transition = `opacity ${timeout}ms`;
			el.style.opacity = 0;
			setTimeout(() => {
				el.style.display = 'none';
			}, timeout);
			setTimeout(() => {
				el.removeAttribute('style');
			}, timeout + 400);
		}
	};

	//
	//
	//
	//
	// Работа с url

	// Получение хэша
	function getHash() {
		return location.hash ? location.hash.replace('#', '') : '';
	}

	// Удаление хэша
	function removeHash() {
		setTimeout(() => {
			history.pushState("", document.title, window.location.pathname + window.location.search);
		}, 100);
	}

	// Очистка input и textarea при закрытии модалки и отправки формы / Удаление классов ошибки
	let inputs = document.querySelectorAll('input, textarea');

	function clearInputs() {
		inputs.forEach(element => {
			element.classList.remove('wpcf7-not-valid', 'error');
		});
	}

	inputs.forEach(input => {
		const parentElement = input.parentElement;
		const submitButton = input.closest('form')?.querySelector('.submit');

		if (input.type === 'date' && input.value.length === 0) ;

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
			if (input.type === 'date') ;
		});

		if (input.type === 'tel' || input.type === 'email') {
			input.addEventListener('input', resetValidation);
		}
	});

	// Проверка формы перед отправкой
	function initFormValidation(form) {
		// Функция для проверки обязательных полей на выбор
		const checkRequiredChoice = () => {
			let requiredChoice = form.querySelectorAll('[data-required-choice]');
			let hasValue = Array.from(requiredChoice).some(input => input.value.trim() !== '' && input.value !== '+7 ');

			requiredChoice.forEach(input => {
				if (!hasValue) {
					input.setAttribute('required', 'true');
				} else {
					input.removeAttribute('required');
				}
			});
		};

		// Проверка при загрузке страницы
		checkRequiredChoice();

		form.addEventListener('submit', (e) => {
			let isValid = true;

			form.querySelectorAll('input[type="tel"]').forEach(input => {
				if (input.value.length < 16 && input.value.length > 3) {
					input.setCustomValidity('Телефон должен содержать 11 цифр');
					input.reportValidity();
					isValid = false;
				} else {
					input.setCustomValidity('');
				}
			});

			// Проверяем обязательные поля на выбор перед отправкой
			checkRequiredChoice();

			if (!isValid || !form.checkValidity()) e.preventDefault();
		});

		// Обновление `required` при вводе
		let requiredChoice = form.querySelectorAll('[data-required-choice]');

		requiredChoice.forEach(input => {
			input.addEventListener('input', checkRequiredChoice);
		});
	}

	document.querySelectorAll('form').forEach(initFormValidation);

	/* 
		================================================
		  
		Попапы
		
		================================================
	*/

	function popup() {
		let popups = document.querySelectorAll('.popup');

		document.querySelectorAll('[data-modal]').forEach(button => {
			button.addEventListener('click', function () {
				let [dataModal, dataTab] = button.getAttribute('data-modal').split('#');

				if (document.querySelector(`#${dataModal}`)) {
					// Удалить хеш текущего попапа
					if (getHash()) {
						history.pushState("", document.title, (window.location.pathname + window.location.search).replace(getHash(), ''));
					}

					hideScrollbar();

					// Добавить хеш нового попапа
					if (!window.location.hash.includes(dataModal)) {
						window.location.hash = dataModal;
					}

					fadeIn(`.popup[id="${dataModal}"]`);

					// открыть таб в попапе
					if (dataTab) {
						document.querySelector(`[data-href="#${dataTab}"]`).click();
					}
				}
			});
		});

		// Открытие модалки по хешу 
		popups.forEach(popup => {
			if (window.location.hash === `#${popup.getAttribute('id')}`) {
				hideScrollbar();
				fadeIn(`.popup[id="${popup.getAttribute('id')}"]`);
			}
		});

		// 
		// 
		// Закрытие модалок

		function closeModal() {
			fadeOut('.popup');
			document.querySelectorAll('[data-modal]').forEach(button => button.disabled = true);
			body.classList.remove(bodyOpenModalClass);

			setTimeout(() => {
				let modalInfo = document.querySelector('.modal-info');
				if (modalInfo) {
					modalInfo.value = '';
				}

				showScrollbar();
				document.querySelectorAll('[data-modal]').forEach(button => button.disabled = false);
			}, 400);

			removeHash();
			clearInputs();
		}

		// Закрытие модалки при клике на крестик
		document.querySelectorAll('[data-popup-close]').forEach(element => {
			element.addEventListener('click', closeModal);
		});

		// Закрытие модалки при клике вне области контента
		let popupDialog = document.querySelectorAll('.popup__dialog');

		window.addEventListener('click', function (e) {
			popupDialog.forEach(popup => {
				if (e.target === popup) {
					closeModal();
				}
			});
		});

		// Закрытие модалки при клике ESC
		window.onkeydown = function (event) {
			if (event.key === 'Escape' && document.querySelectorAll('.lg-show').length === 0) {
				closeModal();
			}
		};
	}

	burger();
	popup();

})();
//# sourceMappingURL=script.js.map
