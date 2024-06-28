var globalStory = [], globalMap = [], globalChar = [];

const playEpisode = async (story, episode) => {
    
    let storyInfo = storiesGlobal.filter(v => v.ubicacion == story);
    let episodeInfo = storyInfo[0].capitulos.filter(v => v.episodio == episode);
    let num = (episodeInfo[0].episodio < 10) ? ("0" + episodeInfo[0].episodio) : (episodeInfo[0].episodio);
    let name = ((episodeInfo[0].nombre).replace(/ /g, "_")).toLowerCase();
    let episodeName = `${num}-${normalize(name)}`;

    let map = storyInfo[0].mapa != "mapa.json" ? `general/${storyInfo[0].mapa}` : `${story}/${episodeLocation}/${storyInfo[0].mapa}`;
    let pj = storyInfo[0].personajes != "personajes.json" ? `general/${storyInfo[0].personajes}` : `${story}/${episodeLocation}/${storyInfo[0].personajes}`;
    
    $("#episode-name").text(`${episode} - ${episodeInfo[0].nombre}`);
    $("#episode-name").prepend('<span class="back-button">Regresar</span>');

    await $.get(`./data/stories/${story}/${episodeName}.json`, async storyDB => {
        await $.get(`./data/stories/${map}`, async mapDB => {
            await $.get(`./data/stories/${pj}`, async charDB => {
                globalStory = storyDB;
                globalMap = mapDB; 
                globalChar = charDB;

                // console.log("Todas las DB se cargaron correctamente");
                adminPanel();
                $("#player").attr("data-story", story).attr("data-episode", episode);
                drawScene(globalStory[0].id);
            });
        });
    });
};

const adminPanel = () => {
    if ((window.location.href).includes("//127.0.0.")) {
        if ($("#dev-menu").length == 0) {
            $("#episode").append(`<div id="dev-menu"><div class="dev-header">Admin Panel</div><input id="dev-load" type="text" placeholder="Cargar escena"></div>`);
        } else {
            $("#dev-load").val("");
        };   
    };
};

const drawScene = (id) => {
    // Comprobar tipo de escena
    // > pov_selector = si solo hay un pov, omitir
    // > objectives = define objetivos
    //    > required = objetivo principal, obligatorio
    //    > optional = objetivo opcional
    // > story_general = cuadro lila de historia
    // > info_general = cuadro blanco de información
    // > npc_dialog = dialogos normales
    // > function = funciones especial (ej: cargar popup con invitacion)

    // Recuperar NPC actual 
    let currentNPC = $(".npc-container").length == 1 ? $(".npc-container").data("char") : null;

    // Limpiar pantalla
    $("#player").html("");

    // Variable en caso de error
    let skip = null;

    // Filtrar escena solicitada
    let scene = globalStory.filter(v => {return v.id == id});

    // Comprobar que existe y que no haya IDs repetidos
    if (scene.length == 0) skip = `El ID de escena ${id} no existe.`;
    if (scene.length > 1) skip = `El ID de escena ${id} está repetido.`;

    // Comprobar si es pov_selector
    if (skip == null && scene[0].type == "pov_selector") {
        if (scene[0].pov.length > 1) {
            // Dibujar interfaz de POVs
            // Pendiente

        } else {
            skip = "pov"; // Si hay un solo pov, pasar a la siguiente escena
        };

    // Comprobar si son objetivos
    } else if (skip == null && scene[0].type == "objectives") {
        skip = "objectives";
        printObjectives(scene[0].list, scene[0].id);
        drawMapPoints(scene[0].background);
    } else if (skip == null && scene[0].type == "function") {
        skip = "function";
        if (scene[0].name == "show_image") {
            show_image(scene[0].image, scene[0].buttonText, scene[0].buttonLink, scene[0].next);
        };
    };

    // Si no es pov_selector, dibujar fondo
    if (skip == null && scene[0].type != "pov_selector") {

        if (!isNaN(scene[0].background)) {
            // Buscar imagen
            let location = globalMap.filter(v => {return v.id == scene[0].background});

            if (location.length == 1) {
                // Colocar fondo
                $("#player").css("background-color", "black");
                $("#player").css("background-image", `url(${location[0].imgURL})`);
                $("#player").attr("data-map", scene[0].background);

            } else if (location.length > 1) {
                skip = `El fondo ${scene[0].background} está duplicado.`;
            } else {
                skip = `El fondo ${scene[0].background} no existe`;
            };

        } else if (scene[0].background == "white" || scene[0].background == "black") {
            $("#player").removeAttr("style"); // quitar imagen si es que existe
            $("#player").css("background-color", scene[0].background);
        };
    };

    // Dibujar NPC
    if (skip == null && scene[0].npc.length > 0) {

        for (n = 0; n < scene[0].npc.length; n++) {
            let gardie = globalChar.filter(v => v.id == scene[0].npc[n]);
            if (gardie.length == 0)  skip = `El personaje ${scene[0].npc[n]} no existe.`;
            if (gardie.length > 1) skip = `El código ${scene[0].npc[n]} está asignado a más de un personaje.`;

            $("#player").append(`<div class="npc-container" data-char="${scene[0].npc[n]}"><img src="${gardie[0].imgURL}"></div>`);

            if (gardie[0].type == "char" || gardie[0].type == "extra") {
                $(".npc-container").eq(n).attr("data-char", scene[0].npc[n]);
                $(".npc-container").addClass("npc");

                // if (scene[0].npc.length == 1) $(".npc-container").eq(n).css("width", "550px");
                gardie[0].type == "char" ? $(".npc-container img").eq(n).css("width", "550px") : $(".npc-container img").attr("style", gardie[0].style);

                // mover gardis segun la cantidad!
                if (scene[0].npc.length == 2) {
                    n == 0 ? $(".npc-container img").css("left", "-130px").css("z-index", 1) : $(".npc-container img").css("left", "120px");

                } else if (scene[0].npc.length == 3) {
                    n == 0 ? $(".npc-container img").css("left", "-180px") : n == 1 ? $(".npc-container img").css("left", "170px") : $(".npc-container img").css("left", 0);
                };

            } else {
                // pet || sfx
                $(".npc-container").eq(n).addClass(gardie[0].type);
                if (gardie[0].type == "pet") $(".npc-container").attr("style", gardie[0].style);
            };
            
        };

        if (currentNPC == null || scene[0].npc[0] != currentNPC) {
            $(".npc-container").css("-webkit-animation-name", "fade-in");
            $(".npc-container").css("animation-name", "fade-in");
        };

    };

    // Dibujar escena según su tipo
    if (skip == null && scene[0].type == "story_general") {

        $("#player").append(`<div id="${scene[0].id}" class="text undefined" style="top: 50px; left: 81px;"><div style="width: 600px;"></div></div>`);
        $(`#${scene[0].id}`).css("display", "none");
        $(`#${scene[0].id}`).fadeIn(500);

        let siglas = scene[0].text;
        for (s = 0; s < siglas.length; s++) {
            $(".text.undefined div").append(`<span class="typewriter-letter">${siglas[s]}</span>`);
        };

        for (t = 1; t <= siglas.length; t++) {
            let time = t + "00";
            time = parseInt(time) / 3;
            $(".typewriter-letter").eq(t-1).delay(time + 500).animate({opacity:1},100);
        };

    } else if (skip == null && scene[0].type == "info_general") {
        $("#player").append(`<div class="bubbleInfo"><div>${scene[0].text}</div></div>`);

    } else if (skip == null && scene[0].type == "npc_dialog") {

        if (scene[0].text != "") {

            // Solo una burbuja
            $("#player").append(`<div data-bubble="${scene[0].id}" class="bubbleText">${scene[0].text}</div>`);

            // Ubicar según la cantidad de NPCs
            (scene[0].npc.length == 2) ? $(".bubbleText").addClass("duo") : (scene[0].npc.length == 3) ? $(".bubbleText").addClass("trio") : $(".bubbleText").addClass("undefined");

            //	// opcion multiText PENDIENTE

            //	if (currentStory[0].multiText) {
            //		// Múltiples burbujas
            //		for (m = 0; m < currentStory[0].text.length; m++) {
            //			var div = document.createElement("div");
            //			div.setAttribute("class", "bubbleText multi");

            //			div.setAttribute("id", currentStory[0].id + "-" + m);
            //			div.innerHTML = currentStory[0].text[m].text;
            //			div.setAttribute("style", currentStory[0].text[m].style);
            //			contenedor.appendChild(div);		
            //		};

        };

    } else if (skip == null) {
        skip = `El tipo de la escena ${id} es incorrecto.`;
    };


    // Si no hay skip y no es pov_selector ni objectives, dibujar choices
    if (skip == null && scene[0].type != "pov_selector" && scene[0].type != "objectives" && scene[0].type != "function") {
        $("#player").append(`<div id="choiceText" class="choiceTextRpg"></div>`);

        for (c = 0; c < scene[0].choices.length; c++) {
            $("#choiceText").append(`<div class="choice" data-next="${scene[0].choices[c].next}">${scene[0].choices[c].text}</div>`);
        };

        if (scene[0].self != "") {
            // dibujar PJ
            let gardie = globalChar.filter(v => v.id == scene[0].self);
            $("#choiceText").append(`<div class="own-npc"><img class="npcRpg" src="${gardie[0].imgURL}"></div>`)
        } else {
            $("#choiceText").css("width", "96%")
            $(".choice").css("padding-right", "3px");
        }

        // Mostrar choices
        let siglas = $(".typewriter-letter").length;
        scene[0].type == "story_general" ? $(".choiceTextRpg").delay(siglas * 34 + 500).fadeIn(500) 
            : scene[0].type == "npc_dialog" && scene[0].text != "" ? $(".choiceTextRpg").delay(500).fadeIn(500)
                : scene[0].type == "info_general" || scene[0].type == "npc_dialog" && scene[0].text == "" ? $(".choiceTextRpg").fadeIn(500) : "";

    } else if (skip == "pov") {
        // Dibujar siguiente escena
        drawScene(scene[0].pov[0].scene);

    } else if (scene[0].type != "objectives" && scene[0].type != "function") {
        // Se produjo un error.
        alert(skip);
    };
};

// Mostrar objetivos
const printObjectives = (list, scene) => {
    for (i = 0; i < list.length; i++) {
        $(".obj-list ul").prepend(`<li class="objective active" data-scene="${scene}" data-required="${list[i].required}" data-type="${list[i].type}" data-value="${list[i].value}" data-next="${list[i].next}">${list[i].text}</li>`);
        if (list[i].text == null) $(".objective").eq(0).hide();
    };
};

// Dibujar puntos de desplazamiento
const drawMapPoints = (location) => {
    // Limpiar todo 
    $("#player").html("");

    // Buscar ubicación
    let map = globalMap.filter(v => v.id == location);

    // Cambiar fondo
    $("#player").css("background-image", `url(${map[0].imgURL})`);
    $("#player").attr("data-map", location);

    for (m = 0; m < map[0].places.length; m++) {

        // Dibujar punto
        $("#player").append(`<div class="changeLocation tooltip" data-location="${map[0].places[m]}" style="${map[0].style[m]}"></div>`);
        
        // Asignar nombre
        let point = globalMap.filter(v => v.id == map[0].places[m]);
        $(".tooltip").eq(m).append(`<span class="tooltiptext">${point[0].name}</span>`);

        // Ubicar el tooltip
        switch (map[0].tooltip[m]) {
            case "left":
                $(".tooltiptext").eq(m).css("left", "-145px");
                $(".tooltiptext").eq(m).height() > 28 ? $(".tooltiptext").eq(m).css("top", "-18px") : $(".tooltiptext").eq(m).css("top", "-7px");
                break;
            case "right":
                $(".tooltiptext").eq(m).css("left", "30px");
                $(".tooltiptext").eq(m).height() > 28 ? $(".tooltiptext").eq(m).css("top", "-18px") : $(".tooltiptext").eq(m).css("top", "-7px");
                break;
            default:
                $(".tooltiptext").eq(m).css("bottom", "200%");
                $(".tooltiptext").eq(m).css("left", "50%");
                $(".tooltiptext").eq(m).css("margin-left", "-70px");
        };
    };
};

// Comprobar si cumple algún objetivo
const checkNextPoint = (point) => {

    if ($(`.objective.active[data-value="${point}"]`).length == 1) {
        // Se completo 1 objetivo
        let scene = $($(`.objective.active[data-value="${point}"]`)).data("scene");
        let required = $($(`.objective.active[data-value="${point}"]`)).data("required");
        let type = $($(`.objective.active[data-value="${point}"]`)).data("type");
        let value = $($(`.objective.active[data-value="${point}"]`)).data("value");
        let next = parseInt($($(`.objective.active[data-value="${point}"]`)).data("next"));

        $(`.objective.active[data-value="${point}"`).addClass("completed").removeClass("active");
        
        // El objetivo completado era obligatorio?
        if (required == true) {
            // Comprobar si hay mas objetivos hermanos (de la misma escena) requeridos
            if ($(`.objective.active[data-scene="${scene}"][data-required="${true}"]`).length == 0) {

                // Era el único, cancelar todos los objetivos hermanos opcionales activos
                $(`.objective.active[data-scene="${scene}"]`).addClass("cancelled").removeClass("active");

            } else {
                // Hay más objetivos hermanos obligatorios
                // PENDIENTE
            };
        };

        // Cargar escena siguiente
        drawScene(next);

    } else if ($(`.objective.active[data-value="${point}"]`).length > 1) {
        // Se completaron varios objetivos
        // PENDIENTE
    } else {
        // No se completó ningún objetivo, continuar
        drawMapPoints(point);
    };
};

const show_image = (img, btn, url, next) => {
    $("#player").removeAttr("style");
    $("#player")
        .css("background-color", "black")
        .css("background-image", `url(${img})`)
        .css("background-repeat", "no-repeat")
        .css("background-size", "auto 430px")
        .css("background-position", "center");
    $("#player").append(`<div class="ingame_button" data-next="${next}"><a${url != null ? ' href="' + url + '"' : ""}>${btn}</a></div>`);
};



$(function() {
    $("#episode").on("keypress", "#dev-load", function(e) {
        if(e.which == 13) {
            if ((window.location.href).includes("//127.0.0.")) {
                let num = $("#dev-load").val();
                if (num != "" && !isNaN(parseInt(num))) {
                    let existe = globalStory.filter(v => v.id == num);
                    existe.length == 1 ? drawScene(num) : alert("Esta escena no existe.");
                };
            };
        };
    });

    $("#player").on("click", ".choice", function() {
        let next = $(this).data("next");
        if (next == null) {
            // Finalizar episodio

            // Marcar lectura
            let story = $("#player").data("story");
            let episode = $("#player").data("episode");
            window.localStorage.setItem(`${story}&&&${episode}`, "played");
            $(`.play-episode[data-story="${story}"][data-episode="${episode}"]`).parent().addClass("played");

            // Limpiar todo 
            $("#player").removeAttr("style").removeAttr("data-map").removeAttr("data-story").removeAttr("data-episode");
            $(".obj-list ul li").remove();
            showEpisode(false);
            // markEpisode

        } else if (next == "auto") {
            // Era objetivo opcional, seguir explorando
            let location = parseInt($("#player").attr("data-map"));
            drawMapPoints(location);
        } else {
            drawScene(parseInt(next));
        };
    });

    $("#player").on("click", ".changeLocation", function() {
        let point = parseInt($(this).data("location"));
        checkNextPoint(point);
    });

    $("#episode-name").on("click", ".back-button", function() {
        // Limpiar todo 
        $("#player").html("").removeAttr("style").removeAttr("data-map").removeAttr("data-story").removeAttr("data-episode");
        $(".obj-list ul li").remove();
        showEpisode(false);
    });

    $("#player").on("click", ".ingame_button", function() {
        let next = parseInt($(this).attr("data-next"));
        $("#player").removeAttr("style");
        drawScene(next);
    });
});