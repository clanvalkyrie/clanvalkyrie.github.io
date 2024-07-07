var globalMap = [];
$(document).ready(function(){
    $.get('../data/stories/general/v_mapa.json', mapa => {
		globalMap = mapa;
		cargarLista(globalMap);
	})
	
});

const cargarLista = mapa => {

	let select = $("select").eq(0).val();
	let bg = mapa.filter(v => v.tag == select);

	$("#category-container").html(`<div class="title">${select}</div>`);

	if (bg.length > 0) {

		$("#category-container").append('<div id="list-container"></div>');

		for (i = 0; i < bg.length; i++) {
			$("#list-container").append(`<div class="item-container" data-point="${bg[i].id}"></div>`);
			$(".item-container").eq(i).append(`<img src="../${bg[i].imgURL}">`);
			$(".item-container").eq(i).append(`<p><b>${bg[i].id}</b></p><p>${(bg[i].name).replace(/<br>/g, " ")}</p>`);

		};

	} else {
		$("#category-container").append("<br><p>Esta categoría está vacía.</p>");
	};
};

const drawPreview = id => {
	$("#background-preview").html("");
	let map = globalMap.filter(v => v.id == id);
	$("#background-preview").css("background-image", `url(../${map[0].imgURL})`);

	for (p = 0; p < map[0].points.length; p++) {

		// Dibujar punto
		$("#background-preview").append(`<div class="changeLocation tooltip" data-location="${map[0].points[p].id}" style="${map[0].points[p].position}"></div>`);
		
		// Asignar nombre
        let point = globalMap.filter(v => v.id == map[0].points[p].id);
        $(".tooltip").eq(p).append(`<span class="tooltiptext">${point[0].name}</span>`);

        // Ubicar el tooltip
        switch (map[0].points[p].tooltip) {
            case "left":
                $(".tooltiptext").eq(p).css("left", "-145px");
                $(".tooltiptext").eq(p).height() > 28 ? $(".tooltiptext").eq(p).css("top", "-18px") : $(".tooltiptext").eq(p).css("top", "-7px");
                break;
            case "right":
                $(".tooltiptext").eq(p).css("left", "30px");
                $(".tooltiptext").eq(p).height() > 28 ? $(".tooltiptext").eq(p).css("top", "-18px") : $(".tooltiptext").eq(p).css("top", "-7px");
                break;
            default:
                $(".tooltiptext").eq(p).css("bottom", "200%");
                $(".tooltiptext").eq(p).css("left", "50%");
                $(".tooltiptext").eq(p).css("margin-left", "-70px");
        };

	};
	
};

$(function() {
	$("#select-category").change(function() {
		cargarLista(globalMap);
	});

	$("#category-container").on("click", ".item-container", function() {
		let point = $(this).attr("data-point");
		navigator.clipboard.writeText(point);	
		$(this).find("img").css("filter", "brightness(2)");

		setTimeout(() => {
			$(this).find("img").removeAttr("style");
		}, 200);
	});

	$("#category-container").on("click", "img", function(e) {
		e.stopPropagation();
		let point = parseInt($(this).parent().attr("data-point"));
		drawPreview(point);
		$("#draw-preview").css("display", "grid");
	});

	$("#draw-preview").click(function() {
		$("#draw-preview").hide();
	});

	$("#bg-container").click(function(e) {
		e.stopPropagation();
	});

	$("#background-preview").on("click", ".changeLocation", function() {
		let point = parseInt($(this).attr("data-location"));
		drawPreview(point);
	});
});

