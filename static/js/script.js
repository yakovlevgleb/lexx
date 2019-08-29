"use strict";

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
				opacity += 25 / ms;
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
	};

	function wrap(el, wrapper) {
		el.parentNode.insertBefore(wrapper, el);
		wrapper.appendChild(el);
	};

	if (/Mobi/.test(navigator.userAgent)) {
		var tableOver = document.createElement("div");
		tableOver.className = 'table-responsive';
		document.querySelectorAll('table:not([class])').forEach(function (item) {
			wrap(item, tableOver)
		})
	};

	document.querySelectorAll('body *:not([class]):not([id])').forEach((item) => {
		item.innerHTML = item.innerHTML.replace(/( |&nbsp;|\(){1}([№а-яА-Я]){1}(\.){0,1} /g, '$1$2$3&nbsp;');
		item.innerHTML = item.innerHTML.replace(/( |&nbsp;|\(){1}([№а-яА-Я]){1}(\.){0,1} /g, '$1$2$3&nbsp;');
	});

	window.lexx.obj = ({
		init: function () {
			var burger = document.querySelector('.js-burger'),
				lightgallery = document.querySelectorAll('.lightgallery');

			if (lightgallery) {
				lightgallery.forEach(function (item) {
					lightGallery(item, {
						youtubePlayerParams: {
							modestbranding: 1,
							showinfo: 0,
							rel: 0,
							controls: 0
						}
					});
				});
			}

			if (burger) {
				burger.addEventListener('click', function () {
					var _t = this,
						nav = document.querySelector('.header__top'),
						body = document.querySelector('body');
					if (!_t.classList.contains('header__burger--active')) {
						_t.classList.add('header__burger--active');
						body.classList.add('ovh');

						fadeIn(nav, '350', function() {
							nav.classList.add('active');
						}, 'flex');
					} else {
						_t.classList.remove('header__burger--active');
						body.classList.remove('ovh');
						fadeOut(nav, '350', function() {
							nav.classList.remove('active')
						});
					}
					return false;
				});
			}

			if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
				document.body.classList.add('ff')
			}
		}
	}).init();

	window.lexx.choises = ({
		init: function () {
			var select = document.querySelectorAll('.js-single-choice');
			select.forEach(function (el) {
				var choice = new Choices(el, {
					searchEnabled: false,
					itemSelectText: '',
					position: 'bottom',
					shouldSort: false,
				});
			});
		}
	}).init();

	window.lexx.swiper = ({
		init: function () {
			var heroSlider = document.querySelector('.js-hero-slider'),
				icatalogSlider = document.querySelector('.js-icatalog-slider'),
				icatalogImgs = document.querySelector('.js-icatalog-imgs');

			if (heroSlider) {
				new Swiper(heroSlider, {
					slidesPerView: 1,
					loop: true,
					speed: 1200,
					effect: 'coverflow',
					coverflowEffect: {
						rotate: 70,
						depth: 1000
					},
					navigation: {
						nextEl: '.js-hero-slider .swiper-button-next',
						prevEl: '.js-hero-slider .swiper-button-prev',
					},
				});
			}

			if (icatalogSlider) {
				var icatalog = new Swiper(icatalogSlider, {
					slidesPerView: 2,
					loop: 0,
					speed: 1200,
					coverflowEffect: {
						rotate: 70,
						depth: 1000
					},
					navigation: {
						nextEl: '.icatalog__slider .swiper-button-next',
						prevEl: '.icatalog__slider .swiper-button-prev',
					},
					breakpoints: {
						1170: {
							simulateTouch: false,
							touchRatio: 0,
							loop: false
						}
					}
				});

				icatalog.on('slideChangeTransitionStart', function () {
					icatalogIMGs.slideToLoop(this.realIndex, 1200)
				})
			}

			if (icatalogImgs) {
				var icatalogIMGs = new Swiper(icatalogImgs, {
					speed: 1200,
					loop: 0,
					slidesPerView: 1,
					effect: 'coverflow',
					coverflowEffect: {
						rotate: 70,
						depth: 1000
					},
					simulateTouch: false,
					touchRatio: 0
				});
			}

		}
	}).init();

	window.lexx.projectsSlider = function projectsSlider() {
		var slider = document.querySelector('.js-projects-popup-slider');

		if (slider) {
			var pSlider = new Swiper(slider, {
				speed: 1200,
				loop: 1,
				slidesPerView: 1,
				autoHeight: 1,
				navigation: {
					nextEl: '.js-projects-popup-slider .swiper-button-next',
					prevEl: '.js-projects-popup-slider .swiper-button-prev',
				}
			});
		}
	};

	window.lexx.playVideo = ({
		init: function () {
			var playVideo = document.querySelectorAll('.js-play-video'),
				videoPoster = document.querySelector('.js-video-poster');

			if (playVideo) {
				playVideo.forEach(function (item) {
					item.addEventListener('click', function () {
						var parent = this;
						fadeOut(item, 0);
						if (videoPoster) {
							fadeOut(videoPoster, 0);
						}

						parent.parentElement.parentNode.querySelector('.js-video').setAttribute("controls", "controls");
						parent.parentElement.parentNode.querySelector('.js-video').play();
					})
				});
			}
		}
	}).init();

	window.lexx.indexAnimation = ({
		init: function () {
			var firstScreen = document.querySelector('.first-screen'),
				iCatalog = document.querySelector('.icatalog'),
				lastScrollTop = 0,
				firstScroll = true;

			if (document.body.classList.contains('index')) {

				window.addEventListener('mousewheel', function (e) {
					if (firstScroll && e.deltaY > 0) {
						scrollTo(20, 0);
						e.preventDefault();
						this.setTimeout(function () {
							firstScroll = false;
						}, 400);
					}
				}, {
					passive: false
				});

				window.addEventListener("scroll", function (e) {
					var st = window.pageYOffset || document.documentElement.scrollTop;

					if (st > lastScrollTop) {
						if (firstScreen.offsetHeight - this.window.scrollY < document.querySelector('.first-screen').offsetHeight && !firstScreen.classList.contains('hide')) {
							firstScreen.classList.add('hide');
							firstScreen.classList.remove('show');

							iCatalog.classList.add('show');
						}

					} else {
						if (firstScreen.offsetHeight - this.window.scrollY === document.querySelector('.first-screen').offsetHeight && !firstScreen.classList.contains('show') && !firstScroll) {

							firstScreen.classList.add('show');
							firstScreen.classList.remove('hide');

							iCatalog.classList.remove('show');

							firstScroll = true;
						}
					}

					lastScrollTop = st <= 0 ? 0 : st;
				}, false);
			}
		}
	}).init();

	window.lexx.checkForm = function checkForm(form) {
		var checkResult = true;
		var warningElems = form.querySelectorAll('.warning');
		var formElems = form.querySelectorAll('input, textarea, select');
		var agreementElems = form.querySelectorAll('input[name^=agreement]');
		var warningText = form.querySelector('.warning-text');

		form.classList.remove('warning');

		if (warningElems.length) {
			warningElems.forEach(function (warningElem) {
				warningElem.classList.remove('warning');
				if (warningText) {
					warningText.classList.remove('active')
				}
			});
		}

		var showWarningText = function () {
			if (warningText && !warningText.classList.contains('.active')) {
				warningText.classList.add('active')
			}
		}

		if (formElems.length) {
			formElems.forEach(function (elem) {
				var re;
				if (elem.getAttribute('data-req')) {
					switch (elem.getAttribute('data-type')) {
						case 'tel':
							re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
							if (!re.test(elem.value)) {
									elem.classList.add('warning');
									checkResult = false;
									showWarningText();
								}
							break;
						case 'email':
							re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
							if (!re.test(elem.value)) {
									elem.classList.add('warning');
									checkResult = false;
									showWarningText();
								}
							break;
						case 'file':
							if (elem.value.trim() === '') {
									elem.nextElementSibling.classList.add('warning');
									checkResult = false;
									showWarningText();
								}
							break;
						case 'select':
							if (elem.nextSibling.querySelector('.choices__item').getAttribute('data-value') === '-1') {
									elem.parentNode.classList.add('warning');
									checkResult = false;
									showWarningText();
								}
							break;
						default:
							if (elem.value.trim() === '') {
									elem.classList.add('warning');
									checkResult = false;
									showWarningText();
								}
							break;
					}
				}
			});
		}

		if (agreementElems.length) {
			agreementElems.forEach(function (item) {
				if (!item.checked) {
					item.classList.add('warning');
					checkResult = false;
				}
			});
		}

		return checkResult;
	};

	window.lexx.form = ({
		init: function () {
			if (document.querySelectorAll('.js-validate').length !== null) {
				document.querySelectorAll('.js-validate').forEach(function (form) {
					form.addEventListener('submit', function (e) {
						if (!window.lexx.checkForm(form)) {
							e.preventDefault();
							e.stopPropagation();
							form.classList.add('warning');
						}
					});
				});
			}

			return this;
		}
	}).init();

	window.lexx.contactsMap = ({
		init: function () {
			var map = document.querySelector('#js-init-map');
			if (map) {
				var pinCoord = map.getAttribute('data-coords').split(', ');

				ymaps.ready(function () {
					var myMap = new ymaps.Map('js-init-map', {
						center: [parseFloat(pinCoord[0]), parseFloat(pinCoord[1])],
						zoom: 16,
						controls: ['zoomControl'],
					});

					myMap.geoObjects.add(new ymaps.Placemark(myMap.getCenter(), {}, {
						iconLayout: 'default#image',
						iconImageHref: './static/i/pin.svg',
						iconImageSize: [44, 49],
						offset: [-22.5, -49]
					}));
					myMap.behaviors.disable('scrollZoom');
				})
			}
		}
	}).init();


	window.lexx.projectsMap = ({
		init: function () {
			var map = document.querySelector('#yaMap'),
				request = new XMLHttpRequest();

			request.open('GET', '/data.json', true);

			function generatePopup(id) {
				
				// $.ajax = {};
				window.lexx.openPopup('projects');
			}

			if (map) {
				ymaps.ready(function () {
					var myMap = new ymaps.Map('yaMap', {
							center: [55.751574, 37.573856],
							zoom: 3.5,
							controls: ['zoomControl']
						},{}),
						MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
							'<div class="cluster-number">{{ properties.geoObjects.length }}</div>'
						),
						clusterer = new ymaps.Clusterer({
							clusterIcons: [{
									href: './static/i/pin-many.svg',
									size: [45, 49],
									offset: [-22.5, -49]
								}
							],
							clusterIconContentLayout: MyIconContentLayout
						}),

						geoObjects = [];

						clusterer.events.add(['mouseenter', 'mouseleave'], function (e) {
							var target = e.get('target'),
								type = e.get('type');
							if (typeof target.getGeoObjects == 'undefined') {
								if (type == 'mouseenter') {
									target.balloon.open({
										closeButton: false
									})
								} else {
									target.balloon.close()
								}
							}
						});

					request.onload = function () {
						if (this.status >= 200 && this.status < 400) {
							var data = JSON.parse(this.response);
							for (var i = 0, len = data.features.length; i < len; i++) {
								geoObjects[i] = new ymaps.Placemark(
									[parseFloat(data.features[i].geometry.coordinates[0]), parseFloat(data.features[i].geometry.coordinates[1])],
									{
										balloonContentBody: '<p class="balloon-text">' + data.features[i].properties.balloonContent + '</p>',
										id: data.features[i].id
									},
									{
										iconLayout: 'default#image',
										iconImageHref: './static/i/pin.svg',
										iconImageSize: [45, 49],
										iconImageOffset: [-22.5, -49],
										balloonOffset:[0, -60],
										hideIconOnBalloonOpen: false,
										
								});

								geoObjects[i].events.add(['click'], function (e) {
									var target = e.get('target')
									generatePopup(target.properties.get("id"));
								})
							}
						}

						clusterer.add(geoObjects);
						myMap.geoObjects.add(clusterer);

						myMap.setBounds(clusterer.getBounds(), {
							checkZoomRange: false
						});
					};

					request.send();
				});
			}
		}
	}).init();

	window.lexx.popups = ({
		init: function () {
			var popups = document.querySelectorAll('.js-open-popup'),
				bg = document.querySelector('.js-popup-overflow');

			if (popups) {
				popups.forEach(function (item) {
					var target = document.getElementById(item.dataset.popup);
					
					item.addEventListener('click', function (e) {
						var topPosition = window.scrollY + 100;

						e.preventDefault();
						if (document.body.classList.contains('ovh') && document.querySelector('.header__top').classList.contains('active')) {
							var burger = document.querySelector('.js-burger'),
								nav = document.querySelector('.header__top');
							document.body.classList.remove('ovh');
							burger.classList.remove('header__burger--active');
							fadeOut(nav, '0', function () {
								nav.classList.remove('active')
							});
						}

						if (target) {
							target.style.top = '' + topPosition + 'px';
							bg.classList.add('active');
							fadeIn(target, 350, function () {
								window.lexx.closePopup(target, true);
								target.classList.add('active');
								if (target.querySelector('.js-projects-popup-slider')) {
									window.lexx.projectsSlider();
								}
							});
						}
					});
				});
			}
		}
	}).init();

	window.lexx.openPopup = function openPopup(id) {
		var target = document.getElementById(id),
			topPosition = window.scrollY + 100,
			bg = document.querySelector('.js-popup-overflow');

		if (id == 'projects') {
			window.lexx.projectsSlider();
		}

		target.style.top = '' + topPosition + 'px';
		bg.classList.add('active');
		fadeIn(target, 350, function () {
			window.lexx.closePopup(target, true);
			target.classList.add('active');
		});
	};

	window.lexx.closePopup = function closePopup(popup, flag) {
		var btns = popup.querySelectorAll('.js-close-popup'),
			bg = document.querySelector('.js-popup-overflow');

		// function handler(event) {
		// 	if (!popup.contains(event.target)) {
		// 		fadeOut(bg, 500);
		// 		fadeOut(popup, 500);
		// 		document.removeEventListener('click', handler);
		// 	}
		// }

		// document.addEventListener('click', handler);

		function closing(e) {
			bg.classList.remove('active');
				if (popup.querySelector('.js-projects-popup-slider').swiper) {
					popup.querySelector('.js-projects-popup-slider').swiper.destroy(true, true)
				}
				fadeOut(popup, 0, function () {
			});
			popup.classList.remove('active')
			// document.removeEventListener('click', handler);
			e.target.removeEventListener('click', closing);
		}

		if (flag) {
			btns.forEach(function (item) {
				item.addEventListener('click', closing, {passive: true});
			})
		} else {
			bg.classList.remove('active');
			popup.classList.remove('active')

			fadeOut(popup, 0, function () {
				if (popup.querySelector('.js-projects-popup-slider')) {
					popup.querySelector('.js-projects-popup-slider').swiper.destroy(true, true)
				}
			});
			// document.removeEventListener('click', handler);
		}
	};

}());
