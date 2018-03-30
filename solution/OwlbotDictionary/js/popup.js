chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
	console.log("current selection:" + selection);

	if (selection == '') {
		var message = "Please select a word on the page.";
		callback(message);

		return;
	 }
	 
	 var selectionChunks = selection[0].trim().split(/[\s,;:/\\]+/);

	 selectionChunks.forEach(element => {
		console.log(element);
	 });

	if (selectionChunks.length > 1) {
		console.log("Multiple words selected, getting explanation for the first word only.");
	}

	//TODO: put all letters in selection to lower (owlbot doesn`t return anything if there are upper letters!)
	var url = "https://owlbot.info/api/v2/dictionary/" + selectionChunks[0] + "?format=json";
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
