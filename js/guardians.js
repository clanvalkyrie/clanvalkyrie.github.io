$(document).ready(function() {
	if ((window.location.href).includes("//127.0.0")) $("body").addClass("devmode");
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
			.append(`<img class="photo${guardian[i].tag == "unknown" ? " unknown" : ""}" src="${guardian[i].img[0]}">`);
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
	// dibujar todos y ubicar "tag" = left:0
	let currentTagIndex = guardian.findIndex(v => v.tag == tag);
	
	$("body").append(`<div class="modal show"><div class="modal-dialog modal-dialog-centered"></div></div>`);
	for (g = 0; g < guardian.length; g++) {

		if (tag != "unknown") {

			$(".modal-dialog").append('<div class="modal-content"></div>');

			$(".modal-content").eq(g).append(`<div class="modal-body"></div>`);
			$(".modal-body").eq(g).append(`<div class="alt-image-container"></div>`);
	
			for (i = 0; i < guardian[g].img.length; i++) {
				$(".modal-body").eq(g).append(`<img class="modal-img${(i == 0) ? " selected" : ""}" src="${guardian[g].img[i]}">`);
				$(".alt-image-container").eq(g).append(`<div class="alt-image${(i == 0) ? " selected" : ""}" data-image="${i}">${i + 1}</div>`);
			};
	
			if (guardian[g].img.length == 1) {
				$(".alt-image-container").eq(g).hide();
			};
	
			$(".modal-body").eq(g).append(`<div class="modal-info"></div>`);
			$(".modal-info").eq(g)
			.append(`<div id="modal-name"><p>${guardian[g].nombre}</p></div>`)
			.append(`<div class="modal-attributes"><ul class="data"></ul></div>`)
			.append(`<div class="modal-description"></div>`);
		
			if (guardian[g].ficha != undefined) {
				for (i = 0; i < guardian[g].ficha.length; i++) {
					$(".modal-attributes .data").eq(g).append(`<li><span class="data-label">${guardian[g].ficha[i].k}:</span> ${guardian[g].ficha[i].v}</li>`);
				};
			};
		
			if (guardian[g].perfil != "") {
				$(".modal-attributes .data").eq(g).append(`<li class="link-profile"><a href="${guardian[g].perfil}">VISÍTAME</a></li>`);
			};
		
			for (d = 0; d < guardian[g].bio.length; d++) {
				$(".modal-description").eq(g).append(`<p>${guardian[g].bio[d]}</p>`);
			};
	
		};

		// posicion
		if (g < currentTagIndex) {
			$(".modal-content").eq(g).css("left", "-100vw");
		} else if (g > currentTagIndex) {
			$(".modal-content").eq(g).css("left", "100vw");
		} else {
			$(".modal-content").eq(g).css("left", 0);
		};
	};

	// flechas!
	$(".modal-dialog").append('<div class="modal-button prev"><i class="fa fa-chevron-left"></i></div>');
	$(".modal-dialog").append('<div class="modal-button next"><i class="fa fa-chevron-right"></i></div>');
	toggleModalButtons(currentTagIndex);
};

const toggleModalButtons = index => {
	$(".modal-button.prev").attr("data-prev", (index - 1));
	$(".modal-button.next").attr("data-next", (index + 1));

	if (index == 0) {
		$(".modal-button.prev").hide();
	} else if (index == (guardian.length - 1)) {
		$(".modal-button.next").hide();
	} else {
		$(".modal-button").fadeIn(200);
	};
};

const switchModal = (from, to) => {

	// ocultar botones
	$(".modal-button").fadeOut(200);

	setTimeout(function() {

		if (from < to) {
			// next
			$(".modal-content").eq(from).css("left", "-100vw");
			$(".modal-content").eq(to).css("left", "0");

		} else if (to < from) {
			// prev
			$(".modal-content").eq(from).css("left", "100vw");
			$(".modal-content").eq(to).css("left", "0");

		};

	}, 200);

	setTimeout(function() {
		$(".modal-button").fadeIn(200);
		toggleModalButtons(to);
	}, 500);
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

	$("body").on("click", ".modal-button.prev", function(e) {
		e.stopPropagation();

		let to = parseInt($(this).attr("data-prev"));
		let from = to + 1;
		switchModal(from, to);
	});

	$("body").on("click", ".modal-button.next", function(e) {
		e.stopPropagation();

		let to = parseInt($(this).attr("data-next"));
		let from = to - 1;
		switchModal(from, to);
	});

	$("body").on("click", ".alt-image", function() {
		let clase = $(this).attr("class");
		if (!clase.includes("selected")) {
			let index = parseInt($(this).attr("data-image"));
			$(this).parent().find(".alt-image.selected").removeClass("selected");
			$(this).parent().parent().find(".modal-img.selected").removeClass("selected");

			$(this).addClass("selected");
			$(this).parent().parent().find(".modal-img").eq(index).addClass("selected");

		};
	});

	$("html").keydown(function(e) {
		if ($(".modal.show").length == 1) {

			let key = e.keyCode;
			if (key != 38 && key != 40) {

				let prev = parseInt($(".modal-button.prev").attr("data-prev"));
				let next = parseInt($(".modal-button.next").attr("data-next"));
				let current = prev + 1;
	
				if (key == 37 && current > 0) {
					// left
					switchModal(current, prev);
	
				} else if (key == 39 && current < (guardian.length - 1)) {
					// right
					switchModal(current, next);
				};

			} else {
				// es up o down
				e.preventDefault();
			};

		};
	});
});