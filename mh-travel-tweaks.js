// ==UserScript==
// @name         🐭️ Mousehunt - Travel Tweaks
// @version      1.0.0
// @description  Makes the travel page a bit better.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// ==/UserScript==

((function () {
	'use strict';

	/**
	 * Add styles to the page.
	 *
	 * @param {string} styles The styles to add.
	 */
	const addStyles = (styles) => {
		const existingStyles = document.getElementById('mh-mouseplace-custom-styles');

		if (existingStyles) {
			existingStyles.innerHTML += styles;
			return;
		}

		const style = document.createElement('style');
		style.id = 'mh-mouseplace-custom-styles';
		style.innerHTML = styles;
		document.head.appendChild(style);
	};

	/**
	 * Get the current page slug.
	 *
	 * @return {string} The page slug.
	 */
	const getCurrentPage = () => {
		const container = document.getElementById('mousehuntContainer');
		if (! container || container.classList.length <= 0) {
			return null;
		}

		return container.classList[ 0 ].replace('Page', '').toLowerCase();
	};

	/**
	 * Do something when the page or tab changes.
	 *
	 * @param {Object}   callbacks
	 * @param {Function} callbacks.show   The callback to call when the overlay is shown.
	 * @param {Function} callbacks.hide   The callback to call when the overlay is hidden.
	 * @param {Function} callbacks.change The callback to call when the overlay is changed.
	 */
	const onPageChange = (callbacks) => {
		const observer = new MutationObserver(() => {
			if (callbacks.change) {
				callbacks.change();
			}
		});

		const observeTarget = document.getElementById('mousehuntContainer');
		if (observeTarget) {
			observer.observe(observeTarget, {
				attributes: true,
				attributeFilter: ['class']
			});
		}
	};

	const expandTravelRegions = () => {
		if ('travel' !== getCurrentPage()) {
			return;
		}

		const hud = document.getElementById('mousehuntHud');
		if (hud) {
			const hudHeight = hud.offsetHeight + 30;

			const map = document.querySelector('.travelPage-mapContainer.full');
			if (map) {
				map.style.height = `calc(100vh - ${ hudHeight }px)`;
			}
		}

		// eslint-disable-next-line no-undef
		app.pages.TravelPage.showEnvironment('town_of_gnawnia', false);

		// eslint-disable-next-line no-undef
		app.pages.TravelPage.zoomOut();

		// eslint-disable-next-line no-undef
		app.pages.TravelPage.zoomOut();

		const travelAreas = document.querySelectorAll('.travelPage-regionMenu-item.contracted');
		if (travelAreas && travelAreas.length > 0) {
			travelAreas.forEach((area) => {
				area.classList.remove('contracted');
				area.classList.add('active');
			});
		}
	};

	onPageChange({ change: expandTravelRegions });
	expandTravelRegions();
	addStyles(`
    .travelPage-map-spacer,
    .travelPage-map-simpleToggle,
    .mousehuntHud-page-tabContent.map.full .travelPage-map-simpleToggle.full,
    .mousehuntHud-page-tabContent.map.full .travelPage-map-prefix.full {
        display: none;
    }

    .travelPage-regionMenu {
      overflow: scroll;
      width: 22%;
    }

    .travelPage-map-environment-detailContainer {
      width: 78%;
      left: 22%;
    }

    .travelPage-map-imageContainer {
      width: 78%;
    }

  .travelPage-regionMenu-environmentLink.active {
      background: #a4cafc;
      color: #000000;
    }

    .travelPage-regionMenu-stats {
        background-color: #d8d8d8;
        color: #4d4d4d;
    }

    .travelPage-mapContainer.full {
        height: auto;
        max-height: 900px;
        min-height: 800px;
		border: none;
      }

	.travelPage-map-zoomContainer {
		transform: scale(1.5);
		bottom: 300px;
	}

    .travelPage-regionMenu-numFriends {
        background: none;
        padding: 0;
    }`);
})());
