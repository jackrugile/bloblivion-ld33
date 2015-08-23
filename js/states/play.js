$.statePlay = {};

$.statePlay.create = function() {
};

$.statePlay.enter = function() {
	this.particles = new $.pool( $.particle, 300 );
	this.clouds = new $.pool( $.cloud, 20 );
	this.mountainRanges = new $.group();
	this.hero = new $.hero();


	this.createClouds();
	this.createMountainRanges();

	this.cloudSpawner = {
		current: 0,
		target: 100,
		min: 50,
		max: 150
	}

	this.overlayTimer = {
		current: 0,
		target: 1,
		index: 0,
		max: 5
	};

	this.speed = 20;
	this.shake = {
		translate: 0,
		rotate: 0
	};

	this.tick = 0;
}

$.statePlay.exit = function() {
};

$.statePlay.step = function( dt ) {
	this.handleScreenShake();

	this.generateClouds();

	this.mountainRanges.each( 'step' );
	this.clouds.each( 'step' );
	this.hero.step();

	this.tick++;
};

$.statePlay.render = function( dt ) {
	$.ctx.clear( $.game.clearColor );

	$.ctx.save();
	if( this.shake.translate || this.shake.rotate ) {
		$.ctx.translate( $.game.width / 2 + $.rand( -this.shake.translate, this.shake.translate ), $.game.height / 2 + $.rand( -this.shake.translate, this.shake.translate ) );
		$.ctx.rotate( $.rand( -this.shake.rotate, this.shake.rotate ) );
		$.ctx.translate( -$.game.width / 2 + $.rand( -this.shake.translate, this.shake.translate ) , -$.game.height / 2 + $.rand( -this.shake.translate, this.shake.translate ));
	}
	this.mountainRanges.each( 'render', true );
	this.clouds.each( 'render' );
	this.hero.render();
	$.ctx.restore();

	this.renderOverlay();
};

$.statePlay.mousedown = function( e ) {

	this.shake.translate += 2;
	this.shake.rotate += 0.008;

	if( e.button == 'left' ) {

	} else if( e.button == 'right' ) {

	}
};

$.statePlay.keydown = function( e ) {
	if( e.key == 'escape' ) {

	}
};

$.statePlay.createClouds = function() {
	for( var i = 0, length = 5; i < length; i++ ) {
		this.clouds.create({
			x: 100 + ( i / length ) * $.game.width,
			y: $.rand( 0, $.game.height * 0.55 ),
			speed: $.rand( 1, 3 )
		});
	}
};

$.statePlay.generateClouds = function() {
	if( this.cloudSpawner.current >= this.cloudSpawner.target ) {
		this.clouds.create({
			x: $.game.width,
			y: $.rand( 0, $.game.height * 0.55 ),
			speed: $.rand( 1, 3 )
		});
		this.cloudSpawner.target = $.randInt( this.cloudSpawner.min, this.cloudSpawner.max );
		this.cloudSpawner.current = 0;
	} else {
		this.cloudSpawner.current++;
	}
};

$.statePlay.createMountainRanges = function() {
	for( var i = 1, length = 4; i < length; i++ ) {
		var j = length - i;
		this.mountainRanges.push( new $.mountainRange({
			i: i,
			j: j,
			center: $.game.height * 0.75 + i * 25,
			variance: {
				h: {
					min: i * 20,
					max: i * 40
				},
				v: {
					min: -i * 12,
					max: i * 12
				}
			},
			speed: i / 3,
			color: 'hsla(0, 0%, ' + ( ( 0.2 - ( i / length ) * 0.15 ) * 100 ) + '%, 1)',
			opacity: 1,
			sinDiv: 1,
			sinAmp: 0
		}));
	}
};

$.statePlay.handleScreenShake = function() {
	if( this.shake.translate > 0 ) {
		this.shake.translate *= 0.92;
	}

	if( this.shake.rotate > 0 ) {
		this.shake.rotate *= 0.92;
	}
};


$.statePlay.renderOverlay = function() {
	if( this.overlayTimer.current >= this.overlayTimer.target ) {
		if( this.overlayTimer.index === this.overlayTimer.max ) {
			this.overlayTimer.index = 0;
		} else {
			this.overlayTimer.index++;
		}
		this.overlayTimer.current = 0;
	} else {
		this.overlayTimer.current++;
	}

	$.ctx.a( 0.1 );
	$.ctx.drawImage( $.game.images[ 'overlay' + ( this.overlayTimer.index + 1 ) ], 0, 0 );
	$.ctx.ra();
};