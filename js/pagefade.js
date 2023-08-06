$(document).ready(function(){
    var navH = $('nav').height();
    var barH = $('bar').outerHeight();
    if (navH > barH) {
        $('.cont').css({marginTop: barH});
    }
    else {$('.cont').css({paddingTop: barH});}
    $('.i').click(function() {$('body, html').animate({scrollTop:0},1000);});   
    var top = $('bar').offset();
    $(document).scroll(function(){
        var scrolled = $(document).scrollTop();
        if (scrolled < top.top) {$('body').removeClass('stick');}
        else {$('body').addClass('stick');}
    });

    $('body').addClass('stick');
});