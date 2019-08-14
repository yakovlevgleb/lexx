﻿"use strict";

(function () {
	window.lexx = {};

	function fadeIn(elem, ms, cb, d) {
		if (!d) d = 'block';
		if (!elem) return;

		elem.style.opacity = 0;
		elem.style.display = d;

		if (ms) {
			var opacity = 0;
			var timer = setInterval(function () {
				opacity += 50 / ms;
				if (opacity >= 1) {
					clearInterval(timer);
					opacity = 1;
					if (cb) cb();
				}
				elem.style.opacity = opacity;
			}, 50);
		} else {
			elem.style.opacity = 1;
			if (cb) cb();
		}
	};

	function fadeOut(elem, ms, cb) {
		if (!elem) return;

		elem.style.opacity = 1;

		if (ms) {
			var opacity = 1;
			var timer = setInterval(function () {
				opacity -= 50 / ms;
				if (opacity <= 0) {
					clearInterval(timer);
					opacity = 0;
					elem.style.display = 'none';
					if (cb) cb();
				}
				elem.style.opacity = opacity;
			}, 50);
		} else {
			elem.style.opacity = 0;
			elem.style.display = 'none';
			if (cb) cb();
		}
	};

	function toggleClass(selector, newclass) {
		if (selector.classList) {
			selector.classList.toggle(newclass);
		} else {
			var classes = selector.className.split(' ');
			var existingIndex = classes.indexOf(newclass);

			if (existingIndex >= 0)
				classes.splice(existingIndex, 1);
			else
				classes.push(newclass);

			selector.className = classes.join(' ');
		}
	};

	function scrollTo(destination, duration = 1500, callback) {
		const start = window.pageYOffset;
		const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

		const documentHeight = Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight,
		);
		const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
		const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop - 20;
		const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

		if ('requestAnimationFrame' in window === false) {
			window.scroll(0, destinationOffsetToScroll);
			if (callback) {
				callback();
			}
			return;
		}

		function scroll() {
			const now = 'now' in window.performance ? performance.now() : new Date().getTime();
			const time = Math.min(1, ((now - startTime) / duration));
			const timingFunction = time * (2 - time);
			window.scroll(0, Math.ceil((timingFunction * (destinationOffsetToScroll - start)) + start));

			if (window.pageYOffset === destinationOffsetToScroll || (document.body.scrollHeight === window.scrollY + window.innerHeight)) {
				if (callback) {
					callback();
				}
				return;
			}

			requestAnimationFrame(scroll);
		}

		scroll();
	};

	function setInputFilter(textbox, inputFilter) {
		["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
			textbox.addEventListener(event, function () {
				if (inputFilter(this.value)) {
					this.oldValue = this.value;
					this.oldSelectionStart = this.selectionStart;
					this.oldSelectionEnd = this.selectionEnd;
				} else if (this.hasOwnProperty("oldValue")) {
					this.value = this.oldValue;
					this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
				}
			});
		});
	}

	// window.lexx.form = ({

	// 	init: function () {
	// 		var t = this;
	// 		if (document.querySelectorAll('.js-validate').length !== null) {
	// 			document.querySelectorAll('.js-validate').forEach(function (form) {
	// 				form.addEventListener('submit', function (e) {
	// 					if (!t.checkForm(form)) {
	// 						e.preventDefault();
	// 						e.stopPropagation();
	// 						form.classList.add('warning');
	// 					}
	// 				});
	// 			});
	// 		}

	// 		return this;
	// 	},

	// 	checkForm: function (form) {
	// 		var checkResult = true;
	// 		var warningElems = form.querySelectorAll('.warning');
	// 		var formElems = form.querySelectorAll('input, textarea, select');
	// 		var agreementElems = form.querySelectorAll('input[name^=agreement]');

	// 		form.classList.remove('warning');

	// 		if (warningElems.length) {
	// 			warningElems.forEach(function (warningElem) {
	// 				warningElem.classList.remove('warning');
	// 			});
	// 		}

	// 		if (formElems.length) {
	// 			formElems.forEach(function (elem) {
	// 				var re;
	// 				if (elem.getAttribute('data-req')) {
	// 					switch (elem.getAttribute('data-type')) {
	// 						case 'tel':
	// 							re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
	// 							if (!re.test(elem.value)) {
	// 								elem.classList.add('warning');
	// 								elem.classList.remove('good');
	// 								checkResult = false;
	// 							} else {
	// 								elem.classList.add('good');
	// 							}
	// 							break;
	// 						case 'email':
	// 							re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	// 							if (!re.test(elem.value)) {
	// 								elem.classList.add('warning');
	// 								elem.classList.remove('good');
	// 								checkResult = false;
	// 							} else {
	// 								elem.classList.add('good');
	// 							}
	// 							break;
	// 						case 'login':
	// 							function validateEmail(email) {
	// 								var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	// 								return re.test(email);
	// 							}

	// 							function validatePhone(phone) {
	// 								re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
	// 								return re.test(phone);
	// 							}
	// 							if (validateEmail(elem.value) || validatePhone(elem.value)) {
	// 								elem.classList.add('good');
	// 							} else {
	// 								elem.classList.add('warning');
	// 								elem.classList.remove('good');
	// 								checkResult = false;
	// 							}
	// 							break;
	// 						case 'inn':
	// 							if (INNcheck(elem.value) === 0) {
	// 								elem.classList.add('warning');
	// 								elem.classList.remove('good');
	// 								checkResult = false;
	// 							} else if (INNcheck(elem.value) === 1) {
	// 								var warnings = form.querySelector('.info');
	// 								var warningIncorrect = form.querySelector('.info--incorrect');
	// 								fadeOut(warnings, 500, function () {
	// 									fadeIn(warningIncorrect, 500, 0, 'flex')
	// 								})
	// 								checkResult = false;
	// 							}
	// 							break;
	// 						case 'file':
	// 							if (elem.value.trim() === '') {
	// 								elem.nextElementSibling.classList.add('warning');
	// 								elem.nextElementSibling.classList.remove('good');
	// 								checkResult = false;
	// 							} else {
	// 								elem.nextElementSibling.classList.add('good');
	// 							}
	// 							break;
	// 						case 'select':
	// 							if (elem.nextSibling.querySelector('.choices__item').getAttribute('data-value') === '') {
	// 								elem.parentNode.parentNode.classList.add('warning');
	// 								elem.parentNode.parentNode.classList.remove('good');
	// 								checkResult = false;
	// 							} else {
	// 								elem.parentNode.parentNode.classList.add('good');
	// 							}
	// 							break;
	// 						default:
	// 							if (elem.value.trim() === '') {
	// 								elem.classList.add('warning');
	// 								elem.classList.remove('good');
	// 								checkResult = false;
	// 							} else {
	// 								elem.classList.add('good');
	// 							}
	// 							break;
	// 					}
	// 				}
	// 			});
	// 		}

	// 		if (agreementElems.length) {
	// 			agreementElems.forEach(function (item) {
	// 				if (!item.checked) {
	// 					item.classList.add('warning');
	// 					checkResult = false;
	// 				}
	// 			});
	// 		}

	// 		return checkResult;
	// 	}
	// }).init();

	// window.barter.choices = ({
	// 	init: function () {
	// 		var choices = document.querySelectorAll('.js-choice');
	// 		choices.forEach(function (item) {
	// 			if (item) {
	// 				new Choices(item, {
	// 					noResultsText: 'Не найдено'
	// 				})
	// 			}
	// 		})
	// 	}
	// }).init();

	// window.barter.checkPhone = ({
	// 	init: function () {
	// 		var phoneMask = document.querySelectorAll('.js-phone-mask');
	// 		if (phoneMask) {
	// 			phoneMask.forEach(function (item) {
	// 				new IMask(item, {
	// 					mask: '+{7}(000)000-00-00'
	// 				});
	// 			});
	// 		}
	// 	}
	// }).init();


	// window.barter.popups = ({
	// 	init: function () {
	// 		var popups = document.querySelectorAll('.js-open-popup'),
	// 			bg = document.querySelector('.popup-overflow');

	// 		popups.forEach(function (item) {
	// 			item.addEventListener('click', function () {
	// 				var target = document.getElementById(item.dataset.popup);
	// 				if ((item.dataset.popup == "add-promo")||(item.dataset.popup == "offer-window"))
	// 					document.body.classList.add("ovh");
	// 				fadeIn(bg, 350);
	// 				fadeIn(target, 350, function () {
	// 					closePopup(target);
	// 					if (item.dataset.popup == "logogallery") window.barter.heroSlider.update();
	// 				});

	// 			});
	// 		});

	// 		function closePopup(popup) {
	// 			var btns = popup.querySelectorAll('.js-close-popup');

	// 			btns.forEach(function (item) {
	// 				item.addEventListener('click', function (e) {
	// 					fadeOut(bg, 500);
	// 					fadeOut(popup, 500, function(){
	// 						document.body.classList.remove("ovh");
	// 					});
	// 					document.removeEventListener('click', handler);
	// 				})
	// 			});

	// 			function handler(event) {
	// 				if (!popup.contains(event.target)) {
	// 					fadeOut(bg, 500);
	// 					fadeOut(popup, 500);
	// 					document.removeEventListener('click', handler);
	// 				}
	// 			}

	// 			document.addEventListener('click', handler);
	// 		};

	// 	}
	// }).init();

	// window.barter.swiper = ({
	// 	init: function () {
	// 		var partnersSlider = document.querySelector('.js-partners-slider'),
	// 			dealSlider = document.querySelectorAll('.js-deal-slider');

	// 		if (partnersSlider) {
	// 			new Swiper(partnersSlider, {
	// 				slidesPerView: 'auto',
	// 				loop: true,
	// 				speed: 800,
	// 				centeredSlides: true
	// 			});
	// 		}

	// 		if (dealSlider) {
	// 			dealSlider.forEach(function (item) {
	// 				new Swiper(item, {
	// 					slidesPerView: 'auto',
	// 					loop: true,
	// 					speed: 800,
	// 					centeredSlides: true
	// 				});
	// 			});
	// 		}
	// 	}
	// }).init();

}());
