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
						iconImageHref: './static/i/pin.png',
						iconImageSize: [44, 49],
						cursor: 'default'
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

			//request.open('GET', '/data.json', true);

			if (map) {
				ymaps.ready(function () {
					var myMap = new ymaps.Map('yaMap', {
							center: [55.751574, 37.573856],
							zoom: 9
						}, {
							searchControlProvider: 'yandex#search'
						}),
						clusterNumbers = [5],
						clusterer = new ymaps.Clusterer({
							// Зададим массив, описывающий иконки кластеров разного размера.
							clusterIcons: [{
									href: './static/i/pin.png',
									size: [45, 49],
									offset: [-22, -25]
								},
								{
									href: './static/i/pin.png',
									size: [45, 49],
									offset: [-22, -25]
								}
							],
							// Эта опция отвечает за размеры кластеров.
							// В данном случае для кластеров, содержащих до 100 элементов,
							// будет показываться маленькая иконка. Для остальных - большая.
							clusterIconContentLayout: null,
							//clusterNumbers: clusterNumbers
						}),
						getPointData = function (index) {
							return {
								balloonContentBody: 'балун <strong>метки ' + index + '</strong>',
								clusterCaption: ''
							};
						},
						points = [
							[55.831903, 37.411961],
							[55.763338, 37.565466],
							[55.763338, 37.565466],
							[55.744522, 37.616378],
							[55.780898, 37.642889],
							[55.793559, 37.435983],
							[55.800584, 37.675638],
							[55.716733, 37.589988],
							[55.775724, 37.560840],
							[55.822144, 37.433781],
							[55.874170, 37.669838],
							[55.716770, 37.482338],
							[55.780850, 37.750210],
							[55.810906, 37.654142],
							[55.865386, 37.713329],
							[55.847121, 37.525797],
							[55.778655, 37.710743],
							[55.623415, 37.717934],
							[55.863193, 37.737000],
							[55.866770, 37.760113],
							[55.698261, 37.730838],
							[55.633800, 37.564769],
							[55.639996, 37.539400],
							[55.690230, 37.405853],
							[55.775970, 37.512900],
							[55.775777, 37.442180],
							[55.811814, 37.440448],
							[55.751841, 37.404853],
							[55.627303, 37.728976],
							[55.816515, 37.597163],
							[55.664352, 37.689397],
							[55.679195, 37.600961],
							[55.673873, 37.658425],
							[55.681006, 37.605126],
							[55.876327, 37.431744],
							[55.843363, 37.778445],
							[55.875445, 37.549348],
							[55.662903, 37.702087],
							[55.746099, 37.434113],
							[55.838660, 37.712326],
							[55.774838, 37.415725],
							[55.871539, 37.630223],
							[55.657037, 37.571271],
							[55.691046, 37.711026],
							[55.803972, 37.659610],
							[55.616448, 37.452759],
							[55.781329, 37.442781],
							[55.844708, 37.748870],
							[55.723123, 37.406067],
							[55.858585, 37.484980]
						],
						geoObjects = [];

					//   const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
					//   	"<span style='color: #000;'>{{ orderSum }}</span>"
					//   );

					//   // определяем ObjectManager
					// const objectManager = new ymaps.ObjectManager({
					// 	clusterize: true,
					// 	clusterIconContentLayout: MyIconContentLayout
					// });

					for (var i = 0, len = points.length; i < len; i++) {
						geoObjects[i] = new ymaps.Placemark(points[i], getPointData(i));
					}

					clusterer.add(geoObjects);
					myMap.geoObjects.add(clusterer);

					myMap.setBounds(clusterer.getBounds(), {
						checkZoomRange: true
					});

					// request.onload = function () {
					// 	if (this.status >= 200 && this.status < 400) {
					// 		var data = JSON.parse(this.response);
					// 		// objectManager.add(data);

					// 		for (var i = 0, len = data.features.length; i < len; i++) {
					// 			geoObjects[i] = new ymaps.Placemark(data.features[i].geometry.coordinates);
					// 		}
					// 	}
					// };

					// request.send();
				});
			}
		}
	}).init();

	window.lexx.popups = ({
		init: function () {
			var popups = document.querySelectorAll('.js-open-popup'),
				topPosition = window.scrollY + 100,
				bg = document.querySelector('.js-popup-overflow');

			if (popups) {
				popups.forEach(function (item) {
					var target = document.getElementById(item.dataset.popup);
					item.addEventListener('click', function (e) {
						e.preventDefault();
						if (document.body.classList.contains('ovh') && document.querySelector('.header__top').classList.contains('active')) {
							var burger = document.querySelector('.js-burger'),
								nav = document.querySelector('.header__top');
							document.body.classList.remove('ovh');
							burger.classList.remove('header__burger--active');
							fadeOut(nav, '350', function () {
								nav.classList.remove('active')
							});
						}

						if (target) {
							target.style.top = '' + topPosition + 'px';
							bg.classList.add('active');
							fadeIn(target, 350, function () {
								window.lexx.closePopup(target, true);
								target.classList.add('active');
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

		if (flag) {
			btns.forEach(function (item) {
				item.addEventListener('click', function (e) {
					bg.classList.remove('active');
					fadeOut(popup, 500, function () {});
					popup.classList.remove('active')
					// document.removeEventListener('click', handler);
				})
			});
		} else {
			bg.classList.remove('active');
			popup.classList.remove('active')

			fadeOut(popup, 500, function () {});
			// document.removeEventListener('click', handler);
		}
	};

}());
