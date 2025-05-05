
/* 
	================================================
	  
	Всплывающие уведомления
	
	================================================
*/

class Notify {
	constructor(t) {
		this._title = !1 !== t.title && (t.title || ""),
			this._text = t.text || "Описание",
			this._theme = t.theme || "success",
			this._autohide = t.autohide ? t.autohide : false,
			this._interval = +t.interval || 5e3,
			this._create(),
			this._el.addEventListener("click", t => {
				if (t.target.classList.contains("notify__item-close")) {
					_slideUp(this._el, 200)
					setTimeout(() => {
						this._hide()
					}, 200);
				}
			}),
			this._show(),
			_slideDown(this._el, 500)
	}
	_show() {
		this._el.classList.add("notify__item-show"), this._autohide && setTimeout(() => {

			if (this._autohide == true || this._autohide.toLowerCase() == 'true') {
				_slideUp(this._el, 300)
				setTimeout(() => {
					this._hide()
				}, 400);
			}
		}, this._interval)
	}
	_hide() {
		this._el.classList.remove("notify__item-show");
		const t = new CustomEvent("hide.notify", {
			detail: {
				target: this._el
			}
		});
		document.dispatchEvent(t)
		this._el.remove()

	}
	_create() {
		const t = document.createElement("div");
		t.classList.add(`notify__item_${this._theme}`);
		t.classList.add("notify__item");

		let e = `
			<div class="notify__item-content">
				{header}
				<div class="notify__item-text"></div>
			</div>
			<button class="notify__item-close">
				<svg class="close-icon"><use xlink:href="assets/img/sprite.svg#close"></use></svg>
			</button>
		`;

		const s = !1 === this._title ? "" : '<div class="notify__item-title"></div>';
		if (e = e.replace("{header}", s),
			t.innerHTML = e, this._title ? t.querySelector(".notify__item-title").textContent = this._title : t.classList.add("notify_message"),
			t.querySelector(".notify__item-text").innerHTML = this._text, this._el = t,
			!document.querySelector(".notify")) {
			const t = document.createElement("div");
			t.classList.add("notify"), document.body.append(t)
		}
		document.querySelector(".notify").prepend(this._el)
	}
}

let notifyItems = document.querySelectorAll('[data-notify]');

notifyItems.forEach(item => {
	item.addEventListener('click', function () {
		initNotify(item);
	});
});

function initNotify(item) {
	let title = item.getAttribute('data-notify').split(',')[0];
	let text = item.getAttribute('data-notify').split(',')[1];
	let theme = item.getAttribute('data-notify').split(',')[2] ? item.getAttribute('data-notify').split(',')[2] : '';
	let autohide = item.getAttribute('data-notify').split(',')[3] ? item.getAttribute('data-notify').split(',')[3] : 'true';

	let interval = item.getAttribute('data-notify').split(',')[4] ? item.getAttribute('data-notify').split(',')[4] : '2000'

	new Notify({
		title: title.trim(),
		text: text.trim(),
		theme: theme.trim(),
		autohide: autohide,
		interval: interval
	});
}

document.querySelectorAll('[data-notify-default]').forEach(item => {
	initNotify(item);
});
