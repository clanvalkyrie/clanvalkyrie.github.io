var storiesGlobal = [];
$(document).ready(function() {
	// Cargar DB
	$.get("./data/stories/ch.json", dbChapters => {
		storiesGlobal = dbChapters;
		drawStoriesList(dbChapters);
	});
});

const drawStoriesList = stories => {

	$("#stories-list").html("");
	let story = []
	if (!(window.location.href).includes("//127.0.0")) {
		story = stories.filter(v => v.visible);
	} else {
		story = stories.filter(v => {return v.visible || v.visible == false});
	}
	

	for (i = 0; i < story.length; i++) {
		$("#stories-list").append(`<div class="story-container" data-target="${story[i].ubicacion}"></div>`);
		$(".story-container").eq(i)
		.append(`<div class="story-cover-container"><img class="story-image ${story[i].portada == null ? "empty" : "" }" src="${story[i].portada != null ? story[i].portada : "./assets/logo.png" }"></div>`)
		.append(`<div class="story-info"></div>`);
		$(".story-info").eq(i)
		.append(`<div class="story-name">${story[i].nombre}</div>`)
		.append(`<div class="story-status">${story[i].finalizado ? "Finalizado" : "En curso"}</div>`);

		if (!story[i].visible) $(".story-container").eq(i).addClass("hidden");

	};
};

const drawEpisodeList = location => {
	$(".episode-list").html("");
	let story = storiesGlobal.filter(v => {return v.ubicacion == location});

	$(".episode-list")
	.append(`<div class="story-title">${story[0].nombre}</div>`)
	.append(`<div class="story-episodes-title">Lista de episodios:</div>`)
	.append(`<div class="episodes"></div>`);

	for (i = 0; i < story[0].capitulos.length; i++) {
		$(".episodes").append(`<div class="episode-container"></div>`);
		$(".episode-container").eq(i)
		.append(`<div class="episode-info"></div>`)
		.append(`<div class="play-episode" data-story="${story[0].ubicacion}" data-episode="${story[0].capitulos[i].episodio}"><i class="fa fa-play"></i></div>`);

		let desc = story[0].capitulos[i].descripcion;

		$(".episode-info").eq(i)
		.append(`<div class="episode-title">${story[0].capitulos[i].episodio}. ${story[0].capitulos[i].nombre}</div>`)
		.append(`<div class="episode-description${desc == null ? " empty" : ""}">${desc != null ? desc : "Sin descripción."}</div>`);

		// Comprobar si está leído
		let check = window.localStorage.getItem(`${story[0].ubicacion}&&&${story[0].capitulos[i].episodio}`);
		if (check == "played") $(".episode-container").eq(i).addClass("played");

	};

	$("#episodes-modal").fadeIn(100);
};

const showEpisode = (episode) => {
	if (episode) {
		$("#stories").fadeOut(200);
		window.setTimeout(() => {
			$("#episode").fadeIn(200);
		}, 200);

	} else {
		$("#episode").fadeOut(200);
		window.setTimeout(() => {
			$("#stories").fadeIn(200);
		}, 200);
	};
};

// listeners

$("#stories").on("click", ".story-container", function() {
	let target = $(this).data("target");
	drawEpisodeList(target);
});

$("#episodes-modal").click(function() {
	$("#episodes-modal").fadeOut(100);
});

$(".episode-list").click(function(event) {
	event.stopPropagation();
});

$(".episode-list").on("click", ".play-episode", function() {
	let story = $(this).data("story");
	let episode = parseInt( $(this).data("episode") );
	showEpisode(true);
	playEpisode(story, episode);
});