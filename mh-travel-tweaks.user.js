// ==UserScript==
// @name         🐭️ Mousehunt - Travel Tweaks
// @version      2.0.1
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
	 * Get the saved settings.
	 *
	 * @param {string} key The key to get.
	 *
	 * @return {Object} The saved settings.
	 */
	const getSetting = (key = null) => {
		const settings = JSON.parse(localStorage.getItem('mh-mouseplace-settings')) || {};

		if (key) {
			return settings[ key ];
		}

		return settings;
	};

	/**
	 * Save a setting.
	 *
	 * @param {string}  key   The setting key.
	 * @param {boolean} value The setting value.
	 *
	 */
	const saveSettings = (key, value) => {
		const settings = getSetting();
		settings[ key ] = value;

		localStorage.setItem('mh-mouseplace-settings', JSON.stringify(settings));
	};

	/**
	 * Save a setting.
	 *
	 * @param {Node}    node  The setting node to animate.
	 * @param {string}  key   The setting key.
	 * @param {boolean} value The setting value.
	 */
	const saveSetting = (node, key, value) => {
		node.classList.toggle('active');

		saveSettings(key, value);

		node.parentNode.classList.add('completed');
		setTimeout(() => {
			node.parentNode.classList.remove('completed');
		}, 1000);
	};

	/**
	 * Add a setting to the preferences page.
	 *
	 * @param {string}  name         The setting name.
	 * @param {string}  key          The setting key.
	 * @param {boolean} defaultValue The default value.
	 * @param {string}  description  The setting description.
	 */
	const addSetting = (name, key, defaultValue, description) => {
		if ('preferences' !== getCurrentPage()) {
			return;
		}

		const container = document.querySelector('.mousehuntHud-page-tabContent.game_settings');
		if (! container) {
			return;
		}

		const sectionExists = document.querySelector('#mh-mouseplace-settings');
		if (! sectionExists) {
			const title = document.createElement('div');
			title.id = 'mh-mouseplace-settings';
			title.classList.add('gameSettingTitle');
			title.textContent = 'Userscript Settings';

			container.appendChild(title);

			const seperator = document.createElement('div');
			seperator.classList.add('separator');

			container.appendChild(seperator);
		}

		const settingExists = document.getElementById(`mh-mouseplace-setting-${ key }`);
		if (settingExists) {
			return;
		}

		const settings = document.createElement('div');
		settings.classList.add('settingRowTable');
		settings.id = `mh-mouseplace-setting-${ key }`;

		const settingRow = document.createElement('div');
		settingRow.classList.add('settingRow');

		const settingRowLabel = document.createElement('div');
		settingRowLabel.classList.add('settingRow-label');

		const settingName = document.createElement('div');
		settingName.classList.add('name');
		settingName.innerHTML = name;

		const defaultSettingText = document.createElement('div');
		defaultSettingText.classList.add('defaultSettingText');
		defaultSettingText.textContent = defaultValue ? 'Enabled' : 'Disabled';

		const settingDescription = document.createElement('div');
		settingDescription.classList.add('description');
		settingDescription.innerHTML = description;

		settingRowLabel.appendChild(settingName);
		settingRowLabel.appendChild(defaultSettingText);
		settingRowLabel.appendChild(settingDescription);

		const settingRowAction = document.createElement('div');
		settingRowAction.classList.add('settingRow-action');

		const settingRowInput = document.createElement('div');
		settingRowInput.classList.add('settingRow-action-inputContainer');

		const settingRowInputCheckbox = document.createElement('div');
		settingRowInputCheckbox.classList.add('mousehuntSettingSlider');

		const currentSetting = getSetting(key);
		if (defaultValue || currentSetting) {
			settingRowInputCheckbox.classList.add('active');
		}

		settingRowInputCheckbox.onclick = (event) => {
			saveSetting(event.target, key, ! currentSetting);
		};

		// Add the input to the settings row.
		settingRowInput.appendChild(settingRowInputCheckbox);
		settingRowAction.appendChild(settingRowInput);

		// Add the label and action to the settings row.
		settingRow.appendChild(settingRowLabel);
		settingRow.appendChild(settingRowAction);

		// Add the settings row to the settings container.
		settings.appendChild(settingRow);
		container.appendChild(settings);
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
		if (callbacks.change) {
			callbacks.change();
		}

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
		background-color: transparent;
		color: #4e6081;
	}

	#mh-simple-travel-page .travelPage-regionMenu-environmentLink:hover {
		background-color: #6383bf;
		color: #fff;
	}
`);
})());
