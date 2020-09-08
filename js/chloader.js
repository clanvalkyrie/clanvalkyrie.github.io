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
        var li = document.createElement("li");
        li.setAttribute("class","episode");
        li.innerHTML = "<div class=\"episode-title\"><b>" + chList[c].title + "</b></div><div class=\"episode-description\"><p>" + chList[c].description + "</p></div><div style=\"text-align: center;\"><div id=\"" + chList[c].episode + "\" class=\"button\">Jugar</div></div>";
        ul.appendChild(li);
    };
    document.getElementsByClassName("cont")[0].style.display = "flex";
};

$(function() { 

    $("#episode-list").each(function(){$(this).on("click", ".button", function() {
        dbCount == 5 ? dbCount = 3 : "";
        var checkpoint = $(this).attr("id");

        var chapterSelected = checkpoint[1] + checkpoint[3] + checkpoint[5];
        chapterSelected = parseInt(chapterSelected);

        document.getElementsByClassName("cont")[0].style.display = "none";
        document.getElementsByClassName("cont")[1].style.display = "flex";
        $(document).scrollTop(0)

        // Cargar el episodio.
        const requestStory = new XMLHttpRequest();requestStory.open("GET", chList[chapterSelected - 1].story);requestStory.responseType = "json";requestStory.send();
        requestStory.onload = function() {tempDB = requestStory.response;almacena(tempDB, "story");}

        // Objetivos del capítulo
        const requestObjectives = new XMLHttpRequest();requestObjectives.open("GET", chList[chapterSelected - 1].objective);requestObjectives.responseType = "json";requestObjectives.send();
        requestObjectives.onload = function() {tempDB = requestObjectives.response;almacena(tempDB, "objective");};

    })});

    $("#episode-back").click(function() { 
        document.getElementsByClassName("cont")[0].style.display = "flex";
        document.getElementsByClassName("cont")[1].style.display = "none";
        $(document).scrollTop(0);
        $("#episode-code").val($("code:first").text());
        
    });


    // CHECKPOINT

    $("#load-episode").click(function() {
        $(document).scrollTop(0);

        var loadCP = $("#episode-code").val();
        var indexCP;

        if (loadCP != "" && loadCP.length == 19) {
            // Buscar el episodio
            indexCP = parseInt(loadCP[1] + loadCP[3] + loadCP[5]);

            // Comprobar si el episodio existe
            if (indexCP <= chList.length) {

                // Cargar el episodio
                const requestStory = new XMLHttpRequest();requestStory.open("GET", chList[indexCP - 1].story);requestStory.responseType = "json";requestStory.send();
                requestStory.onload = function() {

                    tempDB = requestStory.response;
                    var chk = tempDB.filter(function(v) {return v.checkpoint == loadCP});

                    // Verificar si el checkpoint existe
                    if (chk.length == 1) {
                        storyDB = tempDB;

                        // Cargar los objetivos del capítulo
                        const requestObjectives = new XMLHttpRequest();requestObjectives.open("GET", chList[indexCP - 1].objective);requestObjectives.responseType = "json";requestObjectives.send();
                        requestObjectives.onload = function() {
                            objectiveDB = requestObjectives.response;

                            //Iniciar capítulo
                            cargarStory(chk[0].id);
                            document.getElementsByClassName("cont")[0].style.display = "none";
                            document.getElementsByClassName("cont")[1].style.display = "flex";
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
                            const requestObjectives = new XMLHttpRequest();requestObjectives.open("GET", chList[indexCP - 1].objective);requestObjectives.responseType = "json";requestObjectives.send();
                            requestObjectives.onload = function() {
                                objectiveDB = requestObjectives.response;

                                //Iniciar capítulo
                                cargarStory(chk[0].id);
                                document.getElementsByClassName("cont")[0].style.display = "none";
                                document.getElementsByClassName("cont")[1].style.display = "flex";

                            };

                        } else {
                            alert("El código ingresado no es válido.");
                        };

                    };

                };
            } else {
                alert("El episodio no está disponible.");
            };

        } else {
            loadCP == "" ? alert("Debe ingresar un código.") : alert("El código ingresado no es válido.");
        };

   });

});