// Options dialog

// Save the changes you made to the settings locally
function save() {
	for (archiverid of Object.keys(archivers)) {
		archivers[archiverid].enabled = document.getElementById(archiverid).checked
	}
	localStorage["betterarchiver"] = get_archivers_json();
}

// Load the saved settings from localStorage
function load() {
	var result = JSON.parse(localStorage["betterarchiver"])
	for (var id of Object.keys(result)) {
		var enabled = result[id];
		var labelElement = document.createElement("label")
		var checkboxElement = document.createElement("input")
		checkboxElement.setAttribute("type", "checkbox")
		checkboxElement.setAttribute("id", id)
		checkboxElement.checked = enabled
		labelElement.appendChild(checkboxElement)
		labelElement.appendChild(document.createTextNode(archivers[id].name))
		var optionsElement = document.getElementById("options")
		optionsElement.appendChild(labelElement)
		optionsElement.appendChild(document.createElement("br"))
		optionsElement.appendChild(document.createElement("br"))
	}
} 

// Close options and reload the extension
function close_options() {
	chrome.runtime.reload();  
}

// Handle events
document.addEventListener('DOMContentLoaded', load);
document.getElementById('save').addEventListener('click', save);
document.getElementById('close').addEventListener('click', close_options);
