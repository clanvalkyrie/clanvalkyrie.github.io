var contenedor, current, nextTemp = [];
var REMOTE = "https://zunnay.github.io";
var storyDB = [], objetiveDB = [], inventoryDB = [], npcDB = [], placeDB = [];
var dbCount = 0;
// -----------------------------------------------------------------------------------------------------
$(document).ready(function(){
	// Bloquea scroll hacia arriba
    $(document).scrollTop(115);
    $(document).scroll(function(){
        var scrolled = $(document).scrollTop();
        if (scrolled < 115) {
        	$(document).scrollTop(115);
        };
    });

// Cargar base de datos.
	// Capítulo ------> URL cambia según capítulo
	const requestStory = new XMLHttpRequest();
	requestStory.open("GET", "https://zunnay.github.io/valkyrieclub/data/story/ch1-test-story.json");
	requestStory.responseType = "json";
	requestStory.send();

	requestStory.onload = function() {
		tempDB = requestStory.response;
		almacena(tempDB, "story");
	}

	// Objetivos del capítulo ------> URL cambia según capítulo
	const requestObjetives = new XMLHttpRequest();
	requestObjetives.open("GET", "https://zunnay.github.io/valkyrieclub/data/story/ch1-objetives.json");
	requestObjetives.responseType = "json";
	requestObjetives.send();

	requestObjetives.onload = function() {
		tempDB = requestObjetives.response;
		almacena(tempDB, "objetive");
	};

	// Inventario
	const requestInventory = new XMLHttpRequest();
	requestInventory.open("GET", "https://zunnay.github.io/valkyrieclub/data/common/general-inventory.json");
	requestInventory.responseType = "json";
	requestInventory.send();

	requestInventory.onload = function() {
		tempDB = requestInventory.response;
		almacena(tempDB, "inventory");
	};

	// NPC
	const requestNPC = new XMLHttpRequest();
	requestNPC.open("GET", "https://zunnay.github.io/valkyrieclub/data/common/general-npcs.json");
	requestNPC.responseType = "json";
	requestNPC.send();

	requestNPC.onload = function() {
		tempDB = requestNPC.response;
		almacena(tempDB, "npc");
	};

	// Places
	const requestPlaces = new XMLHttpRequest();
	requestPlaces.open("GET", "https://zunnay.github.io/valkyrieclub/data/common/general-places.json");
	requestPlaces.responseType = "json";
	requestPlaces.send();

	requestPlaces.onload = function() {
		tempDB = requestPlaces.response;
		almacena(tempDB, "place");
	};

});

function almacena(db, name) {
	
	switch (name) {
		case "story":storyDB = db;dbCount++;break;
		case "objetive":objetiveDB = db;dbCount++;break;
		case "inventory":inventoryDB = db;dbCount++;break;
		case "npc":npcDB = db;dbCount++;break;
		case "place":placeDB = db;dbCount++;
	};
	
	(dbCount == 5)?iniciarCapitulo():"";
};

function iniciarCapitulo() {

	cargarStory(storyDB[27].id);

}

function cargarStory(id) {
	current = id;
	contenedor = document.getElementById("episode-container");
	contenedor.innerHTML = "";

	var currentStory = storyDB.filter(function(v) {return v.id == id});

	if (currentStory[0].id != nextTemp[0]) {

		// Cargar fondo
		if (currentStory[0].place != "auto") {
			var backIMG = placeDB.filter(function(v) {return v.id == currentStory[0].place});
			contenedor.style.backgroundImage = "url('" + REMOTE + backIMG[0].imgURL + "')";
		};

		// Cargar NPC si existe.
		if (currentStory[0].npc.length != 0) {
			// Cargar NPC
			var div = document.createElement("div");
			div.setAttribute("class", "npc");

			for (n = 0; n < currentStory[0].npc.length; n++) {
				div.setAttribute("id",currentStory[0].npc[n]);

				if (currentStory[0].npc.length == 1) {
					div.style.left = "106px";
				};

				contenedor.appendChild(div);

				var gardie = npcDB.filter(function(v) {return v.id == currentStory[0].npc[n]});
				var img = document.createElement("img");
				img.src = REMOTE + gardie[0].imgURL;
				document.getElementsByClassName("npc")[n].appendChild(img);
			};
		};

		// Cargar texto
		if (currentStory[0].type != "answer_only") {

			if (currentStory[0].type == "story_general") {
				// Texto general
				var div = document.createElement("div");
				div.setAttribute("id", currentStory[0].id);
				div.setAttribute("class","text undefined");
				div.style.top = "50px";
				div.style.left = "81px";
				contenedor.appendChild(div);

				div = document.createElement("div");
				div.style.width = "600px";
				document.getElementById(currentStory[0].id).appendChild(div);

				div = document.createElement("i");
				document.querySelector(".text.undefined div").appendChild(div);

				var siglas = currentStory[0].text;
				for (s = 0; s < siglas.length; s++) {
					var span = document.createElement("span");
					span.setAttribute("class", "typewriter-letter");
					//span.style.opacity = 0;
					span.innerHTML = siglas[s];
					document.querySelector(".text.undefined div i").appendChild(span);
				};

			} else if (currentStory[0].type == "npc_dialog") {
				// Diálogo de NPC
				var div = document.createElement("div");
				div.setAttribute("class", "bubbleText undefined");
				div.setAttribute("id", currentStory[0].id);
				div.innerHTML = currentStory[0].text;
				contenedor.appendChild(div);

			}
		}

		// Cargar opciones
		if (currentStory[0].choices.length != 0) {
			var div = document.createElement("div");
			div.setAttribute("class","choiceTextRpg");
			div.setAttribute("id","choiceText");
			contenedor.appendChild(div);

			for (x = 0; x < currentStory[0].choices.length; x++) {

				div = document.createElement("div");
				div.setAttribute("class","choice");
				div.setAttribute("id", currentStory[0].nextStory[x]);

				div.innerHTML = currentStory[0].choices[x];
				document.getElementById("choiceText").appendChild(div);

			};

			div = document.createElement("div");
			div.setAttribute("class", "own-npc");
			document.getElementById("choiceText").appendChild(div);

			div = document.createElement("img");
			div.setAttribute("class", "npcRpg");
			div.src = REMOTE + npcDB[0].imgURL;
			document.getElementsByClassName("own-npc")[0].appendChild(div);

		} else {
			// Cargar puntos de desplazamiento
			alert("Esta función no está disponible");
		};

		if (currentStory[0].closeDialog == true) {
			nextTemp = currentStory[0].nextStory;
			(nextTemp == [])?(finalizaEpisodio()):"";
		} else {
			nextTemp.length = 0;
			setMenu(currentStory[0].id);
		};

	} else {
		// Cargar puntos de desplazamiento
		alert("Esta función no está disponible");
	}
};

function finalizaEpisodio() {
	alert("adiosito");
};

function setMenu (id) {
	var currentStory = storyDB.filter(function(v) {return v.id == id});

	var objetives = document.getElementsByClassName("objetives")[0];
	var inventory = document.getElementsByClassName("inventory")[0];
	objetives.innerHTML = "";
	inventory.innerHTML = "";

	if (currentStory[0].setObjetive.length != 0) {
		var ul = document.createElement("ul");
		var lista = ""; 

		for (o = 0; o < currentStory[0].setObjetive.length; o++) {
			var objId = currentStory[0].setObjetive[o]
			var obj = objetiveDB.filter(function(v) {return v.id == Math.abs(objId)});
			if (objId > 0) {
				lista = lista + '<li>' + obj[0].text + '</li>';
			} else {
				lista = lista + '<li class="done">' + obj[0].text + '</li>';
			};
		};

		ul.innerHTML = lista;
		objetives.appendChild(ul);
	};

	if (currentStory[0].setInventory.length != 0) {
		var ul = document.createElement("ul");
		var lista = ""; 

		for (o = 0; o < currentStory[0].setInventory.length; o++) {
			var obj = inventoryDB.filter(function(v) {return v.id == currentStory[0].setInventory[o]});
			lista = lista + '<li>' + obj[0].text + '</li>';
		};

		ul.innerHTML = lista;
		inventory.appendChild(ul);
	};

};


/* if (closeDialog == true) {
	// almacenar nextStory en temporal.
}

if (setObjetive) {
	// Objetivo completo. Se repite el id para tacharlo de la lista.
}

*/

$(function() { 

	$("#episode-container").each(function(){$(this).on("click", ".choice", function() {
		var choiceSeleted = $(this).attr("id");
		if (choiceSeleted == "undefined") {
			finalizaEpisodio();
		} else {
			if (choiceSeleted == nextTemp[0]) {
				cargarStory(choiceSeleted);
				setMenu(current);
			} else {
				cargarStory(choiceSeleted);
			};
		};

	})});

});