var contenedor, current, currentPlace = [];
var OBJmoves = false, OBJplaces = false, OBJsp = "", cc = 0, objetivosActivos = [];
var storyDB = [], objectiveDB = [], inventoryDB = [], npcDB = [], placeDB = [], specialDB = [];
var dbCount = 0, currentNPC;
var objActive = document.createElement("div");

// -----------------------------------------------------------------------------------------------------
$(document).ready(function(){
    $('body').addClass('stick');

	// Cargar base de datos.

	// Inventario
	const requestInventory = new XMLHttpRequest();requestInventory.open("GET", $("#ert").text());requestInventory.responseType = "json";
	requestInventory.send();requestInventory.onload = function() {
		
		// NPC
		const requestNPC = new XMLHttpRequest();requestNPC.open("GET", $("#rty").text());requestNPC.responseType = "json";
		requestNPC.send();requestNPC.onload = function() {

			// Especial
			const requestSpecial = new XMLHttpRequest();requestSpecial.open("GET", $("#yui").text());requestSpecial.responseType = "json";
			requestSpecial.send();requestSpecial.onload = function() {
				inventoryDB = requestInventory.response;
				npcDB = requestNPC.response;
				specialDB = requestSpecial.response;

				iniciarCapitulo();
			};
		};
	};
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

	contenedor.innerHTML = "";

	if (currentStory[0].checkpoint[7] != "X") {
		// Cargar fondo
		if (!isNaN(currentStory[0].place)) {
			var backIMG = placeDB.filter(function(v) {return v.id == currentStory[0].place});
			contenedor.style.backgroundImage = "url('" + backIMG[0].imgURL + "')";
		} else {
			if (currentStory[0].place != "auto") {
				currentStory[0].place == "white" ? contenedor.style.backgroundColor = "#fff" : "";
				contenedor.style.backgroundImage = "url('')";
			} else {
				// Obtener url
				(currentPlace.length == 1) ? (contenedor.style.backgroundImage = "url('" + currentPlace[0].imgURL + "')") : "";
			};
		};

		// Cargar NPC si existe.
		if (currentStory[0].npc.length != 0) {
			// Cargar NPC
			var num = currentStory[0].npc.length;
			

			for (n = 0; n < currentStory[0].npc.length; n++) {
				var div = document.createElement("div");
				div.setAttribute("id",currentStory[0].npc[n]);
				var gardie = npcDB.filter(function(v) {return v.id == currentStory[0].npc[n]});

				var img = document.createElement("img");
				img.src = gardie[0].imgURL;

				if (gardie[0].type == "char" || gardie[0].type == "extra") {
					div.setAttribute("class", "npc");
					//(currentStory[0].npc.length == 1)?(div.style.width = "550px"):"";
					gardie[0].type == "char" ? img.style.width = "550px" : img.setAttribute("style", gardie[0].style);

					// 3 gardis
					if (num == 2) {
						switch (n) {
							case 0:img.style.left = "-130px"; img.style.zIndex = 1;break;
							case 1:img.style.left = "120px";break;
						};

					} else if (num == 3) {
						switch (n) {
							case 0:img.style.left = "-180px";break;
							case 1:img.style.left = "170px";break;
							case 2:img.style.left = 0;break;
						};
					};

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
				$("#" + currentStory[0].id).css("display", "none");
				$("#" + currentStory[0].id).fadeIn(500);

				div = document.createElement("i");
				document.querySelector(".text.undefined div").appendChild(div);

				var siglas = currentStory[0].text;
				for (s = 0; s < siglas.length; s++) {
					var span = document.createElement("span");
					span.setAttribute("class", "typewriter-letter");
					span.innerHTML = siglas[s];
					document.querySelector(".text.undefined div i").appendChild(span);
				};

				for (t = 1; t <= (siglas.length); t++) {
					time = t + "00";
					time = parseInt(time) / 3;
					$(".typewriter-letter").eq(t-1).delay(time + 500).animate({opacity:1},100);
				};

			} else if (currentStory[0].type == "npc_dialog") {
				// Diálogo de NPC

				if (currentStory[0].multiText) {
					// Múltiples burbujas
					for (m = 0; m < currentStory[0].text.length; m++) {
						var div = document.createElement("div");
						div.setAttribute("class", "bubbleText multi");

						div.setAttribute("id", currentStory[0].id + "-" + m);
						div.innerHTML = currentStory[0].text[m].text;
						div.setAttribute("style", currentStory[0].text[m].style);
						contenedor.appendChild(div);		
					};

				} else {
					// Solo una burbuja
					var div = document.createElement("div");
					switch (currentStory[0].npc.length) {
						case 2:div.setAttribute("class", "bubbleText duo");break;
						case 3:div.setAttribute("class", "bubbleText trio");break;
						default:div.setAttribute("class", "bubbleText undefined");
					};

					div.setAttribute("id", currentStory[0].id);
					div.innerHTML = currentStory[0].text;
					contenedor.appendChild(div);	
				}

				

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
				img.src = gardie[0].imgURL;
				document.getElementsByClassName("own-npc")[0].appendChild(img);
			};
		};

		currentStory[0].type == "story_general" ? $(".choiceTextRpg").delay(siglas.length * 34 + 500).fadeIn(500) : currentStory[0].type == "npc_dialog" ? $(".choiceTextRpg").delay(500).fadeIn(500) : $(".choiceTextRpg").fadeIn(500);

		if (currentStory[0].closeDialog == true) {
			if (currentStory[0].nextStory[0] == []) finalizaEpisodio();
		} else {
			setMenu(currentStory[0].id);
		};

	} else {
		if (currentStory[0].playChar.length == 1) {
			cargarStory(currentStory[0].goto[0]);
			document.getElementById("episode-container").style.display = "flex";
        	document.getElementById("char-container").style.display = "none";
		} else {
			setMenu(currentStory[0].id);
		}
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
    var REINICIAR = false, CONTINUAR = false; // CERRAR = true
    var nextCH = chList.filter(function(v) {return v.current == currentCH[0].next});
    
    (currentCH[0].char.length > 1) ? REINICIAR = true : REINICIAR = false;

    if ((nextCH.length == 1)) 
	    (nextCH[0].visible == true) ? CONTINUAR = true : CONTINUAR = false;
    
    if (CONTINUAR && REINICIAR) {
    	popupmsg = "<p>¡Has finalizado el episodio!</p>" +
		"<p>Puedes reiniciar el capítulo para leerlo desde otro punto de vista, leer el próximo episodio o conservar el siguiente código para reanudar la historia más tarde.</p>";

    } else if (CONTINUAR && !REINICIAR) {
    	popupmsg = "<p>¡Has finalizado el episodio!</p>" +
		"<p>El episodio siguiente está disponible. Puedes continuar tu historia o puedes conservar este código para reanudarla más tarde.</p>";

    } else if (!CONTINUAR && REINICIAR) {
    	popupmsg = "<p>¡Has finalizado el episodio!</p>" +
		"<p>Has llegado al final de la historia. Puedes reiniciar el capítulo para leerlo desde otro punto de vista, o puedes conservar el siguiente código y utilízalo para reanudar la historia cuando esté disponible:</p>";

    } else if (!CONTINUAR && !REINICIAR) {
    	popupmsg = "<p>¡Has finalizado el episodio!</p>" +
		"<p>Has llegado al final de la historia. Conserva el siguiente código y utilízalo para reanudar la historia cuando esté disponible:</p>";

    } else {
    	alert ("Se ha producido un error.");
    }

    $(".popup-title").html("¡Enhorabuena!");
	$(".popup-body").html(popupmsg);
    $("#next-code").val(currentCH[0].next);
    
    REINICIAR == true ? document.getElementById("replay-popup").style.display = "inline-block" : document.getElementById("replay-popup").style.display = "none";
    CONTINUAR == true ? document.getElementById("next-popup").style.display = "inline-block" : document.getElementById("next-popup").style.display = "none";

    $("body").css("overflow","hidden");
	$("#popup-bg").fadeIn(600);
};

function setMenu (id) {
	var currentStory = storyDB.filter(function(v) {return v.id == id});

	var mainchar = document.getElementsByClassName("main-char")[0];
	var objectives = document.getElementsByClassName("objectives")[0];
	var inventory = document.getElementsByClassName("inventory")[0];
	var checkpoint = document.getElementsByTagName("code")[0];

	mainchar.innerHTML = "";
	objectives.innerHTML = "";
	inventory.innerHTML = "";
	checkpoint.innerHTML = "";

	// Main char
	
	switch (currentStory[0].checkpoint[7]) {
		case "X": mainchar.innerHTML = "&gt; Historia principal.";

			//Primera ejecución, ocultar episode-container y mostrar char-select
			if(currentStory[0].playChar.length > 1) {				
				var charSelect = document.getElementById("char-select");
				charSelect.innerHTML = "";

				for (p = 0; p < currentStory[0].playChar.length; p++) {
					var selectChar = npcDB.filter(function(v) {return v.id == currentStory[0].playChar[p]});

					var div = document.createElement("div");
					div.setAttribute("class","play-char");
					div.setAttribute("id", currentStory[0].goto[p]);
					div.setAttribute("title", currentCH[0].char[p]);
					div.style.backgroundImage = "url('" + selectChar[0].imgURL + "')"

					charSelect.appendChild(div);
				};
			} else {
				break;
			};
		break;

		case "A": mainchar.innerHTML = "&gt; Historia principal: " + currentCH[0].char[0];break;
		case "B": mainchar.innerHTML = "&gt; Historia principal: " + currentCH[0].char[1];break;
		case "C": mainchar.innerHTML = "&gt; Historia principal: " + currentCH[0].char[2];
	};

	if (currentStory[0].checkpoint[7] != "X") {

		if (currentStory[0].setObjective.length != 0) {
			var ul = document.createElement("ul");
			var lista = ""; 
			var cuentaPositivo = 0;

			// Menu lateral
			for (o = 0; o < currentStory[0].setObjective.length; o++) {
				var objId = currentStory[0].setObjective[o];
				var obj = objectiveDB.filter(function(v) {return v.id == Math.abs(objId)});

				if (objId > 0) {
					var oac = objetivosActivos.filter(v => {return v.id == objId});
					if (oac.length == 0) objetivosActivos.push(obj[0]);

					cuentaPositivo++;

					lista = lista + '<li>' + obj[0].text + '</li>';

					//Revisar
					if(obj[0].type == "moves") {
						OBJmoves = obj[0].value;
						OBJplaces = false;
					} else {
						OBJmoves = false;
						
						if (obj[0].type == "special") {
							OBJsp = obj[0].value;
							var temp = specialDB.filter(v => {return v.id == OBJsp});
							OBJplaces = temp[0].place;
						} else {
							OBJsp = "";
							OBJplaces = obj[0].value;	
						};
					};

				} else {
					lista = lista + '<li class="done">' + obj[0].text + '</li>';

					var oac = objetivosActivos.filter(v => {return v.id == Math.abs(objId)});
					if (oac.length == 1) {
						oac = objetivosActivos.indexOf(obj[0]);
						objetivosActivos.splice(oac, 1);
					};
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
				/*
					if (OBJsp != "") { // Objetivo especial
						cargarClicker(OBJsp);
					};*/
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

	} else {
		document.getElementById("episode-container").style.display = "none";
		document.getElementById("char-container").style.display = "inline-block";
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
	contenedor.style.backgroundImage = "url('" + currentPlace[0].imgURL + "')";

	// Verificar si se completan los objetivos
	var breakFor = false, setMoves = false;
	for (a = 0; a < objetivosActivos.length; a++) {
		switch (objetivosActivos[a].type) {
			case "place": 
				if (objetivosActivos[a].value == id) {
					cargarStory(objetivosActivos[a].next);
					objetivosActivos.splice(a, 1);
					breakFor = true;
				};
			break;
			case "moves":
				objetivosActivos[a].value --;
				if (objetivosActivos[a].value < 1) {
					cargarStory(objetivosActivos[a].next);
					objetivosActivos.splice(a, 1);
					breakFor = true;
				};
			break;
			case "special":
				cargarClicker(OBJsp);
			break;
		};

		if (breakFor) break;
	};

	if (!breakFor) setDesplazamientos(id);
};

function cargarClicker(id) {
	contenedor.innerHTML = "";
	var temp = specialDB.filter(v => {return v.id == id});

	for (c = 0; c < temp[0].click; c++) {
		var html = '<img class="special" src="' + temp[0].img[c].url + '" style="'+ temp[0].img[c].style + '">';
		$("#episode-container").append(html);
	};	
};

$(function() { 

	$("#episode-container").each(function(){$(this).on("click", ".choice", function() {

		var choiceSeleted = $(this).attr("id");
		cc = 0;
		if (choiceSeleted == "undefined") {
			finalizaEpisodio();
		} else {
			var story = storyDB.filter(v => {return v.id == current});
			if (story[0].closeDialog == true) {

			//}
			//if (choiceSeleted == nextTemp) {

				var temp = storyDB.filter(function(v) {return v.id == current});

				// Objetivos únicos, comprueba si es especial
				var obj = objectiveDB.filter(v => {return v.id == temp[0].setObjective[0]});
				if (obj[0].type == "special") {
					OBJsp = obj[0].value;
					obj = specialDB.filter(v => {return v.id == OBJsp});
					cc -= obj[0].click;
				} else {
					OBJsp = "";
				}
				
				

				if (OBJsp == "") {
					setDesplazamientos(temp[0].place);
				} else {
					cargarClicker(OBJsp);
				}
				
				setMenu(current);
			} else {
				// Comprobar si es un objetivo especial
				cargarStory(choiceSeleted);
			};
		};

	})});

	$("#episode-container").each(function(){$(this).on("click", ".special", function() {
		$(this).remove();
		if ($(".special").length == 0) {
			var dialog = storyDB.filter(v => {return v.id == current});
			cargarStory(dialog[0].nextStory[0]);
		};
	})});

	$("#char-select").each(function(){$(this).on("click", ".play-char", function() {
		var selectedChar = $(this).attr("id");
		$("#char-container").fadeOut(200);
		cargarStory(selectedChar);
		$("#episode-container").delay(200).fadeIn(400);

	})});

	$("#episode-container").each(function(){$(this).on("click", ".changeLocation", function() {
		var mov = $(this).attr("id");
		changeLocation(mov);

	})});

	$("#replay-popup").click(function() { 
		$("#popup-bg").fadeOut(400);
        $("body").css("overflow","auto");
		cargarCheckpoint(currentCH[0].current);
	});

	$("#next-popup").click(function() { 
		$("#popup-bg").fadeOut(400);
        $("body").css("overflow","auto");
		cargarCheckpoint(currentCH[0].next);
	});

	$("#episode-container").click(function() {
		if (cc == 1) {
			$(".typewriter-letter").css("opacity", "1");
			$(".choiceTextRpg").show();
			cc = 0;
		} else {
			cc++;
		};

	});

});