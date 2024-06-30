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
});

