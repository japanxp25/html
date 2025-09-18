const abstractMapContainer = document.getElementById('abstract-map-container');
const popupCloseButton = document.getElementById('close-popup-btn');
const cleanDataButton = document.getElementById('clean-data-btn');
const popupPrefectureName = document.getElementById('popup-prefecture-name');
const checklistItemsDiv = document.getElementById('checklistItems');
const instagramPopup = document.getElementById('instagramPopup');
const cleanDataPopup = document.getElementById('cleanDataPopup');
const instagramIdInput = document.getElementById('instagramIdInput');
const saveInstagramIdButton = document.getElementById('saveInstagramId');
const savePngButton = document.getElementById('savePngButton');
const checkedItemsListDiv = document.getElementById('checkedItemsList');
const noItemsMessage = document.getElementById('no-items-message');
const checkedItemsPanel = document.getElementById('checkedItemsList'); 
const checklistPopup = document.getElementById('checklist-popup');
const levelColors = ['#ffffff', '#ffc971', '#ffb627', '#ff9505', '#e2711d','#cc5803'];

let langSelect = 'tc';
let selectedThemeTitle = '';
let totalMaxCount = 0;
let prefectureData = {};
let prefectureEnabled = {};
let activeTheme = '';

let saveData = false;
let totalCheckableItems = 0;
let currentlyCheckedItems = 0;
let currentInstagramId = '';
let currentGroupingType = 'region';
let isSimpleMode = false; 
let themeIcon = '';
let textLabel = {};

const MAP_SOURCE_WIDTH = 724; 
const MAP_SOURCE_HEIGHT = 800;

const DISPLAY_MAP_TARGET_HEIGHT = 800; 
const SCALE_FACTOR = DISPLAY_MAP_TARGET_HEIGHT / MAP_SOURCE_HEIGHT;

const prefectureElements = {};
const regionToPrefecturesMap = {};

function getPrefectureIcon(prefectureName) {
	const mapPrefectureEmojis = {
		"北海道":[{"icon": '❄️'}],
		"青森":[{"icon": '🍎'}],
		"秋田":[{"icon": '🐶'}],
		"岩手":[{"icon": "🦊"}],
		"山形":[{"icon": "🍛"}],
		"宮城":[{"icon": "🎎"}],
		"福島":[{"icon": "👹"}],

		"新潟":[{"icon": "🍢"}],
		"富山":[{"icon": "🍣"}],
		"石川":[{"icon": "🍙"}],
		"福井":[{"icon": "🍡"}],

		"群馬":[{"icon": "🍁"}],
		"栃木":[{"icon": "🍘"}],
		"茨城":[{"icon": "🌻"}],
		"埼玉":[{"icon": "🏕️"}],
		"千葉":[{"icon": "🏩"}],
		"東京":[{"icon": "🗼"}],
		"神奈川":[{"icon": "🚃"}],

		"長野":[{"icon": "🙊"}],
		"山梨":[{"icon": "🗻"}],
		"岐阜":[{"icon": "🏮"}],
		"静岡":[{"icon": "🌊"}],
		"愛知":[{"icon": "🚅"}],

		"滋賀":[{"icon": "🥷"}],
		"三重":[{"icon": "🎋"}],
		"京都":[{"icon": "👘"}],
		"奈良":[{"icon": "🌸"}],
		"兵庫":[{"icon": "🏯"}],
		"大阪":[{"icon": "⛩️"}],
		"和歌山":[{"icon": "🍂"}],

		"鳥取":[{"icon": "🐪"}],
		"岡山":[{"icon": "🔆"}],
		"島根":[{"icon": "🚡"}],
		"広島":[{"icon": "🎪"}],
		"山口":[{"icon": "🍱"}],

		"香川":[{"icon": "🚲"}],
		"愛媛":[{"icon": "🍜"}],
		"徳島":[{"icon": "🍥"}],
		"高知":[{"icon": "🍧"}],

		"佐賀":[{"icon": "🛳"}],
		"福岡":[{"icon": "💮"}],
		"大分":[{"icon": "♨️"}],
		"長崎":[{"icon": "🏰"}],
		"熊本":[{"icon": "🐋"}],
		"宮崎":[{"icon": "🎏"}],
		"鹿児島":[{"icon": "⚓"}],

		"沖縄":[{"icon": "🛵"}]
	};
	
	const [icon] = mapPrefectureEmojis[prefectureName];
	return icon.icon;
}

function loadScript(url, callback) {
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
	script.onreadystatechange = callback;
    script.onload = callback;
	head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', async () => {
	let popupContent; 
	popupContent = document.getElementById('popup-content');
    const API_URL = 'prefectureData.js'; 

    if (!abstractMapContainer) console.error("Error: 'abstract-map-container' not found.");
    if (!checklistPopup) console.error("Error: 'checklist-popup' not found.");
    if (!popupPrefectureName) console.error("Error: 'popup-prefecture-name' not found. Please add <h2 id='popup-prefecture-name'></h2> to your HTML popup structure.");
    if (!popupContent) console.error("Error: 'popup-content' not found.");
    if (!popupCloseButton) console.error("Error: 'close-popup-btn' not found.");
	
    if (localStorage.getItem('prefLang')) {
		langSelect = localStorage.getItem('prefLang');
//		const displayedInstagramId = document.getElementById("langOptionSelect").value=langSelect;
    }

	loadLangPack();
//	var jsFilePath = "mapData_" + langSelect + ".js";
//	loadScript(jsFilePath, loadLangPack);

    dataSourceSelect.addEventListener('change', (event) => {
		const selectedApiUrl = event.target.value;
		selectedThemeTitle = event.target.options[event.target.selectedIndex].dataset.title;
		prefectureData = {};
        loadPrefectureData(selectedApiUrl);
    });
/*
	langOptionSelect.addEventListener('change', (event) => {
		langSelect = langOptionSelect.value;
		localStorage.setItem('prefLang', langSelect);
		loadDataSources();
    });
*/
	for (const prefecture in prefectureToRegionMap) {
		const region = prefectureToRegionMap[prefecture];
		if (!regionToPrefecturesMap[region]) {
			regionToPrefecturesMap[region] = [];
		}
		regionToPrefecturesMap[region].push(prefecture);
	}
	updateCheckedList(currentGroupingType); // Call with the initial grouping type

    window.addEventListener('click', (event) => {
        if (event.target === checklistPopup || event.target === instagramPopup) {
            closePopups();
        }
    });

	popupCloseButton.addEventListener('click', closePopups);
	
    savePngButton.addEventListener('click', () => {
        closePopups();
        savePngButton.classList.add('hide-on-screenshot');
        const counterBox = document.querySelector('.counter-box');
        const instagramDisplay = document.querySelector('.instagram-display');
        if (counterBox) counterBox.classList.add('hide-on-screenshot');
        if (instagramDisplay) instagramDisplay.classList.add('hide-on-screenshot');

        html2canvas(document.querySelector('.container'), {
            allowTaint: true,
            useCORS: true,
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'japan_checklist.png';
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            savePngButton.classList.remove('hide-on-screenshot');
            if (counterBox) counterBox.classList.remove('hide-on-screenshot');
            if (instagramDisplay) instagramDisplay.classList.remove('active');
        });
    });

	saveInstagramIdButton.addEventListener('click', () => {
		if(instagramIdInput.value.trim() !== ''){
			currentInstagramId = instagramIdInput.value;
			localStorage.setItem('instagramId', currentInstagramId);
		}
		closePopups();
		renderInstagramDisplay();
	});

	renderCounterBox();
	renderInstagramDisplay();
	loadDataSources();
	
});



function removeIconFromPrefecture(prefectureBlock, prefectureName) {
    if (!prefectureBlock) {
        console.error('Prefecture block element is null or undefined.');
        return;
    }

    const iconElement = prefectureBlock.querySelector('.prefecture-icon');
    if (iconElement) {
        prefectureBlock.removeChild(iconElement);
    }
}

function addRandomIconToPrefecture(prefectureBlock, prefectureName) {
    if (!prefectureBlock) {
        console.error('Prefecture block element is null or undefined.');
        return;
    }
	const existingIcon = prefectureBlock.querySelector('.prefecture-icon');
    if (existingIcon) {
        existingIcon.remove();
    }
    const iconElement = document.createElement('span');
	
    iconElement.classList.add('prefecture-icon');
    iconElement.textContent = getPrefectureIcon(prefectureName);

    prefectureBlock.appendChild(iconElement);
}


function updateCheckedList(groupingType = currentGroupingType) {
	const allCheckedItemsWithDetails = [];
	for (const prefectureName in prefectureData) {
		if (prefectureData.hasOwnProperty(prefectureName)) {
			const items = prefectureData[prefectureName] || [];
			const regionName = prefectureToRegionMap[prefectureName] || "その他地域";
			items.forEach(item => {
				if (item.checked) {
					allCheckedItemsWithDetails.push({
						item: item,
						prefecture: prefectureName,
						region: regionName
					});
				}
			});
		}
	}
	
	const listHeading = document.createElement('h2');
	checkedItemsPanel.innerHTML = '';
	
	if (allCheckedItemsWithDetails.length === 0) {
		const noItemsMessage = document.createElement('p');
		noItemsMessage.classList.add('empty-list-message');
		//noItemsMessage.textContent = "No items checked yet.";
		noItemsMessage.textContent = textLabel['textNoData'];;
		checkedItemsPanel.appendChild(noItemsMessage);
		return;
	}

	const groupedByRegion = {};
	allCheckedItemsWithDetails.forEach(detail => {
		if (!groupedByRegion[detail.region]) {
			groupedByRegion[detail.region] = {};
		}
		if (!groupedByRegion[detail.region][detail.prefecture]) {
			groupedByRegion[detail.region][detail.prefecture] = [];
		}
		groupedByRegion[detail.region][detail.prefecture].push(detail.item);
	});
	
//	const sortedRegions = Object.keys(groupedByRegion).sort((a, b) => a.localeCompare(b, 'ja', { sensitivity: 'base' }));
	const sortedRegions = Object.keys(groupedByRegion);
	sortedRegions.forEach(regionName => {
		console.log("#" + regionName);
		const prefecturesInRegion = Object.keys(groupedByRegion[regionName]);
		if (prefecturesInRegion.length > 0) {
			const regionHeader = document.createElement('h3');
			regionHeader.textContent = regionName;
			regionHeader.classList.add('region-list-header');
			checkedItemsPanel.appendChild(regionHeader);
			const sortedPrefecturesInRegion = prefecturesInRegion.sort((a, b) => a.localeCompare(b, 'ja', { sensitivity: 'base' }));
			const ul = document.createElement('ul');
			ul.classList.add('checked-items-list');
			sortedPrefecturesInRegion.forEach(prefectureName => {
				const items = groupedByRegion[regionName][prefectureName];
				if (items.length > 0) {
					items.forEach(item => {
						//li.textContent = getPrefectureIcon(prefectureName) + " " + item.name;
						const li = document.createElement('li');
						const icon = getPrefectureIcon(prefectureName);
						li.innerHTML = `<span class="item-icon">${icon}</span> <span class="item-place">${item.name}:</span> <span class="item-name">${prefectureName}</span>`;
						li.dataset.id = item.id;
						li.dataset.icon = icon;
						li.addEventListener('click', () => {
							const prefectureBlock = document.getElementById(item.id);
							if (prefectureBlock) {
								prefectureBlock.click(); // This will open the existing pop-up
							} else {
								console.error('Prefecture block not found:', item.id);
							}
						});
						li.classList.add('checked-item-entry');
						ul.appendChild(li);
					});
				}
			});				
			checkedItemsPanel.appendChild(ul);
		}
	});
}



function renderCheckedItemsList() {
	checkedItemsListDiv.innerHTML = '';
	const checkedItemsByRegion = {};

	for (const prefectureName in prefectureData) {
		const regionName = prefectureToRegionMap[prefectureName] || 'Other Region';
		const checkedItemsInPrefecture = prefectureData[prefectureName].filter(item => item.checked);
		if (checkedItemsInPrefecture.length > 0) {
			if (!checkedItemsByRegion[regionName]) {
				checkedItemsByRegion[regionName] = [];
			}
			
			checkedItemsInPrefecture.forEach(item => {
				checkedItemsByRegion[regionName].push({
					prefecture: prefectureName,
					name: item.name,
					id: "prefecture-" + prefectureName,
					icon: getPrefectureIcon(prefectureName)
				});
			});
		}
	}
	

	const sortedRegionNames = Object.keys(checkedItemsByRegion).sort();

	if (sortedRegionNames.length === 0) {
		checkedItemsListDiv.appendChild(noItemsMessage);
		noItemsMessage.style.display = 'block';
	} else {
		noItemsMessage.style.display = 'none';
		sortedRegionNames.forEach(regionName => {
			const regionHeader = document.createElement('h3');
			regionHeader.textContent = regionName;
			checkedItemsListDiv.appendChild(regionHeader);

			const ul = document.createElement('ul');
			ul.classList.add('checked-items-list');
			checkedItemsByRegion[regionName].sort((a, b) => a.name.localeCompare(b.name));
			checkedItemsByRegion[regionName].forEach(item => {
				const checkedItem = document.createElement('li');
				const shortPrefectureName = item.prefecture;
				checkedItem.innerHTML = `<span class="item-icon">${item.icon}</span> <strong>${shortPrefectureName}:</strong> <span class="item-name">${item.name}</span>`;
				checkedItem.dataset.id = item.id; 
				checkedItem.dataset.icon = item.icon;
				
				// Add a click event listener to the list item
				checkedItem.addEventListener('click', () => {
					// Get the corresponding prefecture block element
					const prefectureBlock = document.getElementById(item.id);

					// Trigger the click event on the prefecture block
					if (prefectureBlock) {
						prefectureBlock.click(); // This will open the existing pop-up
					} else {
						console.error('Prefecture block not found:', item.id);
					}
				});
				checkedItem.classList.add('checked-item-entry');
				ul.appendChild(checkedItem);
			});
			checkedItemsListDiv.appendChild(ul);
		});
	}
}


function calculateTotalItems() {
	totalCheckableItems = 0;
	
	for (const prefectureName in prefectureData) {
		if (prefectureData.hasOwnProperty(prefectureName) && Array.isArray(prefectureData[prefectureName])) {
			totalCheckableItems += prefectureData[prefectureName].length;
		}
	}
	
	const totalItemsCountSpan = document.getElementById('totalItemsCount');
	totalMaxCount = totalCheckableItems;
	totalItemsCountSpan.textContent = totalCheckableItems;
}

function updateCounter() {
	const selectedItemsCountSpan = document.getElementById('selectedItemsCount');
	currentlyCheckedItems = 0;
	for (const prefecture in prefectureData) {
		prefectureData[prefecture].forEach(item => {
			if (item.checked) {
				currentlyCheckedItems++;
			}
		});
	}
	selectedItemsCountSpan.textContent = currentlyCheckedItems;
	updateCounterAndColor(currentlyCheckedItems);
	//checkCounterRank();
}

function isAnyItemChecked(prefectureName) {
	const items = prefectureData[prefectureName];
	if (!items || items.length === 0) {
		return false;
	}
	return items.some(item => item.checked);
}

function isAnyItemDisabled(prefectureName) {
	const items = prefectureEnabled[prefectureName];
	if (!items || items.length === 0 || items == undefined) {
		return false;
	}
	return true;
}
	
function updatePrefectureBlockVisual(prefectureName) {
	const prefectureBlock = abstractMapContainer.querySelector(`[data-prefecture="${prefectureName}"]`);
	if (prefectureBlock) {
		if (isAnyItemChecked(prefectureName)) {
			prefectureBlock.classList.add('prefecture-checked');
			addRandomIconToPrefecture(prefectureBlock, prefectureName);
		} else {
			prefectureBlock.classList.remove('prefecture-checked');
			removeIconFromPrefecture(prefectureBlock, prefectureName);
		}
	}
}

function disablePrefectureBlockVisual(prefectureName) {
	const prefectureBlock = abstractMapContainer.querySelector(`[data-prefecture="${prefectureName}"]`);
	if (prefectureBlock) {
		//console.log("isAnyItemDisabled(" + prefectureName + "):" + isAnyItemDisabled(prefectureName));
		if(!isAnyItemDisabled(prefectureName)) {
			prefectureBlock.classList.add('prefecture-disabled');
		}
	}
}

function updateAllPrefectureBadges() {
	if (isSimpleMode) {
		// Clear all badges in simple mode
		document.querySelectorAll('.badge').forEach(badge => badge.remove());
		// Remove all prefecture-specific styling
		for (const id in prefectureElements) {
			prefectureElements[id].classList.remove('selected', 'prefecture-checked');
		}
		return;
	}

	for (const prefectureName in prefectureData) {
		if (prefectureData.hasOwnProperty(prefectureName)) {
			updatePrefectureBadge(prefectureName);
		}
	}
}

function updatePrefectureBadge(prefectureName) {
	const prefectureBlock = abstractMapContainer.querySelector(`[data-prefecture="${prefectureName}"]`);
	if (!prefectureBlock) return;

	const badge = prefectureBlock.querySelector('.checked-count-badge');
	if (!badge) return;

	const items = prefectureData[prefectureName];
	if (!items) {
		badge.style.display = 'none';
		return;
	}

	const checkedCount = items.filter(item => item.checked).length;

	if (checkedCount > 0) {
		badge.textContent = checkedCount;
		badge.style.display = 'flex'; // Show the badge
	} else {
		badge.style.display = 'none'; // Hide the badge
	}
}

function updateRegionColors() {
	// First, remove all previous region styling
	for (const region in regionToPrefecturesMap) {
		regionToPrefecturesMap[region].forEach(prefectureName => {
			const mapBlockId = Object.keys(prefectureIdToNameMap).find(key => prefectureIdToNameMap[key] === prefectureName);
			const mapBlock = prefectureElements[mapBlockId];
			if (mapBlock) {
				mapBlock.classList.remove('region-checked', 'selected', 'prefecture-checked');
			}
		});
	}
	
	// Now, apply new styling based on checked items
	const checkedRegions = new Set();
	for (const prefectureName in prefectureData) {
		if (prefectureData.hasOwnProperty(prefectureName)) {
			const items = prefectureData[prefectureName];
			if (items && items.some(item => item.checked)) {
				checkedRegions.add(prefectureToRegionMap[prefectureName]);
			}
		}
	}

	checkedRegions.forEach(regionName => {
		const prefecturesInRegion = regionToPrefecturesMap[regionName];
		if (prefecturesInRegion) {
			prefecturesInRegion.forEach(prefectureName => {
				const mapBlockId = Object.keys(prefectureIdToNameMap).find(key => prefectureIdToNameMap[key] === prefectureName);
				const mapBlock = prefectureElements[mapBlockId];
				if (mapBlock) {
					mapBlock.classList.add('region-checked');
				}
			});
		}
	});
}

function updateTotalSelectedItemsCount() {
	let count = 0;
	const counterBox = document.querySelector('.counter-box');
	const selectedItemsCountSpan = document.getElementById('selectedItemsCount');
	const totalItemsCountSpan = document.getElementById('totalItemsCount');

	if (isSimpleMode) {
		const countedRegions = new Set();
		for (const prefectureName in prefectureData) {
			if (prefectureData.hasOwnProperty(prefectureName) && Array.isArray(prefectureData[prefectureName])) {
				if (prefectureData[prefectureName].some(item => item.checked)) {
					countedRegions.add(prefectureToRegionMap[prefectureName]);
				}
			}
		}
		count = countedRegions.size;
		totalItemsCountSpan.textContent = Object.keys(regionToPrefecturesMap).length;
	} else {
		for (const prefectureName in prefectureData) {
			if (prefectureData.hasOwnProperty(prefectureName) && Array.isArray(prefectureData[prefectureName])) {
				prefectureData[prefectureName].forEach(item => {
					if (item.checked) {
						count++;
					}
				});
			}
		}
		totalItemsCountSpan.textContent = totalItems;
	}
	selectedItemsCountSpan.textContent = count;
	updateCounterAndColor(count);
}

function createAbstractMapRegions() {
	
	abstractMapContainer.innerHTML = '';
	prefectureCoords.forEach(pref => {
		const [x1_orig, y1_orig, x2_orig, y2_orig, name, regionClass, regionClassActive, dispmode] = pref;
		var pEnabled = true;
		const prectureSize = Object.values(prefectureData).length;

		if (!prefectureData[name] || prectureSize <=0) {
			pEnabled = false;
		}

		// Directly scale coordinates (no internal rotation)
		const scaledX1 = x1_orig * SCALE_FACTOR;
		const scaledY1 = y1_orig * SCALE_FACTOR;
		const scaledX2 = x2_orig * SCALE_FACTOR;
		const scaledY2 = y2_orig * SCALE_FACTOR;

		const width = scaledX2 - scaledX1;
		const height = scaledY2 - scaledY1;

		const prefDiv = document.createElement('div');
		if (dispmode=="p") {
			prefDiv.classList.add('prefecture-block');
		} else {
			prefDiv.classList.add('prefecture-block-l');
		}
		if (regionClass) {
			prefDiv.classList.add(regionClass);
		}
		prefDiv.style.left = `${scaledX1}px`;
		prefDiv.style.top = `${scaledY1}px`;
		prefDiv.style.width = `${width}px`;
		prefDiv.style.height = `${height}px`;
		prefDiv.dataset.prefecture = name;
		prefDiv.textContent = name;
		prefDiv.id = 'prefecture-' + name;
		//prefDiv.dataset.id = item.id; 

		if(pEnabled) {
			prefDiv.addEventListener('click', (event) => {
				const prefectureName = event.target.dataset.prefecture;
				if (prefectureName && prefectureData[prefectureName]) {
					popupPrefectureName.textContent = prefectureName; 
					checklistPopup.style.display = 'flex'; 
					checklistPopup.classList.add('show'); 
				}
			});
			
			//addRandomIconToPrefecture(prefDiv);
		} else {
			console.log(">> disabled region : " + name);
			prefDiv.classList.add('prefecture-disabled');
			//addRandomIconToPrefecture(prefDiv, name);
			disablePrefectureBlockVisual(name);
		}
		// NEW: Create and append the badge
		const badge = document.createElement('span');
		badge.classList.add('checked-count-badge');
		prefDiv.appendChild(badge); // Add badge to the prefecture div
		abstractMapContainer.appendChild(prefDiv);

	});
}

function attachPrefectureClickHandlers() {
	const prefectureBlocks = abstractMapContainer.querySelectorAll(".prefecture-block,.prefecture-block-l");
	prefectureBlocks.forEach(block => {
		const items = prefectureEnabled[block.dataset.prefecture];
		if (items && items.length >= 0 && items != undefined) {
			block.addEventListener('click', () => {
				const prefectureName = block.dataset.prefecture;
				if (prefectureName) {
					showChecklistPopup(prefectureName); // This function should handle setting the title
				}
			});
		}
	});
}

function closeChecklistPopup() { 
	if (checklistPopup) { 
		checklistPopup.classList.remove('active'); 
		document.body.style.overflow = ''; 
		
		const currentPrefectureName = popupPrefectureName ? popupPrefectureName.textContent : null;
		const prefDiv = document.getElementById('prefecture=' + currentPrefectureName);

		if (currentPrefectureName) {
			updatePrefectureBadge(currentPrefectureName);
			console.log(`Updated badge for: ${currentPrefectureName}`); // For debugging
			addRandomIconToPrefecture(prefDiv, currentPrefectureName);
		} else {
			console.warn("Could not determine current prefecture name to update badge on dialog close.");
		}
		updateCounter();
		updateCheckedList(currentGroupingType);
		//renderCheckedItemsList();
	} else {
		removeIconFromPrefecture(prefDiv);
		console.error("Cannot close popup: 'checklistPopup' is null in closeChecklistPopup.");
	}
}

function closePopups() {
	console.log('close' + checklistPopup.classList.contains('active') ); // For debugging
	if (checklistPopup.classList.contains('active')) {
		checklistPopup.classList.remove('active');
		closeChecklistPopup();
		document.body.style.overflow = '';
	} else {
		instagramPopup.classList.remove('active');
		console.error("Error: 'checklistPopup' element is null in closeChecklistPopup function. Check your HTML ID 'checklist-popup'.");
	}
}

function toggleIGPopup() {
	console.log('ig btn clicked');
}

function savePrefectureData(apiUrl) {
	const localStorageKey = `prefectureData_${apiUrl}`;
	localStorage.setItem(localStorageKey, JSON.stringify(prefectureData));
}

function updateUI() {
	createAbstractMapRegions(); 
    attachPrefectureClickHandlers(); 
	renderCounterBox();
	renderInstagramDisplay();
	if (isSimpleMode) {
		updateRegionColors();
	}
    calculateTotalItems();
	
    if (localStorage.getItem('instagramId')) {
		const displayedInstagramId = document.getElementById('displayedInstagramId');
        currentInstagramId = localStorage.getItem('instagramId');
        displayedInstagramId.textContent = currentInstagramId;
    }

    if (localStorage.getItem(activeTheme)) {
        const savedData = JSON.parse(localStorage.getItem(activeTheme));
        for (const prefName in prefectureData) {
            if (savedData[prefName]) {
                prefectureData[prefName].forEach(item => {
                    const savedItem = savedData[prefName].find(sItem => sItem.id === item.id);
                    if (savedItem) {
                        item.checked = savedItem.checked;
                    }
                });
            }
        }
        updateCounter();
    }

    for (const prefName in prefectureData) {
        updatePrefectureBlockVisual(prefName);
		updatePrefectureBadge(prefName); 
    }

	prefectureCoords.forEach(pref => {
            const [x1_orig, y1_orig, x2_orig, y2_orig, name, regionClass, dispmode] = pref;
			disablePrefectureBlockVisual(name);
	});
	updateAllPrefectureBadges();
	updateTotalSelectedItemsCount();
	//renderCheckedItemsList();
	updateCheckedList(currentGroupingType);
}


function showChecklistPopup(prefectureName) {
	const popup = document.getElementById('checklist-popup');
	const popupContent = document.getElementById('popup-content');
	const popupTitle = document.getElementById('popup-prefecture-name');
	
	popupTitle.textContent = prefectureName; 
	popupContent.innerHTML = ''; 
	console.log(">popupTitle:" + popupTitle);
	const items = prefectureData[prefectureName];
	
	const checklistDiv = document.createElement('div');
	checklistDiv.classList.add('checklist-items'); 
	
	if (!items || items.length === 0) {
		checklistDiv.innerHTML = "<p>この都道府には選択可能なアイテムがありません。</p>";
	} else {
		items.forEach(item => {
			const itemDiv = document.createElement('div');
			itemDiv.classList.add('checklist-item');
			
			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.id = `item-${prefectureName}-${item.name.replace(/\s/g, '-')}`;
			checkbox.checked = item.checked;
			checkbox.addEventListener('change', () => {
				item.checked = checkbox.checked;
				const currentApiUrl = dataSourceSelect.value;
				savePrefectureData(currentApiUrl);

				const prefectureBlock = document.getElementById('prefecture-' + prefectureName);
				if (item.checked) {
					addRandomIconToPrefecture(prefectureBlock, prefectureName);
					updatePrefectureBlockVisual(prefectureName);
				} else {
					removeIconFromPrefecture(prefectureBlock, prefectureName);
					disablePrefectureBlockVisual(prefectureName);
				}
			});
			
			const label = document.createElement('label');
			label.htmlFor = checkbox.id;
			label.textContent = item.name;

			itemDiv.appendChild(checkbox);
			itemDiv.appendChild(label);
			checklistDiv.appendChild(itemDiv);
		});
	}
	
	popupContent.appendChild(checklistDiv);
	
	checklistPopup.classList.add('active');
	document.body.style.overflow = 'hidden';
}

function renderCounterBox(itemCount) {
    const mapContainer = document.getElementById('abstract-map-container');
    const counterBox = document.createElement('div');
    counterBox.classList.add('counter-box', 'hide-on-screenshot');

    const scoreContainer = document.createElement('div');
    scoreContainer.classList.add('score-container');
	const textTitle = document.createElement('span');
	textTitle.id = "themeTitle";
	textTitle.textContent = selectedThemeTitle;
	textTitle.classList.add('textTitle');

	const textNode1 = document.createElement('span');
	textNode1.id = "textScore";
	textNode1.textContent = textLabel['textScore'];
	textNode1.classList.add('textNote');
	
	const selectedItemsCountSpan = document.createElement('span');
	selectedItemsCountSpan.id = "selectedItemsCount";
    selectedItemsCountSpan.textContent = '0'; // Initial value
    const textNode2 = document.createTextNode(' / ');
    const totalSpan = document.createElement('span');
    totalSpan.id = 'totalItemsCount';
    (totalMaxCount > 0) ? totalSpan.textContent = totalMaxCount : totalSpan.textContent = '0';

    const colorIndicatorSpan = document.createElement('div');
    colorIndicatorSpan.classList.add('level-color-indicator');
	colorIndicatorSpan.id = "levelColorIndicator";
    colorIndicatorSpan.style.backgroundColor = 'initial'; // Default color
	scoreContainer.appendChild(textTitle);
    scoreContainer.appendChild(textNode1);
    scoreContainer.appendChild(selectedItemsCountSpan);
    scoreContainer.appendChild(textNode2);
    scoreContainer.appendChild(totalSpan);
    scoreContainer.appendChild(colorIndicatorSpan);

    const levelScale = document.createElement('div');
    levelScale.classList.add('level-scale');

    const totalItems = totalMaxCount > 0 ? totalMaxCount : 0;
    	
    for (let i = 0; i < 6; i++) {
        const level = document.createElement('div');
        level.classList.add('level');
        level.dataset.level = i + 1;
        level.style.backgroundColor = levelColors[i];
        levelScale.appendChild(level);
    }

    counterBox.appendChild(scoreContainer);
    counterBox.appendChild(levelScale);
    mapContainer.appendChild(counterBox);

	updateCounterAndColor('0');

    return {
        counterBox,
        selectedItemsCountSpan,
        totalSpan,
        colorIndicatorSpan
    };
}

function updateCounterAndColor(selectedCount) {
	const colorIndicatorSpan = document.querySelector('.level-color-indicator');
	const selectedItemsCountSpan = document.getElementById('selectedItemsCount');
	const totalItemsCountSpan = document.getElementById('totalItemsCount');

    selectedItemsCountSpan.textContent = selectedCount;
	totalCount = totalItemsCountSpan.textContent;

    const percentage = totalCount > 0 ? selectedCount / totalCount : 0;
	console.log(">>percentage:" + percentage);
    let colorIndex;
	
    if (percentage <= 0) {
        colorIndex = 0;
    } else if (percentage <= 0.2) {
        colorIndex = 1;
    } else if (percentage <= 0.4) {
        colorIndex = 2;
    } else if (percentage <= 0.6) {
        colorIndex = 3;
    } else if (percentage <= 0.8) {
        colorIndex = 4;
    } else {
        colorIndex = 5	;
    }

    colorIndicatorSpan.style.backgroundColor = levelColors[colorIndex];
}

function renderCleanDataBtn() {
    const mapContainer = document.getElementById('abstract-map-container');
    const clearDataDisplay = document.createElement('div');
	clearDataDisplay.classList.add('cleardata-display');
    clearDataDisplay.id = 'clearDataButton';
    const idSpan = document.createElement('span');
    idSpan.id = 'displayedInstagramId';
	idSpan.textContent = 'N/A';
    instagramDisplay.appendChild(idSpan);
    mapContainer.appendChild(clearDataDisplay);
    clearDataDisplay.addEventListener('click', () => {
        cleanDataPopup.style.display = 'flex';
		cleanDataPopup.classList.add('active');
    });

    return clearDataDisplay;
}

function renderInstagramDisplay() {

    const mapContainer = document.getElementById('abstract-map-container');
    const instagramDisplay = document.createElement('div');
    //instagramDisplay.classList.add('instagram-display', 'hide-on-screenshot');
	instagramDisplay.classList.add('instagram-display');
    instagramDisplay.id = 'instagramNameButton';
    const textNode = document.createTextNode('IG: ');
    const idSpan = document.createElement('span');
    idSpan.id = 'displayedInstagramId';
	const idValue = localStorage.getItem('instagramId');
	(idValue!=='')?idSpan.textContent = idValue: idSpan.textContent = 'N/A';
    instagramDisplay.appendChild(textNode);
    instagramDisplay.appendChild(idSpan);
    mapContainer.appendChild(instagramDisplay);

    instagramDisplay.addEventListener('click', () => {
        instagramIdInput.value = currentInstagramId;
        instagramPopup.style.display = 'flex';
		instagramPopup.classList.add('active');
    });

    return instagramDisplay;
}

function updateLangText() {
	for (keys in textLabel) {
		if(document.getElementById(keys))
			document.getElementById(keys).textContent = textLabel[keys];
	}
}

async function loadPrefectureData(apiUrl, titleText = '') {
	const localStorageKey = `prefectureData_${apiUrl}`;
	activeTheme = localStorageKey;
	const savedData = localStorage.getItem(localStorageKey);
	console.log(">loadPrefectureData:" + apiUrl);
	let processedData = {};
		try {
			if (savedData && saveData) {
				processedData = JSON.parse(savedData);
			} else {
				try {
					const response = await fetch(apiUrl);
					const data = await response.json();
					for (const prefName in data) {
						const foundCoord = prefectureCoords.find(coord => coord[4] === prefName);
						if (foundCoord) {
							processedData[prefName] = data[prefName].map(item => ({ ...item, checked: false }));
							prefectureEnabled[prefName] = data[prefName].map(item => ({ ...item, enabled: true }));
						} else {
							processedData[prefName] =  ({ prefName, checked: false });
							prefectureEnabled[prefName] = data[prefName].map(item => ({ ...item, enabled: false }));
						}
					}
					//
				} catch (error) {
					console.error('Error fetching prefecture data:', error);
					//prefectureData = {};
				}	
			}
		} catch (error) {
				console.error('Error fetching data source list:', error);
		}

		totalItems = 0;
		for (const prefectureName in processedData) {
			if (processedData.hasOwnProperty(prefectureName) && Array.isArray(processedData[prefectureName])) {
				 totalItems += processedData[prefectureName].length;
			}
		}
	const totalItemsCountSpan = document.getElementById('totalItemsCount');
	totalMaxCount = totalItems;
	totalItemsCountSpan.textContent = totalItems;
	prefectureData = processedData;
	
	updateUI(titleText);
	

	return processedData;
}

async function loadDataSources() {
    try {
        const response = await fetch('/prefectureList.js');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dataSources = await response.json();
        dataSourceSelect.innerHTML = '';
        for (const key in dataSources) {
            if (dataSources.hasOwnProperty(key)) {
				for(i=0; i<dataSources[key].length; i++){
					if(dataSources[key][i].lang == langSelect){
						const listName = dataSources[key][i].name;
						const listApi = dataSources[key][i].api;
						const option = document.createElement('option');
						selectedThemeTitle = dataSources[key][i].title;
						themeIcon = dataSources[key][i].icon;
						option.value = listApi;
						option.textContent = `${listName} (${key})`;
						option.dataset.title = dataSources[key][i].title;
						option.dataset.icon = dataSources[key][i].icon;
						dataSourceSelect.appendChild(option);
					}
				}
            }
        }
        if (dataSourceSelect.options.length > 0) {
            const initialApiUrl = dataSourceSelect.value;
			prefectureData = await loadPrefectureData(initialApiUrl);
        }
    } catch (error) {
        console.error('Error fetching data source list:', error);
    }
}

async function loadLangPack() {
    try {
        const response = await fetch('/langText.js');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dataSources = await response.json();
        for (const key in dataSources) {
			if(key == langSelect){
				if (dataSources.hasOwnProperty(key)) {
					for(i=0; i<dataSources[key].length; i++){
						for (key2 in dataSources[key][i]) {
							if (dataSources[key][i].hasOwnProperty(key2)) {
								textLabel[key2] = dataSources[key][i][key2];
							}
						}
					}
				}
			}
        }
		updateLangText();
    } catch (error) {
        console.error('Error fetching data source list:', error);
    }
}


