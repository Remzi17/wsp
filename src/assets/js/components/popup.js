import { body, bodyOpenModalClass } from "../scripts/core/variables";
import { hideScrollbar, showScrollbar } from "../scripts/other/scroll";
import { fadeIn, fadeOut } from "../scripts/other/animation";
import { removeHash, getHash } from "../scripts/other/url"
import { clearInputs } from "../scripts/forms/validation";

/* 
	================================================
	  
	Попапы
	
	================================================
*/

export function popup() {
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
