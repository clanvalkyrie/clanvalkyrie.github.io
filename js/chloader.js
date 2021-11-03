var chList = [], currentCH;

$(document).ready(function(){
    // Cargar lista de episodios
    const requestCH = new XMLHttpRequest();requestCH.open("GET", $("#qwe").text());requestCH.responseType = "json";requestCH.send();
    requestCH.onload = function() {tempDB = requestCH.response;getList(tempDB);};
});

function getList(db) {
    chList = db;
    var ul = document.getElementById("episode-list");
    for (c = 0; c < chList.length; c++) {
        if (chList[c].visible == true) {
            var li = document.createElement("li");
            li.setAttribute("class","episode");
            var html = "<div class=\"episode-title\"><b>" + chList[c].title + "</b></div><div class=\"episode-description\"><p>" + chList[c].description + "</p></div><div style=\"text-align: center;\">";
            /*if (c == 0)*/ html += "<div id=\"" + chList[c].current + "\" class=\"button\">Jugar</div>";
            html += "</div>";
            li.innerHTML = html;
            ul.appendChild(li);
        };
    };
    $(".cont").eq(0).css("display","flex");
};

function cargarCheckpoint(loadCP){

    if (loadCP != "" && loadCP.length == 19) {
        // Buscar el episodio
        currentCH = parseInt(loadCP[1] + loadCP[3] + loadCP[5]);

        // Comprobar si el episodio existe
        currentCH = chList.filter(function(v) {return v.episode == currentCH});
        if (currentCH.length == 1) {

            // Cargar el episodio
            const requestStory = new XMLHttpRequest();requestStory.open("GET", currentCH[0].story);requestStory.responseType = "json";requestStory.send();
            requestStory.onload = function() {

                tempDB = requestStory.response;
                var chk = tempDB.filter(function(v) {return v.checkpoint == loadCP});

                //Cargar ubicaciones
                const requestPlaces = new XMLHttpRequest();requestPlaces.open("GET", currentCH[0].places);requestPlaces.responseType = "json";requestPlaces.send();
                requestPlaces.onload = function() {

                    placeDB = requestPlaces.response;

                    // Verificar si el checkpoint existe
                    if (chk.length == 1) {
                        storyDB = tempDB;

                        // Cargar los objetivos del capítulo
                        const requestObjectives = new XMLHttpRequest();requestObjectives.open("GET", currentCH[0].objective);requestObjectives.responseType = "json";requestObjectives.send();
                        requestObjectives.onload = function() {
                            objectiveDB = requestObjectives.response;

                            //Iniciar capítulo
                            $("#ongoing-episode-title").text(currentCH[0].title);
                            cargarStory(chk[0].id);
                            $(".cont").eq(0).css("display","none");
                            $(".cont").eq(1).css("display","flex");
                        };
                    } else {
                        // Buscar checkpoint sin ubicación
                        var cptemp = loadCP.slice(0,-3);
                        chk = tempDB.filter(function(v) {return v.checkpoint == cptemp});

                        // Verificar si el checkpoint sin ubicacion existe
                        if (chk.length == 1) {
                            storyDB = tempDB;

                            // Obtiene y asigna ubicación
                            var placeIndex = loadCP.slice(-3);
                            currentPlace = placeDB.filter(function (v) {return v.id == placeIndex});

                            // Cargar los objetivos del capítulo
                            const requestObjectives = new XMLHttpRequest();requestObjectives.open("GET", currentCH[0].objective);requestObjectives.responseType = "json";requestObjectives.send();
                            requestObjectives.onload = function() {
                                objectiveDB = requestObjectives.response;

                                //Iniciar capítulo
                                cargarStory(chk[0].id);
                                $(".cont").eq(0).css("display","none");
                                $(".cont").eq(1).css("display","flex");
                            };

                        } else {
                            //alert("El código ingresado no es válido.");
                            $("#error-msg").text("El episodio no está disponible.");
                            $("#error-msg").show().delay(5000).fadeOut(300);
                        };
                    };
                };
            };

        } else {
            //alert("El episodio no está disponible.");
            $("#error-msg").text("El episodio no está disponible.");
            $("#error-msg").show().delay(5000).fadeOut(300);
        };

    } else {
        loadCP == "" ? $("#error-msg").text("Debe ingresar un código.") : $("#error-msg").text("El código ingresado no es válido.");
        $("#error-msg").show().delay(5000).fadeOut(300);
    };

}

$(function() { 

    $("#episode-list").each(function(){$(this).on("click", ".button", function() {
        dbCount == 5 ? dbCount = 2 : "";
        var checkpoint = $(this).attr("id");

        var episodio = checkpoint[1] + checkpoint[3] + checkpoint[5];
        episodio = parseInt(episodio);
        currentCH = chList.filter(function(v){return v.episode == episodio});

        $(".cont").eq(0).css("display","none");
        $(".cont").eq(1).css("display","flex");
        $(document).scrollTop(0)

        // Cargar el episodio.
        $("#ongoing-episode-title").text(currentCH[0].title);
        const requestStory = new XMLHttpRequest();requestStory.open("GET", currentCH[0].story);requestStory.responseType = "json";
        requestStory.send();requestStory.onload = function() {

            // Objetivos del capítulo
            const requestObjectives = new XMLHttpRequest();requestObjectives.open("GET", currentCH[0].objective);requestObjectives.responseType = "json";
            requestObjectives.send();requestObjectives.onload = function() {

                // Ubicaciones del capítulo
                const requestPlaces = new XMLHttpRequest();requestPlaces.open("GET", currentCH[0].places);requestPlaces.responseType = "json";
                requestPlaces.send();requestPlaces.onload = function() {

                    storyDB = requestStory.response;
                    objectiveDB = requestObjectives.response;
                    placeDB = requestPlaces.response;    

                    iniciarCapitulo();
                };
            };    
        };

    })});

    $("#episode-back").click(function() {
        $(".cont").eq(0).css("display","flex");
        $(".cont").eq(1).css("display","none");

        $(document).scrollTop(0);
        $("#episode-code").val($("code:first").text());
        
    });

    $("#close-popup").click(function() { 

        $("#popup-bg").fadeOut(400);
        $("body").css("overflow","auto");
    });

    // CHECKPOINT

    $("#load-episode").click(function() {
        $(document).scrollTop(0);
        var tempcp = $("#episode-code").val();
        
        if (tempcp[7] == "X") {
            document.getElementById("episode-container").style.display = "none";
            document.getElementById("char-container").style.display = "inline-block";
        } else {
            document.getElementById("episode-container").style.display = "flex";
            document.getElementById("char-container").style.display = "none";
        };

        cargarCheckpoint(tempcp);
   });

});