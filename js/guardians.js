$(document).ready(function() {
	drawFichas();
});

const drawFichas = () => {
	$("#people").html("");
	guardian.pop();

	for (i = 0; i < guardian.length; i++) {

		$("#people").append('<div class="photodiv animation"></div>');

		if (guardian[i].tag != "unknown") {
			
			$(".photodiv").eq(i)
			.append(`<div class="photoname pointer" data-toggle="modal" data-target="${guardian[i].tag}"></div>`)
			.append(`<img class="photo${guardian[i].tag == "unknown" ? " unknown" : ""}" src="${guardian[i].img}">`);
			$(".photoname.pointer").eq(i).append(`<span class="rotate">${guardian[i].nombre}</span>`);

		} else {

			$(".photodiv").eq(i)
			.append(`<div class="photoname pointer" data-toggle="modal" data-target="${guardian[i].tag}"></div>`)
			.append(`<img class="photo unknown" src="./assets/logo.png">`);
			$(".photoname.pointer").eq(i).append(`<span class="rotate">?</span>`);
		};
		
	};
};

const drawModal = tag => {

	if (tag != "unknown") {

		let char = guardian.filter(v => v.tag == tag);

		$("body").append(`<div class="modal show" id="${char[0].tag}Modal"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"></div></div></div>`);
		$(".modal-content").append(`<div class="modal-body"></div>`);
		$(".modal-body").append(`<img class="modal-img" src="${char[0].img}"><div class="modal-info"></div>`);
		$(".modal-info")
		.append(`<div id="modal-name"><p>${char[0].nombre}</p></div>`)
		.append(`<div class="modal-attributes"><ul class="data"></ul></div>`)
		.append(`<div class="modal-description"></div>`);
	
		if (char[0].ficha != undefined) {
			for (i = 0; i < char[0].ficha.length; i++) {
				$(".modal-attributes .data").append(`<li><span class="data-label">${char[0].ficha[i].k}:</span> ${char[0].ficha[i].v}</li>`);
			};
		};
	
		if (char[0].perfil != "") {
			$(".modal-attributes .data").append(`<li class="link-profile"><a href="${char[0].perfil}">VISÍTAME</a></li>`);
		};
	
		for (d = 0; d < char[0].bio.length; d++) {
			$(".modal-description").append(`<p>${char[0].bio[d]}</p>`);
		};

	};
};

$(function() {
	$("body").on("click", ".photodiv", function() {
		let char = $(this).find(".photoname").attr("data-target");
		drawModal(char);
		$(`.modal`).fadeIn(200);
	});

	$("body").on("click", ".modal", function() {
		$(".modal").fadeOut(200);
		setTimeout(function() {
			$(".modal-description").scrollTop(0);
			$(".modal").remove();
		}, 300);
	});

	$("body").on("click", ".modal-content", function(e) {
		e.stopPropagation();
	});
	
});