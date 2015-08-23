$.game = playground({
	width: 900,
	height: 600,
	scale: 1,
	smoothing: false
});

$.game.create = function() {
	this.tick = 0;
	this.clearColor = 'hsl(0, 0%, 5%)';

	this.viewportRect = {
		x: 0,
		y: 0,
		w: this.width,
		h: this.height
	};

	this.loadImages(
		'cloud1.png',
		'cloud2.png',
		'overlay1.jpg',
		'overlay2.jpg',
		'overlay3.jpg',
		'overlay4.jpg',
		'overlay5.jpg',
		'overlay6.jpg'
	);

	/*this.loadSounds(
		''
	);

	$.storage = new $.storage( 'game-name' );

	if( $.isObjEmpty( $.storage.obj ) ) {
		$.storage.set( 'mute', 0 );
	}

	if( $.storage.get( 'mute' ) ) {
		this.sound.setMaster( 0 );
		this.music.setMaster( 0 );
	} else {
		this.sound.setMaster( 1 );
		this.music.setMaster( 0.5 );
	}
	*/

	$.ctx = this.layer;
};

$.game.ready = function() {
	//this.music.play( 'music', true );
	this.setState( $.statePlay );
};

$.game.step = function( dt ) {
	this.tick++;
};

$.game.renderCursor = function() {
	/*var scale = 1 + Math.sin( this.tick * 0.1 ) * 0.25;
	$.ctx.save();
	$.ctx.translate( this.mouse.x, this.mouse.y );
	$.ctx.scale( scale, scale );
	$.ctx.rotate( this.tick * 0.05 );
	$.ctx.lineWidth( 1 );
	$.ctx.strokeStyle( '#fff');
	$.ctx.strokeRect( -8, -8, 16, 16 );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillCircle( 0, 0, 1 );
	$.ctx.restore();*/
};

$.game.mousedown = function( e ) {
	/*var sound = this.playSound( 'click1' );
	this.sound.setVolume( sound, 2 );
	var sound = this.playSound( 'click1' );
	this.sound.setVolume( sound, 2 );
	var sound = this.playSound( 'click1' );
	this.sound.setVolume( sound, 2 );*/
};

$.game.keydown = function( e ) {
	/*if( e.key == 'm' ) {
		var muted = $.storage.get( 'mute' );
		if( muted ) {
			$.storage.set( 'mute', 0 );
			this.sound.setMaster( 1 );
			this.music.setMaster( 0.5 );
		} else {
			$.storage.set( 'mute', 1 );
			this.sound.setMaster( 0 );
			this.music.setMaster( 0 );
		}
	}*/
};