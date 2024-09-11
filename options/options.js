// Options Dialog

// Setup variables
var archive_org = localStorage["thearchiver_archiveorg"];
var archive_is = localStorage["thearchiver_archivetoday"];
var ghost_archive = localStorage["thearchiver_ghostarchive"];

// Save the changes you made to the settings locally
function save() {
	 localStorage["thearchiver_archiveorg"] = document.getElementById("archiveorg").checked;
	 localStorage["thearchiver_archivetoday"] = document.getElementById("archiveis").checked;
	 localStorage["thearchiver_ghostarchive"] = document.getElementById("ghostarchive").checked;
}

// load the saved settings from local Storage
function load() {	
	if (null != archive_org) {
		document.getElementById("archiveorg").checked = toBool(archive_org);
	}
	if (null != archive_is) {
		document.getElementById("archiveis").checked = toBool(archive_is);
	}
	if (null != ghost_archive) {
		document.getElementById("ghostarchive").checked = toBool(ghost_archive);
	}
} 

// Close options and reload the extension
function close_options() {
	chrome.runtime.reload();  
}

// convert given string to bool
function toBool(str)
{
   if ("false" === str)
      return false;
   else 
      return str;
}

// Handle Events
document.addEventListener('DOMContentLoaded', load);
document.getElementById('save').addEventListener('click', save);
document.getElementById('close').addEventListener('click', close_options);
