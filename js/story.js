var contenedor, current, nextTemp, currentPlace = [];
var OBJmoves = false, OBJplaces = false;
var REMOTE = "https://zunnay.github.io";
var storyDB = [], objectiveDB = [], inventoryDB = [], npcDB = [], placeDB = [];
var dbCount = 0, currentNPC;
var objActive = document.createElement("div");

// -----------------------------------------------------------------------------------------------------
$(document).ready(function(){
    $('body').addClass('stick');

	// Cargar base de datos.

	// Inventario
	const requestInventory = new XMLHttpRequest();requestInventory.open("GET", $("#ert").text());requestInventory.responseType = "json";requestInventory.send();
	requestInventory.onload = function() {tempDB = requestInventory.response;almacena(tempDB, "inventory");};

	// NPC
	const requestNPC = new XMLHttpRequest();requestNPC.open("GET", $("#rty").text());requestNPC.responseType = "json";requestNPC.send();
	requestNPC.onload = function() {tempDB = requestNPC.response;almacena(tempDB, "npc");};

	// Places
	const requestPlaces = new XMLHttpRequest();requestPlaces.open("GET", $("#tyu").text());requestPlaces.responseType = "json";requestPlaces.send();
	requestPlaces.onload = function() {tempDB = requestPlaces.response;almacena(tempDB, "place");};

});

function almacena(db, name) {
	
	switch (name) {
		case "story":storyDB = db;dbCount++;break;
		case "objective":objectiveDB = db;dbCount++;break;
		case "inventory":inventoryDB = db;dbCount++;break;
		case "npc":npcDB = db;dbCount++;break;
		case "place":placeDB = db;dbCount++;
	};
	
	(dbCount == 5)?iniciarCapitulo():"";
};

function iniciarCapitulo() {

	cargarStory(storyDB[0].id);

};

function cargarStory(id) {
	current = id;
	contenedor = document.getElementById("episode-container");
	contenedor.style.backgroundColor = "#000";

	var currentStory = storyDB.filter(function(v) {return v.id == id});

	if (currentStory[0].id != nextTemp) {
		contenedor.innerHTML = "";

		// Cargar fondo
		if (!isNaN(currentStory[0].place)) {
			var backIMG = placeDB.filter(function(v) {return v.id == currentStory[0].place});
			contenedor.style.backgroundImage = "url('" + REMOTE + backIMG[0].imgURL + "')";
		} else {
			if (currentStory[0].place != "auto") {
				currentStory[0].place == "white" ? contenedor.style.backgroundColor = "#fff" : "";
				contenedor.style.backgroundImage = "url('')";
			} else {
				// Obtener url
				(currentPlace.length == 1) ? (contenedor.style.backgroundImage = "url('" + REMOTE + currentPlace[0].imgURL + "')") : "";
			};
		};

		// Cargar NPC si existe.
		if (currentStory[0].npc.length != 0) {
			// Cargar NPC
			var div = document.createElement("div");

			for (n = 0; n < currentStory[0].npc.length; n++) {

				div.setAttribute("id",currentStory[0].npc[n]);
				var gardie = npcDB.filter(function(v) {return v.id == currentStory[0].npc[n]});

				var img = document.createElement("img");
				img.src = REMOTE + gardie[0].imgURL;

				if (gardie[0].type == "char" || gardie[0].type == "extra") {
					div.setAttribute("class", "npc");
					//(currentStory[0].npc.length == 1)?(div.style.width = "550px"):"";
					gardie[0].type == "char" ? img.style.width = "550px" : img.setAttribute("style", gardie[0].style);
				} else {
					div.setAttribute("class", "pet");
					img.setAttribute("style", gardie[0].style);
				};

				gardie[0].id != currentNPC ? div.setAttribute("style", "-webkit-animation-name: fade-in;") : "";
				currentNPC = gardie[0].id;
				contenedor.appendChild(div);
				(gardie[0].type == "pet") ? document.getElementsByClassName("pet")[n].appendChild(img) : document.getElementsByClassName("npc")[n].appendChild(img);
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

			} else if (currentStory[0].type == "info_general") {
				var div = document.createElement("div");
				div.setAttribute("class", "bubbleInfo");
				div.setAttribute("id", currentStory[0].id);
				div.innerHTML = "<div>" + currentStory[0].text + "</div>";
				contenedor.appendChild(div);
			};
		};

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

			if (currentStory[0].self != "") {
				div = document.createElement("div");
				div.setAttribute("class", "own-npc");
				document.getElementById("choiceText").appendChild(div);

				var gardie = npcDB.filter(function(v) {return v.id == currentStory[0].self});
				var img = document.createElement("img");
				img.setAttribute("class", "npcRpg");
				img.src = REMOTE + gardie[0].imgURL;
				document.getElementsByClassName("own-npc")[0].appendChild(img);
			};
		};

		if (currentStory[0].closeDialog == true) {
			nextTemp = currentStory[0].nextStory[0];
			(nextTemp == [])?(finalizaEpisodio()):"";
		} else {
			nextTemp = 0;
			setMenu(currentStory[0].id);
		};

	} else {
		// Cargar puntos de desplazamiento
		alert("Esta función no está disponible 2");
		setDesplazamientos ();
	};
};

function setDesplazamientos(id) {

	var place = [];
	
	if (!isNaN(id)) {
		place = placeDB.filter(function (v) {return v.id == id});
	} else {
		place = currentPlace;
	};

	contenedor.innerHTML = "";

	for (p = 0; p < place[0].places.length; p++) {
		var div = document.createElement("div");
		div.setAttribute("id", place[0].places[p]);
		div.setAttribute("class","changeLocation tooltip");
		div.setAttribute("style", place[0].style[p]);

		var temp = placeDB.filter(function(v) {return v.id == place[0].places[p]});

		div.innerHTML = "<span class=tooltiptext>" + temp[0].name + "</span>";
		contenedor.appendChild(div);

		var tooltip = document.getElementsByClassName("tooltiptext")[p];

		switch (place[0].tooltip[p]) {
			case "left":
				tooltip.style.left = "-145px";
				tooltip.clientHeight > "28" ? tooltip.style.top = "-18px" : tooltip.style.top = "-7px";
			break;
			case "right":
				tooltip.style.left = "30px";
				tooltip.clientHeight > "28" ? tooltip.style.top = "-18px" : tooltip.style.top = "-7px";
			break;
			default:
				tooltip.style.bottom = "200%";
    			tooltip.style.left = "50%";
    			tooltip.style.marginLeft = "-70px";
		};
	};
};

function finalizaEpisodio() {

    $(".cont").eq(0).css("display","flex");
	$(".cont").eq(1).css("display","none");
    $(document).scrollTop(0);
    $("#episode-code").val($("code:first").text());

	// Comprobar si el próximo episodio está disponible
	if (currentCH[0].next != "") {

		var nextCH = chList.filter(function(v) {return v.current == currentCH[0].next});

		if (nextCH.length != 0) {
			if (nextCH[0].visible == true) {

				alert("Pendiente");
				// Mostrar popup para jugar episodio siguiente.

			} else {
				// El episodio está en la lista pero está oculto
				$(".popup-title").text("¡Enhorabuena!");
				$(".popup-body").html("<p>¡Has finalizado el episodio!</p>" +
						"<p>Has llegado al final de la historia. Conserva el siguiente código y utilízalo para reanudar la historia cuando esté disponible:</p>");

				$("#next-code").val(currentCH[0].next);
			};

		} else {
			// El episodio no está en la lista.
			$(".popup-title").text("¡Enhorabuena!");
			$(".popup-body").html("<p>¡Has finalizado el episodio!</p>" +
					"<p>Has llegado al final de la historia. Conserva el siguiente código y utilízalo para reanudar la historia cuando esté disponible:</p>");

			$("#next-code").val(currentCH[0].next);
		};

		$("body").css("overflow","hidden");
		$("#popup-bg").fadeIn(600);

	// El episodio no existe
	} else {
		alert("Falta especificar el capítulo siguiente.");

	};
};

function setMenu (id) {
	var currentStory = storyDB.filter(function(v) {return v.id == id});

	var objectives = document.getElementsByClassName("objectives")[0];
	var inventory = document.getElementsByClassName("inventory")[0];
	var checkpoint = document.getElementsByTagName("code")[0];
	objectives.innerHTML = "";
	inventory.innerHTML = "";
	checkpoint.innerHTML = "";

	if (currentStory[0].setObjective.length != 0) {
		var ul = document.createElement("ul");
		var lista = ""; 
		var cuentaPositivo = 0;

		// Menu lateral
		for (o = 0; o < currentStory[0].setObjective.length; o++) {
			var objId = currentStory[0].setObjective[o];
			var obj = objectiveDB.filter(function(v) {return v.id == Math.abs(objId)});

			if (objId > 0) {
				cuentaPositivo++;

				lista = lista + '<li>' + obj[0].text + '</li>';

				//Revisar
				if(obj[0].type == "moves") {
					OBJmoves = obj[0].value;
					OBJplaces = false;
				} else {
					OBJplaces = obj[0].value;
					OBJmoves = false;
				};

			} else {
				lista = lista + '<li class="done">' + obj[0].text + '</li>';
			};
		};
		
		ul.innerHTML = lista;
		objectives.appendChild(ul);

		// Mostrar tooltip en container
		var div = document.createElement("div");
		div.setAttribute("class", "tooltip-objective");
		var obj = objectiveDB.filter(function(v) {return v.id == currentStory[0].setObjective[0]});

		if (cuentaPositivo > 1) {
			div.innerHTML = "Nuevos objetivos disponibles.";

		} else if (cuentaPositivo == 1) {
			div.innerHTML = "<b><u>Nuevo objetivo:</u> " + obj[0].text + "</b>";
		} else if (cuentaPositivo == 0) {
			div.innerHTML = "<b>Objetivo completado.</b>";
			cuentaPositivo = 0;
		};

		if (objActive.innerHTML != div.innerHTML) {
			document.getElementById("episode-container").appendChild(div);
			objActive = div;
		};
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

	if (currentStory[0].checkpoint.length == 19) {
		checkpoint.innerHTML = currentStory[0].checkpoint;
	} else {
		checkpoint.innerHTML = currentStory[0].checkpoint + currentPlace[0].id;
	};
};

function changeLocation(id) {
	// Fijar fondo
	currentPlace = placeDB.filter(function(v) {return v.id == id});
	contenedor.style.backgroundImage = "url('" + REMOTE + currentPlace[0].imgURL + "')";

	// Verificar si se completan los objetivos
	
	if (OBJplaces == false) { // Objetivo por movimientos
		OBJmoves--;
		(OBJmoves == 0)?(cargarStory(nextTemp--)):(setDesplazamientos(id));

	} else { // Objetivo por ubicación
		(OBJplaces == id)?(cargarStory(nextTemp--)):(setDesplazamientos(id));
	};
};

$(function() { 

	$("#episode-container").each(function(){$(this).on("click", ".choice", function() {
		var choiceSeleted = $(this).attr("id");
		if (choiceSeleted == "undefined") {
			finalizaEpisodio();
		} else {
			if (choiceSeleted == nextTemp) {
				
				var temp = storyDB.filter(function(v) {return v.id == current});
				setDesplazamientos(temp[0].place);
				setMenu(current);
			} else {
				cargarStory(choiceSeleted);
			};
		};

	})});

	$("#episode-container").each(function(){$(this).on("click", ".changeLocation", function() {
		var mov = $(this).attr("id");
		changeLocation(mov);

	})});

});