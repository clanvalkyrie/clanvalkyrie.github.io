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

dibujarFichas();