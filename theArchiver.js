// Simple WebExtension (tested in Firefox) to make it easier to save a page, image or link url or to check if they have been saved previously
// Uses Archive.org's Wayback Machine, Archive.today and Ghost Archive
// By James Ravindran (built on a previous extension by Cathal McNally)
// Version 1.2.3

// Changelog
// 1.2.3: Modified Cathal McNally's extension, added Ghost Archive

(function() {
	function loadSettings() {
		// Get settings saved in local storage
		var archive_org = localStorage["thearchiver_archiveorg"];
		var archive_today = localStorage["thearchiver_archivetoday"];
		var ghost_archive = localStorage["thearchiver_ghostarchive"];
		var firstRun = localStorage["thearchiver_firstRun"];
		
		// Check if firstRun doesn't exist, if so populate variables
		if (firstRun == undefined) {
			// No need to check each, archive.org will do
			if (archive_org == undefined) {
				archive_org = "true";
				archive_today = "true";
				ghost_archive = "true";
				
				// turn firstRun off
				firstRun = 0;
				
				// sets local Storage so the options dialog is set up correctly on first run
				localStorage["thearchiver_archiveorg"] = archive_org;
				localStorage["thearchiver_archivetoday"] = archive_today;
				localStorage["thearchiver_ghostarchive"] = ghost_archive;
			}
		}

		return [archive_org, archive_today, ghost_archive];
	}

	var [archive_org, archive_today, ghost_archive] = loadSettings()
	
	// Depending on the options you have set send the currently opened page to an archival service
	function saveIt(info) {
		var [archive_org, archive_today, ghost_archive] = loadSettings()

		var linkClicked = "";
		if (info.linkUrl) {
			linkClicked = info.linkUrl;
		} else if (info.mediaType === "image") {
			linkClicked = info.srcUrl;
		} else {
			linkClicked = info.pageUrl;
		} 

		if (archive_org == "true") {
			chrome.tabs.create({ 
				url: "https://web.archive.org/save/" + linkClicked,
				active: false,
			});
		}
		
		if (archive_today == "true") {
			chrome.tabs.create({ 
				url: "https://archive.today/?run=1&url=" + linkClicked,
				active: false,
			});
		}

		if (ghost_archive == "true") {
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
		var [archive_org, archive_today, ghost_archive] = loadSettings()

		var linkClicked = "";
		if (info.linkUrl) {
			linkClicked = info.linkUrl;
		} else if (info.mediaType === "image") {
			linkClicked = info.srcUrl;
		} else {
			linkClicked = info.pageUrl;
		}

		if (archive_org == "true") {
			chrome.tabs.create({
				url: "https://web.archive.org/web/" + linkClicked,
				active: false,
			});
		}
		
		if (archive_today == "true") {
			chrome.tabs.create({
				url: "http://archive.today/" + linkClicked,
				active: false,
			});
		}

		if (ghost_archive == "true") {
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
	chrome.contextMenus.create({
	  "title": "Save it",
	  "contexts": ["page", "link", "image"],
	  "onclick": saveIt}
	);

	chrome.contextMenus.create({
	  "title": "Check it",
	  "contexts": ["page", "link", "image"],
	  "onclick": checkIt}
	);

	chrome.contextMenus.create({
	  "title": "Settings",
	  "contexts": ["page", "link", "image"],
	  "onclick": goToSettings}
	);
}());