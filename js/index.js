const showLi = () => {
    var showMenu = window.setInterval(function() {
        if ($("li.hidden").length > 0) {
            $("li.hidden").eq(0).removeClass("hidden");
        } else {
            clearInterval(showMenu);
        };
        
    }, 200);
}

$(function() {
    $(".logo-container").on("mouseenter", "img", function() {
        showLi();

    }).on("mouseleave", "img", function() {
        // Nada
    });
});