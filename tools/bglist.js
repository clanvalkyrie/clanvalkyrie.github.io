$(document).ready(function(){
    // Cargar lista de escenarios
    const requestBG = new XMLHttpRequest();requestBG.open("GET","/valkyrieclub/data/common/general-places.json");requestBG.responseType = "json";requestBG.send();
    requestBG.onload = function() {json = requestBG.response;cargarLista(json);};
});

var REMOTE = "https://zunnay.github.io";

function cargarLista(lista) {
	var select = document.getElementsByTagName("select")[0].value;
	var bg = lista.filter(function(v) {return v.tag == select});
	var txt = "<h3>" + select + "</h3>";

	if (bg.length > 0) {
		txt += "<table>";

		var rows = Math.floor(bg.length / 4);
		var mod = bg.length % 4;
		var i = 0;

		for (r = 0; r < rows; r++) {

			txt += "<tr>";

			for (c = 1; c <= 4; c++) {
				i = (r*4) + c - 1;
				txt += "<td><img src='" +  REMOTE + bg[i].imgURL + "'>" + bg[i].id + " - " + bg[i].name + "</td>";
			};

			txt += "</tr>";
		};

		if (mod > 0) {
			if(i != 0) i++;
			txt += "<tr>";
			for (i; i < bg.length; i++) {
				txt += "<td><img src='" +  REMOTE + bg[i].imgURL + "'>" + bg[i].id + " - " + bg[i].name + "</td>";
			};

			var vacio = 4 - mod;
			for (v = 0; v < vacio; v++) {
				txt += "<td style='border:none;'></td>";
			};
			
			txt += "</tr>";
		};
		txt = txt + "</table>";

	} else {
		txt += "<br><p>Esta categoría está vacía.</p>";
	}

	$("#category-container").html(txt);
}

$(function() {
	$("#select-category").change(function() {
		cargarLista(json);
	});
});

