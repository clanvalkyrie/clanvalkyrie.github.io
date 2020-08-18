$(document).ready(function(){
    $(document).scrollTop(115);

    $(document).scroll(function(){
        //$(document).scrollTop(115);

        var scrolled = $(document).scrollTop();
        if (scrolled < 115) {
        	$(document).scrollTop(115);
        }
         
    });     

});



/* if (closeDialog == true) {
	// almacenar nextStory en temporal.
}

if (place == "auto") {
	// Mantiene lugar por deplazamiento por movimientos.
}

if (setObjetive) {
	// Objetivo completo. Se repite el id para tacharlo de la lista.
}

if (nextStory == []){
	// Finaliza episodio.
}