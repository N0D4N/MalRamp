// ==UserScript==
// @name         MyAnimeList random anime/manga picker.
// @version      1.1
// @description  Get random entry from your anime/manga list on MyAnimeList.net and open it in new window.
// @author       N0D4N
// @homepageURL	 https://github.com/N0D4N/MalRamp
// @source		 https://github.com/N0D4N/MalRamp
// @supportURL	 https://github.com/N0D4N/MalRamp/issues
// @updateURL	 https://github.com/N0D4N/MalRamp/raw/auto-open-script-test/MalRamp.user.js
// @downloadURL	 https://github.com/N0D4N/MalRamp/raw/auto-open-script-test/MalRamp.user.js
// @include      https://myanimelist.net/animelist/*
// @include      https://myanimelist.net/mangalist/*
// ==/UserScript==

// Entry point of the script that is called when page is loaded
(function(){
	'use strict';

	/// Create button on which user will click and which will open random anime/manga from current list
	function createButton(){
		const RanElem = document.createElement('a');
		RanElem.id = 'MalRampButton';
		RanElem.style.cursor = 'pointer';
		RanElem.addEventListener("click", async () => await rfunc(), false);
		return RanElem;
	}

	const floatingMenu = document.getElementsByClassName('list-menu-float')[0];
	const isClassicDesign = floatingMenu === undefined;

	if(isClassicDesign){
		const linksMenu = document.getElementById('mal_cs_links').children[0];
		const ranButton = createButton();
		ranButton.innerHTML = 'Random';
		linksMenu.appendChild(ranButton);
	}
	else{
		const ranButton = createButton();
		ranButton.className = 'icon-menu';
		const color = window.getComputedStyle(document.getElementsByClassName('icon')[1], null).fill;
		ranButton.setAttribute('style', '-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:' + color + ';');
		const ranButtonIcon = document.createElement('span'); // Icon that will be displayed on floating menu
		ranButtonIcon.id = 'MalRampButtonIcon';
		ranButtonIcon.setAttribute('style', 'position:absolute;font-size:22px;font-family:fantasy;font-weight:bold;left:15px;top:12px;');
		ranButtonIcon.innerHTML += 'R';
		ranButton.appendChild(ranButtonIcon);
		const ranButtonText = document.createElement('span'); // Text that will appear on hover
		ranButtonText.className = 'text';
		ranButtonText.innerHTML = 'Random';
		ranButtonText.id = 'MalRampButtonText';
		ranButton.appendChild(ranButtonText);
		floatingMenu.appendChild(ranButton);
	}

	document.addEventListener("keydown", async function (hotkeyEvent){ // Add hotkey 
		if(hotkeyEvent.ctrlKey && hotkeyEvent.altKey && hotkeyEvent.key.toLowerCase() === 'r'){
			await rfunc();
		}
	}, false);

	/// Function that will be called every time user clicks on button
	async function rfunc(){

		/// Function that is used to get random link from the array of links
		function getRandomInt(max){
			return Math.floor(Math.random() * (max + 1));
		}

		function sleep(milliseconds){
			return new Promise(resolve => setTimeout(resolve, milliseconds));
		}

		/// Gets random link from array and open it in new tab
		function getRandomEntry(links){
			const randomId = getRandomInt(links.length);
			return links[randomId];
		}

		function openTab(link){
			const tab = window.open(link);
			tab.focus;
		}

		/// Saves array of links in json to hidden div,
		/// so new clicks on button will get data from this saved links
		/// instead of grabbing from html or querying to /load.json endpoint
		function saveToTempStorage(links){
			const tempStor = document.createElement('div');
			tempStor.id = 'MalRampTempStorage';
			tempStor.style.display = 'none';
			tempStor.innerHTML = JSON.stringify(links);
			document.body.appendChild(tempStor);
		}

		///Gets JSON from given url
		async function getJson(url){
			const response = await fetch(url);
			return await response.json();
		}

		// Check if button was clicked before and links are saved in hidden div in json format
		const tempStElem = document.getElementById('MalRampTempStorage');
		if(tempStElem !== null){
			const links = JSON.parse(tempStElem.innerHTML);
			const link = getRandomEntry(links);
			openTab(link);
			return;
		}

		const isClassicDesign = document.getElementsByClassName('list-menu-float')[0] === undefined;
		const links = [];

		// Add entries from the list on loaded page to array of links
		if (isClassicDesign){
			// Lists with all design are loaded on page with all entries in it
			const entries = document.getElementsByClassName('animetitle'); // Yes it is anime title even in mangalist
			for(let i = 0; i < entries.length; i++){
				links.push(entries[i].getAttribute('href'));
			}
		}
		else{
			// Lists with modern design are loaded on page in 300 or less entries so if user have more than 300 entries in list it is needed to load them separately
			const entries = document.getElementsByClassName('list-table-data'); // Collection of all anime/manga in list
			for(let i = 0; i < entries.length; i++){
				links.push(entries[i].cells[3].children[0].getAttribute('href'));
			}

			// This will query full list filtered by given status etc, by hitting https://myanimelist.net/animelist/{username}/load.json?{query}
			//															  		  https://myanimelist.net/mangalist/{username}/load.json?{query}
			if(links.length === 300){
				console.log('MalRamp: 300+(?) entries in list querying to /load.json');
				const splitRes = window.location.href.split('?');

				let query = "";

				if(window.location.href.includes('?')){
					query = '?' + splitRes[1];
				}
				else{
					query = '?';
				}

				const loadJsonUrl = splitRes[0] + '/load.json' + query;
				let toContinue;
				const entityPrefix = splitRes[0].includes('manga') ? 'manga' : 'anime'; // Get the type of list

				do{
					toContinue = false;
					const offset = links.length;
					const url = loadJsonUrl + '&offset=' + offset;

					const json = await getJson(url);
					for(let i = 0; i < json.length; i++){
						links.push(json[i][entityPrefix + '_url']);
					}

					// MAL returns entries in list by chunks with the size of 300 so if amount of saved links is 300*x it's most likely that there are more entries in list
					if(!(links.length % 300)){
						toContinue = true;
						await sleep(500); // Add a bit of delay between requests
					}
				}while(toContinue);
			}
		}

		saveToTempStorage(links);
		const link = getRandomEntry(links);
		openTab(link);
	}
})();