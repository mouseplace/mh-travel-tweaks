// ==UserScript==
// @name         🐭️ Mousehunt - Travel Tweaks
// @version      2.1.0
// @description  Makes the travel page a bit better.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/gh/mouseplace/mousehunt-utils/mousehunt-utils.js
// ==/UserScript==

((function () {
	'use strict';

	/**
	 * Expand the travel regions and zoom the map.
	 */
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
		app.pages.TravelPage.zoomOut();

		// eslint-disable-next-line no-undef
		app.pages.TravelPage.zoomOut();

		const regionHeaders = document.querySelectorAll('.travelPage-regionMenu-regionLink');
		if (regionHeaders) {
			regionHeaders.forEach((regionHeader) => {
				regionHeader.setAttribute('onclick', 'return false;');
			});
		}

		const travelAreas = document.querySelectorAll('.travelPage-regionMenu-item');
		if (travelAreas && travelAreas.length > 0) {
			travelAreas.forEach((area) => {
				area.classList.add('active');
				area.classList.remove('contracted');
			});
		}

		const locations = document.querySelectorAll('.travelPage-map-image-environment.active');
		if (locations && locations.length > 0) {
			locations.forEach((location) => {
				location.addEventListener('mouseover', () => {
					location.classList.add('highlight');
				});
			});
			locations.forEach((location) => {
				location.addEventListener('mouseout', () => {
					setTimeout(() => {
						location.classList.remove('highlight');
					}, 1000);
				});
			});
		}
	};

	/**
	 * Add the tab for Simple Travel.
	 */
	const addSimpleTravelTab = () => {
		if ('travel' !== getCurrentPage()) {
			return;
		}

		const exists = document.getElementById('mh-simple-travel-tab');
		if (exists) {
			return;
		}

		const tabContainer = document.querySelector('.mousehuntHud-page-tabHeader-container');
		if (! tabContainer) {
			return;
		}

		const tab = document.createElement('a');
		tab.id = 'mh-simple-travel-tab';
		tab.classList.add('mousehuntHud-page-tabHeader');
		tab.setAttribute('data-tab', 'simple-travel');
		tab.setAttribute('onclick', 'hg.utils.PageUtil.onclickPageTabHandler(this); return false;');

		const tabText = document.createElement('span');
		tabText.textContent = 'Simple Travel';
		tab.appendChild(tabText);

		tabContainer.appendChild(tab);
	};

	/**
	 * Add the page for Simple Travel.
	 */
	const addSimpleTravelPage = () => {
		if ('travel' !== getCurrentPage()) {
			return;
		}

		const exists = document.getElementById('mh-simple-travel-page');
		if (exists) {
			return;
		}

		const pageContainer = document.querySelector('.mousehuntHud-page-tabContentContainer');
		if (! pageContainer) {
			return;
		}

		const page = document.createElement('div');
		page.id = 'mh-simple-travel-page';
		page.classList.add('mousehuntHud-page-tabContent');
		page.classList.add('simple-travel');
		page.setAttribute('data-tab', 'simple-travel');

		if (undefined === getSetting('simple-travel')) {
			const settingTip = document.createElement('div');
			settingTip.classList.add('travelPage-map-prefix');
			settingTip.classList.add('simple-travel-tip');
			settingTip.innerHTML = 'You can set this as the default travel tab in your <a href="https://www.mousehuntgame.com/preferences.php?tab=game_settings"> Game Settings</a>.';
			page.appendChild(settingTip);
		}

		const regionMenu = document.querySelector('.travelPage-regionMenu');
		if (! regionMenu) {
			return;
		}

		const regionMenuClone = regionMenu.cloneNode(true);
		const travelLinks = regionMenuClone.querySelectorAll('.travelPage-regionMenu-environmentLink');

		if (travelLinks && travelLinks.length > 0) {
			travelLinks.forEach((link) => {
				link.setAttribute('onclick', 'return false;');
				link.addEventListener('click', (event) => {
					const environment = event.target.getAttribute('data-environment');

					// eslint-disable-next-line no-undef
					app.pages.TravelPage.travel(environment);

					// eslint-disable-next-line no-undef
					hg.utils.PageUtil.setPage('Camp');

					return false;
				});
			});
		}

		page.appendChild(regionMenuClone);

		pageContainer.appendChild(page);
	};

	/**
	 * Check the setting and maybe default to Simple Travel.
	 */
	const maybeSwitchToSimpleTravel = () => {
		if ('travel' !== getCurrentPage()) {
			return;
		}

		const defaultTravel = getSetting('simple-travel');
		if (! defaultTravel) {
			return;
		}

		// eslint-disable-next-line no-undef
		hg.utils.PageUtil.setPageTab('simple-travel');

		const mapTab = document.querySelector('.mousehuntHud-page-tabHeader.map');
		if (mapTab) {
			mapTab.addEventListener('click', () => {
				setTimeout(() => {
					// eslint-disable-next-line no-undef
					app.pages.TravelPage.zoomIn();

					// eslint-disable-next-line no-undef
					app.pages.TravelPage.zoomIn();

					// eslint-disable-next-line no-undef
					app.pages.TravelPage.zoomIn();

					// eslint-disable-next-line no-undef
					app.pages.TravelPage.zoomIn();

					// eslint-disable-next-line no-undef
					app.pages.TravelPage.zoomOut();

					// eslint-disable-next-line no-undef
					app.pages.TravelPage.zoomOut();
				}, 100);
			});
		}
	};

	/**
	 * Add the tab & page for Simple Travel.
	 */
	const addSimpleTravel = () => {
		addSimpleTravelTab();
		addSimpleTravelPage();
		maybeSwitchToSimpleTravel();
	};

	/**
	 * Add the settings for Simple Travel.
	 */
	const addSimpleTravelSetting = () => {
		addSetting('Default to simple travel', 'simple-travel', false, 'Use the simple travel page by default.');
	};

	onPageChange({ change: expandTravelRegions });
	expandTravelRegions();

	onPageChange({ change: addSimpleTravel });
	addSimpleTravel();

	onPageChange({ change: addSimpleTravelSetting });
	addSimpleTravelSetting();

	if (window.location.search.includes('tab=simple-travel')) {
		// eslint-disable-next-line no-undef
		hg.utils.PageUtil.setPageTab('simple-travel');
	}

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
    .travelPage-regionMenu-environmentLink.active {
      background: #a4cafc;
      color: #000000;
    }

    .travelPage-regionMenu-stats {
      background-color: #d8d8d8;
      color: #4d4d4d;
    }

    .travelPage-regionMenu-numFriends {
      background: none;
      padding: 0;
    }

    .travelPage-mapContainer.full {
      height: auto;
      max-height: 900px;
      min-height: 800px;
      border: none;
    }

    .travelPage-map-imageContainer {
      width: 78%;
    }

    .travelPage-map-zoomContainer {
      transform: scale(1.5);
      bottom: 300px;
    }

    .travelPage-map-image-environment-name {
      font-size: 22px;
      font-variant: none;
      text-shadow: 1px 1px #000, 0px 0px 10px #000, 8px 12px 9px #000;
    }

    .travelPage-map-image-environment-pointer,
    .travelPage-map-image-environment:hover .travelPage-map-image-environment-pointer
    .travelPage-map-image-environment.highlight .travelPage-map-image-environment-pointer
    .travelPage-map-image-environment.current .travelPage-map-image-environment-pointer {
        background-image: none !important;
    }

    .travelPage-map-image-environment-pointer-image {
        border: 1px solid #9eb81a;
        border-radius: 60%;
        outline: 4px solid #afd134;
    }

    .travelPage-map-image-environment.locked .travelPage-map-image-environment-pointer-image {
      border: 1px solid #717171;
      outline: 4px solid #5e5e5e;
    }

    .travelPage-map-image-environment:hover .travelPage-map-image-environment-pointer-image {
        border: 1px solid #f8d853;
        outline: 4px solid #fae255;
    }

    .travelPage-map-image-environment.locked .travelPage-map-image-environment-button {
      opacity: 0.6;
    }

    .travelPage-map-image-environment.locked .travelPage-map-image-environment-status {
        opacity: 0.5;
        z-index: 1;
    }

    .travelPage-map-image-environment-name {
      top: 70px;
      z-index: 15;
    }

    .travelPage-map-image-environment-star {
      z-index: 10;
    }

    .travelPage-map-image-environment-button {
        top: 100px;
        transform: scale(1.2);
    }

	.travelPage-regionMenu-environmentLink.mystery {
		display: inline-block;
		color: #9e9e9e;
		pointer-events: none;
	}

	.travelPage-regionMenu-environmentLink-image {
		opactiy: 0.4;
	}

	.travelPage-regionMenu-item[data-region="riftopia"] {
		display: block !important;
	}

	.travelPage-regionMenu-item[data-region="riftopia"] .travelPage-regionMenu-item-contents {
		display: block !important;
	}

	.travelPage-regionMenu-regionLink:hover {
		cursor: unset;
	}

	#mh-simple-travel-page .travelPage-map-prefix {
		display: block;
	}

	#mh-simple-travel-page .travelPage-regionMenu {
		width: 100%;
		background-color: transparent;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		overflow: visible;
		margin-bottom: 50px;
	}

	#mh-simple-travel-page .travelPage-regionMenu-item {
		background-color: #e2e2e2;
		outline: 1px solid #4c71b4;
		margin: 1px;
	}

	#mh-simple-travel-page .travelPage-regionMenu-item[data-region="gnawnia"],
	#mh-simple-travel-page .travelPage-regionMenu-item[data-region="valour"],
	#mh-simple-travel-page .travelPage-regionMenu-item[data-region="whisker_woods"],
	#mh-simple-travel-page .travelPage-regionMenu-item[data-region="burroughs"],
	#mh-simple-travel-page .travelPage-regionMenu-item[data-region="furoma"] {
		min-height: 215px;
	}

	#mh-simple-travel-page .travelPage-regionMenu-item[data-region="riftopia"] {
		min-height: 250px;
	}

	#mh-simple-travel-page .travelPage-regionMenu-environments {
		box-shadow: none;
		width: 150px;
	}

	#mh-simple-travel-page .travelPage-regionMenu-item-contents {
		overflow: visible !important;
	}

	#mh-simple-travel-page .travelPage-regionMenu-environmentLink.active {
		color: #4e6081;
	}

	#mh-simple-travel-page .travelPage-regionMenu-environmentLink:hover {
		background-color: #6383bf;
		color: #fff;
	}
`);
})());
