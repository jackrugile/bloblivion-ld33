$.stateTutorial = {};

$.stateTutorial.create = function() {
};

$.stateTutorial.enter = function() {
	this.tick = 0;

	this.jet = new $.jet();
	this.jet.init({
		x: $.game.width / 2,
		y: $.game.height / 2,
		vx: 0,
		vy: 0,
		sinOffset: 0,
		sinFreqDiv: 0,
		sinAmp: 0,
		stationary: true
	});
}

$.stateTutorial.leave = function() {
};

$.stateTutorial.step = function() {
	this.jet.step();
	if( this.tick > 500 ) {
		$.game.setState( $.statePlay );
	}
	this.tick++;
};

$.stateTutorial.render = function() {
	$.ctx.clear( $.game.clearColor );

	$.ctx.font( '32px uni0553wf' );
	$.ctx.textBaseline( 'middle' );
	$.ctx.textAlign( 'center' );

	$.ctx.fillStyle( 'hsla(120, 80%, 65%, 1)' );
	$.ctx.fillText( 'SHOOT THE ENEMIES BEFORE', $.game.width / 2, $.game.height / 2 - 143 );

	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 1)' );
	$.ctx.fillText( 'THEY GET TO THE OTHER SIDE', $.game.width / 2, $.game.height / 2 - 108 );

	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 0.5)' );
	$.ctx.fillText( 'WASD/ARROWS TO MOVE', $.game.width / 2, $.game.height - 193 );

	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 0.5)' );
	$.ctx.fillText( 'CLICK TO SHOOT', $.game.width / 2, $.game.height - 158 );

	$.ctx.font( '16px uni0553wf' );
	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 0.5)' );
	$.ctx.fillText( 'TIP: BUILD UP YOUR SCORE MULTIPLIER BY SHOOTING ACCURATELY', $.game.width / 2, $.game.height - 40 );

	this.jet.render();

	$.game.renderCursor();
	$.game.renderOverlay();
};

$.stateTutorial.mousedown = function( e ) {
	if( e.button == 'left' ) {
		$.game.setState( $.statePlay );
	}
};

$.stateTutorial.keydown = function( e ) {
	if(
		$.game.keyboard.keys.w || $.game.keyboard.keys.up ||
		$.game.keyboard.keys.a || $.game.keyboard.keys.left ||
		$.game.keyboard.keys.s || $.game.keyboard.keys.down ||
		$.game.keyboard.keys.d || $.game.keyboard.keys.right
	) {
		$.game.setState( $.statePlay );
	}

};