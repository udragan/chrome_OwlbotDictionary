chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
	//TODO: check if there is actual selection
	//TODO: check if there are multiple words selected
	//TODO: put all letters in selection to lower (owlbot doesn`t return anything if there are upper letters!)
	var url = "https://owlbot.info/api/v2/dictionary/" + selection[0].trim() + "?format=json";
    getDefinition(url, callback);
});


// functions

function getDefinition(url, callback) {

	// Feature detection
	if (!window.XMLHttpRequest) {
		return;
	}

	var xhr = new XMLHttpRequest();

	xhr.onload = function() {
		if (callback && typeof(callback) === 'function') {
			console.log(this.response);
			callback(this.response);
		}
	}

	xhr.open('GET', url);
	xhr.send();
};

function callback(response) {
	document.getElementById("loaderContainer").hidden = true;
	document.getElementById("output").innerHTML = response;
}
