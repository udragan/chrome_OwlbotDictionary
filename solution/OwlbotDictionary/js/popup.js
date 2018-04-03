chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
	console.log("current selection:" + selection);

	if (selection == '') {
		callback(selection);

		return;
	 }
	 
	 var selectionChunks = selection[0].trim().split(/[\s,;:/\\]+/);	 

	if (selectionChunks.length > 1) {
		selectionChunks.forEach(element => {
			console.log(element);
		 });

		console.log("Multiple words selected, getting explanation for the first word only.");
	}

	//put all letters to lower case (owlbot doesn`t return anything if there are upper case letters!)
	var queryString = selectionChunks[0].toLowerCase();
	var url = "https://owlbot.info/api/v2/dictionary/" + queryString + "?format=json";
    getDefinition(url, callback);
});


// functions

function getDefinition(url, callback) {
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
	
	if (!isValid(response)) {
		return;
	}

	var responseObj = JSON.parse(response);
	console.log(responseObj);

	responseObj.forEach(element => {
		var divTag = document.createElement("div");

		for (var key in element) {
			console.log(key);			
			console.log(element[key]);

			if (element[key] != null) {
				divTag.appendChild(generateElement(key, element[key]));
			}
		}

		divTag.appendChild(document.createElement("br"));
		document.body.appendChild(divTag);		
	});
}

function isValid(response) {
	var validResponse = true;
	var message = null;

	if (response == '') {
		validResponse = false;
		message = "Please select a word on the page.";
	}

	if (response == "[]") {
		validResponse = false;
		message = "No definition available.";
	}

	if (!validResponse) {
		console.log(message);		
		document.getElementById("output").innerHTML = message;
	}

	return validResponse;
}

function generateElement(key, value) {
	var rootDiv = document.createElement("div");

	var keyTag = document.createElement("h3");
	keyTag.setAttribute("style", "display: inline");
	keyTag.innerText = key + ": ";

	var valueTag = document.createElement("p");
	valueTag.setAttribute("style", "display: inline");
	valueTag.innerText = value;

	rootDiv.appendChild(keyTag);
	rootDiv.appendChild(valueTag);

	return rootDiv;
}
