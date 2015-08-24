$.stateMenu = {};

$.stateMenu.create = function() {
};

$.stateMenu.enter = function() {
	this.tick = 0;

	this.blobs = new $.group();

	this.menuText = {
		xOffset: 100,
		alpha: 0
	};

	this.menuBlobs = {
		scale: 0
	};

	var count = 30,
		radius = 110,
		spread = 40;

	// main shape 1
	this.blobs.push( new $.blob({
		x: $.game.width / 2,
		y: $.game.height / 2,
		count: count,
		radius: radius,
		spread: spread,
		division: $.rand( 25, 50 ),
		hue: 90,
		saturation: 0,
		lightness: 5,
		alpha: 1,
		blend: 'lighter'
	}));

	// main shape 2
	this.blobs.push( new $.blob({
		x: $.game.width / 2,
		y: $.game.height / 2,
		count: count,
		radius: radius,
		spread: spread,
		division: $.rand( 25, 50 ),
		hue: 120,
		saturation: 0,
		lightness: 5,
		alpha: 1,
		blend: 'lighter'
	}));

	// main shape 3
	this.blobs.push( new $.blob({
		x: $.game.width / 2,
		y: $.game.height / 2,
		count: count,
		radius: radius,
		spread: spread,
		division: $.rand( 25, 50 ),
		hue: 150,
		saturation: 0,
		lightness: 5,
		alpha: 1,
		blend: 'lighter'
	}));
}

$.stateMenu.leave = function() {
	this.blobs.each( 'destroy' );
	this.blobs.empty();
	this.blobs = null;
};

$.stateMenu.step = function() {
	if( this.tick === 25 ) {
		$.game.tween( this.menuText ).to( { xOffset: 0, alpha: 1 }, 1.5, 'inOutExpo' );
		$.game.tween( this.menuBlobs ).to( { scale: 1 }, 1.5, 'outElastic' );
	}

	this.blobs.each( 'step' );

	this.tick++;
};

$.stateMenu.render = function() {
	$.ctx.clear( $.game.clearColor );

	$.ctx.save();
	$.ctx.translate( $.game.width / 2, $.game.height / 2 );
	$.ctx.scale( this.menuBlobs.scale, this.menuBlobs.scale );
	$.ctx.translate( -$.game.width / 2, -$.game.height / 2 );
	this.blobs.each( 'render', true );
	$.ctx.restore();

	$.ctx.font( '48px uni0553wf' );
	$.ctx.textBaseline( 'middle' );
	$.ctx.textAlign( 'center' );
	
	//$.ctx.fillStyle( 'hsla(200, 80%, 65%, 1)' );
	//$.ctx.fillText( 'BLOBLIVION', $.game.width / 2, $.game.height / 2 - 5 );

	$.ctx.fillStyle( 'hsla(120, 80%, 65%, ' + this.menuText.alpha + ')' );
	$.ctx.fillText( 'BLOB', $.game.width / 2 - 81 - this.menuText.xOffset, $.game.height / 2 - 20 );

	$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + this.menuText.alpha + ')' );
	$.ctx.fillText( 'LIVION', $.game.width / 2 + 69 + this.menuText.xOffset, $.game.height / 2 - 20 );


	$.ctx.font( '16px uni0553wf' );
	$.ctx.textAlign( 'center' );
	$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + this.menuText.alpha * 0.75 + ')' );
	$.ctx.fillText( 'WASD/ARROWS TO START', $.game.width / 2, $.game.height / 2 + 35 + this.menuText.xOffset );


	$.ctx.font( '16px uni0553wf' );
	$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + this.menuText.alpha * 0.15 + ')' );
	$.ctx.fillText( 'BUILT FOR LUDUM DARE 33', $.game.width / 2, $.game.height - 80 );
	$.ctx.fillText( 'YOU ARE THE MONSTER', $.game.width / 2, $.game.height - 60 );
	$.ctx.fillText( 'MADE BY JACK RUGILE', $.game.width / 2, $.game.height - 40 );

	$.game.renderCursor();
	$.game.renderOverlay();
};

$.stateMenu.mousedown = function( e ) {
	if( e.button == 'left' ) {
		//$.game.setState( $.statePlay );
	} else if( e.button == 'right' ) {
	}
};

$.stateMenu.keydown = function( e ) {
	if(
		$.game.keyboard.keys.w || $.game.keyboard.keys.up ||
		$.game.keyboard.keys.a || $.game.keyboard.keys.left ||
		$.game.keyboard.keys.s || $.game.keyboard.keys.down ||
		$.game.keyboard.keys.d || $.game.keyboard.keys.right
	) {
		$.game.setState( $.statePlay );
	}

};