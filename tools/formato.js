let lastSceneType = null;

$(document).ready(function() {
    resetAll();
});

const resetAll = () => {
    $("input").val("");
    $(".self-text").val("(Continuar)");
    $("textarea").val("");
    
    $('select').prop('selectedIndex', 0);
    toggleDialog();
    lastSceneType = null;
};

const toggleDialog = () => {
    let tipo = $("#select-form option:selected").val();

    if (tipo == "npc_dialog") {
        $("#npc_dialog").show();
        $("#add-dialog").show();
        $("#story_general").hide();
    } else {
        $("#npc_dialog").hide();
        $("#add-dialog").hide();
        $("#story_general").show();
    };
};

const addScene = () => {
    const type = $("#select-form option:selected").val();
    let sceneText = "";
    let currentSceneType = "";

    if (type == "npc_dialog") {
        let pj = $(".pj-name").length;

        for (i = 0; i < pj; i++) {
            let name = $(".pj-name").eq(i).val();
            let text = $(".pj-text").eq(i).val();
            if (name != "" || text != "") {
                sceneText += `${name}: ${text}\n`;
            };
        };

    } else if (type == "story_general" || type == "info_general") {
        currentSceneType = type;
        let story = $("#story").val();
        if (story != "") {
            if (type == "story_general") {
                sceneText += `[${story}]\n`;
            } else if(type == "info_general") {
                sceneText += `/ ${story}\n`;
            };
        };
    };

    let self = $(".self-name").length;
    for (i = 0; i < self; i++) {
        let name = $(".self-name").eq(i).val();
        let text = $(".self-text").eq(i).val() || "(Continuar)";
        sceneText += `${name}> ${text}\n`;
    };

    if (type == "npc_dialog" && $(".pj-name").eq(0).val() == "" && $(".pj-text").eq(0).val() == "") currentSceneType = "monolog";

    // Actualizar preview
    let preview = $("#preview").val();

    if ((lastSceneType == "monolog" && currentSceneType == "monolog") || lastSceneType == null) {
        $("#preview").val(`${preview}${sceneText}`);
    } else {
        $("#preview").val(`${preview}\n${sceneText}`);
    };

    // reasignar last scene type
    lastSceneType = currentSceneType;

    // scrollear textarea
    var $textarea = $('#preview');
    $textarea.scrollTop($textarea[0].scrollHeight);
};

const addInfo = () => {
    const type = $("#other-types option:selected").val();
    const info = $("#other-input").val();
    let sceneText = "";

    if (info != "") {
        const preview = $("#preview").val();

        if (type == "background") {
            sceneText += `(* ${info} *)\n`;

        } else if (type == "objectives") {
            sceneText += `* Objetivo: ${info}\n`;

        } else if (type == "notes") {
            sceneText += `// Notas: ${info}\n`;
        };

        if (lastSceneType == null) {
            $("#preview").val(`${preview}${sceneText}`);
        } else {
            $("#preview").val(`${preview}\n${sceneText}`);
        };

        // scrollear textarea
        var $textarea = $('#preview');
        $textarea.scrollTop($textarea[0].scrollHeight);

        // Reasignar
        lastSceneType = type;
    };

};

$(function() {
    $("#select-form").change(function() {
        toggleDialog();
    });

    $("#add-dialog").click(function() {
        if ($(".pj-name").length == 1 ) {
            $("#npc_dialog").append('<div id="dialog-added"><input class="pj-name" type="text" placeholder="Personaje"> : <input class="pj-text" type="text" placeholder="Texto"></div>');
            $("#add-dialog").text("-").attr("title", "Quitar diálogo");
        } else {
            $("#add-dialog").text("+").attr("title", "Añadir diálogo");
            $("#dialog-added").remove();
        };
        
    });

    $("#add-choice").click(function() {
        let name = $(".self-name").eq(0).val();
        $("#choices").append(`<div class="added-choice"><input class="self-name" type="text" placeholder="Personaje" value=${name}> &gt; <input class="self-text" type="text" placeholder="Texto" value="(Continuar)"><button class="remove-choice" type="button" title="Quitar opción">-</button></div>`);
    });

    $("#choices").on("click", ".remove-choice", function() {
        $(this).parent().remove();
    });

    $("#choices").on("input", ".self-name", function() {
        let name = $(this).val();
        $(".self-name").not(this).val(name);
    });

    $("#form-texto").submit(function(e) {
        e.preventDefault();
        addScene();
    });
    $("#form-others").submit(function(e) {
        e.preventDefault();
        addInfo();
    });

    $("#reset-all").click(function() {
        resetAll();
    });

});