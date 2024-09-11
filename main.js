// Simple WebExtension (tested in Firefox) to make it easier to save a page, image or link url or to check if they have been saved previously
// Uses Archive.org's Wayback Machine, Archive.today and Ghost Archive
// By James Ravindran (built on a previous extension by Cathal McNally)

function loadSettings() {
	// Get settings saved in local storage
	var archiver_states = localStorage["betterarchiver"];

	// Check if firstRun doesn't exist, if so populate variables
	if (archiver_states == undefined) {			
		// Sets localStorage so the options dialog is set up correctly on first run
		localStorage["betterarchiver"] = get_archivers_json();
	}
	var result = JSON.parse(localStorage["betterarchiver"]);

	return result;
}

loadSettings()

// Depending on the options you have set send the currently opened page to an archival service
function saveIt(info) {
	var result = loadSettings();
	if (!info.menuItemId.includes("both|")) {
		for (key of Object.keys(result)) {
			result[key] = false
		}
		result[info.menuItemId.split("|")[1]] = true
	}

	var linkClicked = "";
	if (info.linkUrl) {
		linkClicked = info.linkUrl;
	} else if (info.mediaType === "image") {
		linkClicked = info.srcUrl;
	} else {
		linkClicked = info.pageUrl;
	} 

	if (result["archiveorg"]) {
		chrome.tabs.create({ 
			url: "https://web.archive.org/save/" + linkClicked,
			active: false,
		});
	}
	
	if (result["archivetoday"]) {
		chrome.tabs.create({ 
			url: "https://archive.today/?run=1&url=" + linkClicked,
			active: false,
		});
	}

	if (result["ghostarchive"]) {
		fetch("https://ghostarchive.org/archive2", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				"archive": linkClicked
			})
			//referrer: "https://ghostarchive.org/"
		}).then(function(res) {
			chrome.tabs.create({ 
				url: res.url,
				active: false,
			})
		});
	}
}

// Check if any of the archival services have saved the page already
function checkIt(info) {
	var result = loadSettings();
	if (!info.menuItemId.includes("both|")) {
		for (key of Object.keys(result)) {
			result[key] = false
		}
		result[info.menuItemId.split("|")[1]] = true
	}

	var linkClicked = "";
	if (info.linkUrl) {
		linkClicked = info.linkUrl;
	} else if (info.mediaType === "image") {
		linkClicked = info.srcUrl;
	} else {
		linkClicked = info.pageUrl;
	}

	if (result["archiveorg"]) {
		chrome.tabs.create({
			url: "https://web.archive.org/web/" + linkClicked,
			active: false,
		});
	}
	
	if (result["archivetoday"]) {
		chrome.tabs.create({
			url: "http://archive.today/" + linkClicked,
			active: false,
		});
	}

	if (result["ghostarchive"]) {
		chrome.tabs.create({
			url: "https://ghostarchive.org/search?term=" + encodeURI(linkClicked),
			active: false,
		});
	}
}

// Open settings
function goToSettings() {
	chrome.tabs.create({ 
		url: "/options/options.html",
	});
}

// Create context menus

function createSubContextMenus(baseid, title, func) {
	chrome.contextMenus.create({
		"id": baseid,
		"parentId": "base",
		"title": title,
		"contexts": ["page", "link", "image"],
	});

	for (archiverid of Object.keys(archivers)) {
		chrome.contextMenus.create({
			"id": baseid+"|"+archiverid,
			"parentId": baseid,
			"title": archivers[archiverid].name,
			"contexts": ["page", "link", "image"],
			"onclick": func
		});
	}

	chrome.contextMenus.create({
		"id": "both|"+baseid,
		"parentId": baseid,
		"title": "All of them",
		"contexts": ["page", "link", "image"],
		"onclick": func
	});
}

chrome.contextMenus.create({
	"id": "base",
	"title": "Better Archiver",
	"contexts": ["page", "link", "image"]
});

createSubContextMenus("save", "Save it", saveIt)
createSubContextMenus("check", "Check it", checkIt)

chrome.contextMenus.create({
	"parentId": "base",
	"title": "Settings",
	"contexts": ["page", "link", "image"],
	"onclick": goToSettings
});