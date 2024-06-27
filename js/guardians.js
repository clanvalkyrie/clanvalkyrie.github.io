$(document).ready(function() {
	drawFichas();
});

function dibujarFichas() {
	$("section").html("");
	guardian.pop();

	for (i = 0; i < guardian.length; i++) {
		$("section").append('<div class="characters"></div>');
		$(".characters").eq(i).append('<div class="charname">' + guardian[i].nombre + '</div>');
		$(".characters").eq(i).append('<div class="charimg"><img src="' + guardian[i].img + '"/></div>');
		$(".characters").eq(i).append('<div class="charinfo"></div>');

		try {
			for (d = 0; d < guardian[i].ficha.length; d++) {
				$(".charinfo").eq(i).append('<b>' + guardian[i].ficha[d].k + ':</b> ' + guardian[i].ficha[d].v + '<br>');
			};
		} catch(e) {}

		$(".charinfo").eq(i).append('<p><a class="charnav" href="' + guardian[i].perfil + '">Visítame.</a></p>');
		$(".charinfo").eq(i).append('<div class="bio">Bio</div><span style="text-align: center;"></span>');

		for (p = 0; p < guardian[i].bio.length; p++) {
			$(".charinfo").eq(i).find('span').append('<p>' + guardian[i].bio[p] + '</p>')
		}
	};

};

const drawFichas = () => {
	$("#people").html("");
	guardian.pop();

	for (i = 0; i < guardian.length; i++) {
		$("#people").append('<div class="photodiv animation"></div>');
		$(".photodiv").eq(i)
		.append(`<div class="photoname pointer" data-toggle="modal" data-target="${guardian[i].tag}"></div>`)
		.append(`<img class="photo" src="${guardian[i].img}">`);
		$(".photoname.pointer").eq(i).append(`<span class="rotate">${guardian[i].nombre}</span>`);
	};
};

const drawModal = tag => {

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

$(function() {
	$("body").on("click", ".photodiv", function() {
		let char = $(this).find(".photoname").attr("data-target");
		drawModal(char);
		$(`.modal`).fadeIn(200);
	});

	$("body").on("click", ".modal", function() {
		if ($(this).attr("class") != ".modal-content") {
			$(".modal").fadeOut(200);
			setTimeout(function() {
				$(".modal-description").scrollTop(0);
				$(".modal").remove();
			}, 300);	
		};
	});
	
});