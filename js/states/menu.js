$.stateMenu = {};

$.stateMenu.create = function() {
	this.tick = 0;

	this.blobs = new $.group();

	this.menuText = {
		y: $.game.height / 2 - 100,
		alpha: 0
	};

	this.menuBlobs = {
		scale: 0
	};

	var count = 30,
		radius = 210,
		spread = 120;

	// main shape 1
	this.blobs.push( new $.blob({
		x: $.game.width / 2,
		y: $.game.height / 2,
		count: count,
		radius: radius,
		spread: 40,
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
		spread: 40,
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
		spread: 40,
		division: $.rand( 25, 50 ),
		hue: 150,
		saturation: 0,
		lightness: 5,
		alpha: 1,
		blend: 'lighter'
	}));
};

$.stateMenu.enter = function() {
}

$.stateMenu.leave = function() {
	this.blobs.each( 'destroy' );
	this.blobs.empty();
	this.blobs = null;
};

$.stateMenu.step = function() {
	if( this.tick === 50 ) {
		$.game.tween( this.menuText ).to( { y: $.game.height / 2 - 5, alpha: 1 }, 1.5, 'outElastic' );
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
	$.ctx.fillText( 'BLOB', $.game.width / 2 - 81, this.menuText.y );

	$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + this.menuText.alpha + ')' );
	$.ctx.fillText( 'LIVION', $.game.width / 2 + 69, $.game.height - 10 - this.menuText.y );





	$.ctx.font( '16px uni0553wf' );
	$.ctx.textBaseline( 'middle' );
	$.ctx.textAlign( 'center' );

	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 1)' );
	$.ctx.fillText( 'BUILT FOR LUDUM DARE 33', $.game.width / 2 + 69, $.game.height - 10 - this.menuText.y );
	$.ctx.fillText( 'YOU ARE THE MONSTER', $.game.width / 2 + 69, $.game.height - 10 - this.menuText.y );
	$.ctx.fillText( 'MADE BY JACK RUGILE', $.game.width / 2 + 69, $.game.height - 10 - this.menuText.y );

	$.game.renderCursor();
	$.game.renderOverlay();
};

$.stateMenu.mousedown = function( e ) {
	if( e.button == 'left' ) {
	} else if( e.button == 'right' ) {
	}
};

$.stateMenu.keydown = function( e ) {
	if( e.key == 'escape' ) {
	}
};