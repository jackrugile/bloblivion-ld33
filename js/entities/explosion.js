$.explosion = function( opt ) {};

$.explosion.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.createBlobs();
	this.life = 1;
	this.alpha = 1;
	this.scale = 1;
	this.tick = 0;
};

$.explosion.prototype.step = function() {
	this.blobs.each( 'step' );

	this.life *= 0.85;
	//this.alpha = 0.75 + this.life * 1;
	this.scale = this.life * 30;

	this.tick++;

	if( this.life <= 0.01 ) {
		this.blobs.each( 'destroy' );
		this.blobs.empty();
		this.blobs = null;
		$.game.state.explosions.release( this );
	}
};

$.explosion.prototype.render = function() {
	$.ctx.save()
	$.ctx.translate( this.x, this.y );
	$.ctx.scale( Math.min( this.scale, 1 ), Math.min( this.scale, 1 ) );
	$.ctx.a( this.alpha );
	this.blobs.each( 'render', true );
	$.ctx.ra();
	$.ctx.restore();

	if( this.tick < 10 ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + $.rand( 0.02, 0.1 ) + ')' );
		$.ctx.fillRect( 0, 0, $.game.width, $.game.height );
	}
};

$.explosion.prototype.createBlobs = function() {
	this.blobs = new $.group();

	var radius1 = this.radius,
		radius2 = this.radius * 0.8,
		radius3 = this.radius * 0.6;

	// main shape 1
	var radius1 = this.radius;
	this.blobs.push( new $.blob({
		x: 0,
		y: 0,
		count: radius1,
		radius: radius1,
		spread: radius1 * 0.75,
		division: $.rand( 5, 10 ),
		hue: this.hue,
		saturation: 70,
		lightness: 50,
		alpha: 0.6,
		blend: 'lighter'
	}));

	// main shape 2
	this.blobs.push( new $.blob({
		x: 0,
		y: 0,
		count: radius2,
		radius: radius2,
		spread: radius2 * 0.75,
		division: $.rand( 5, 10 ),
		hue: this.hue,
		saturation: 70,
		lightness: 70,
		alpha: 0.6,
		blend: 'lighter'
	}));

	// main shape 3
	this.blobs.push( new $.blob({
		x: 0,
		y: 0,
		count: radius3,
		radius: radius3,
		spread: radius3 * 0.75,
		division: $.rand( 5, 10 ),
		hue: this.hue,
		saturation: 70,
		lightness: 90,
		alpha: 0.6,
		blend: 'lighter'
	}));
};