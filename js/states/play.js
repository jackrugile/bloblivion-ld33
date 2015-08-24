$.statePlay = {};

$.statePlay.create = function() {
};

$.statePlay.enter = function() {
	var sound = $.game.playSound( 'gamestart1' );
	$.game.sound.setVolume( sound, 0.15 );

	this.particles = new $.pool( $.particle, 200 );
	this.puffs = new $.pool( $.puff, 50 );
	this.explosions = new $.pool( $.explosion, 50 );
	this.projectiles = new $.pool( $.projectile, 50 );
	this.clouds = new $.pool( $.cloud, 20 );
	this.jets = new $.pool( $.jet, 50 );
	this.mountainRanges = new $.group();
	this.stars = new $.group();
	this.moon = new $.moon();
	this.hero = new $.hero();

	this.createStars();
	this.createClouds();
	this.createMountainRanges();

	this.cloudSpawner = {
		current: 0,
		target: 100,
		min: 50,
		max: 150
	};

	this.jetSpawner = {
		current: 0,
		target: 100
	};

	this.diffTracker = {
		level: 1,
		current: 0,
		target: 500
	};

	this.speed = 20;
	this.shake = {
		translate: 0,
		rotate: 0
	};

	this.lives = 3;
	this.killed = 0;
	this.dead = false;
	this.paused = false;

	this.scoreTick = 0;
	this.scoreTickMax = 50;

	this.gameoverTick = 0;
	this.gameoverTickMax = 120;

	this.tick = 0;
}

$.statePlay.leave = function() {
	this.particles.empty();
	this.puffs.empty();
	this.explosions.empty();
	this.projectiles.empty();
	this.clouds.empty();
	this.jets.empty();
	this.mountainRanges.empty();
	this.stars.empty();

	this.hero.blobs.each( 'destroy' );
	this.hero.blobs.empty();
	this.hero.blobs = null;

	this.particles = null;
	this.puffs = null;
	this.explosions = null;
	this.projectiles = null;
	this.clouds = null;
	this.jets = null;
	this.mountainRanges = null;
	this.stars = null;
	this.moon = null;
	this.hero = null;
};

$.statePlay.step = function( dt ) {
	if( this.paused ) { return; }

	this.handleScreenShake();

	this.updateDifficulty();
	this.generateClouds();
	this.generateJets();

	this.updateUI();

	this.mountainRanges.each( 'step' );
	this.moon.step();
	this.stars.each( 'step' );
	this.clouds.each( 'step' );
	this.jets.each( 'step' );
	this.explosions.each( 'step' );
	this.puffs.each( 'step' );
	this.particles.each( 'step' );
	this.projectiles.each( 'step' );
	this.hero.step();

	if( this.lives <= 0 ) {
		this.gameover();
	}

	this.tick++;
};

$.statePlay.render = function( dt ) {
	$.ctx.clear( $.game.clearColor );

	$.ctx.save();
	if( !this.paused && ( this.shake.translate || this.shake.rotate ) ) {
		$.ctx.translate( $.game.width / 2 + $.rand( -this.shake.translate, this.shake.translate ), $.game.height / 2 + $.rand( -this.shake.translate, this.shake.translate ) );
		$.ctx.rotate( $.rand( -this.shake.rotate, this.shake.rotate ) );
		$.ctx.translate( -$.game.width / 2 + $.rand( -this.shake.translate, this.shake.translate ) , -$.game.height / 2 + $.rand( -this.shake.translate, this.shake.translate ));
	}
	this.moon.render();
	this.stars.each( 'render' );
	this.mountainRanges.each( 'render', true );
	this.clouds.each( 'render' );
	this.particles.each( 'render' );
	this.jets.each( 'render' );
	this.hero.render();
	this.projectiles.each( 'render' );
	this.explosions.each( 'render' );
	$.ctx.restore();

	this.renderUI();
	this.puffs.each( 'render' );
	$.game.renderCursor();
	$.game.renderOverlay();

	if( this.dead ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + this.gameoverTick / this.gameoverTickMax + ')' );
		$.ctx.fillRect( 0, 0, $.game.width, $.game.height );
	}
};

$.statePlay.mousedown = function( e ) {
	if( e.button == 'left' ) {
		this.shoot();
	} else if( e.button == 'right' ) {

	}
};

$.statePlay.keydown = function( e ) {
	if( e.key == 'p' ) {
		//this.paused = !this.paused;
		// too easy to cheat with this
	}
};

$.statePlay.shoot = function() {
	if( this.dead ) { return; }
	if( this.paused ) { return; }

	var sound = $.game.playSound( 'shoot' + $.randInt( 1, 3 ) );
	$.game.sound.setVolume( sound, 0.6 );
	$.game.sound.setPlaybackRate( sound, $.rand( 0.9, 1.1 ) );
	var blastAngle = Math.atan2( $.game.mouse.y - $.game.state.hero.y - $.game.state.hero.blobMouth.y, $.game.mouse.x - $.game.state.hero.x - $.game.state.hero.blobMouth.x );
	this.projectiles.create({
		x: this.hero.x,
		y: this.hero.y + 20,
		radius: 10,
		angle: blastAngle,
		speed: 5,
		hue: 200
	});
	this.puffs.create({
		x: $.game.mouse.x,
		y: $.game.mouse.y
	});
	for( var i = 0; i < 5; i++ ) {
		$.game.state.particles.create({
			x: $.game.state.hero.x + $.game.state.hero.blobMouth.x + $.rand( -$.game.state.hero.blobMouth.radius / 2, $.game.state.hero.blobMouth.radius / 2 ),
			y: $.game.state.hero.y + $.game.state.hero.blobMouth.y + $.rand( -$.game.state.hero.blobMouth.radius / 2, $.game.state.hero.blobMouth.radius / 2 ),
			vx: $.rand( -3, 3 ),
			vy: $.rand( -3, 3 ),
			radiusBase: $.rand( 4, 8 ),
			growth: $.rand( 0.5, 1 ),
			decay: $.rand( 0.015, 0.03 ),
			hue: $.rand(90, 150 ),
			grow: false
		});
	}
	$.game.state.hero.vx += Math.cos( blastAngle ) * -0.5;
	$.game.state.hero.vy += Math.sin( blastAngle ) * -0.5;
	this.hero.shootTimer = this.hero.shootTimerMax;
};

$.statePlay.createStars = function() {
	for( var i = 0, length = 30; i < length; i++ ) {
		this.stars.push( new $.star({
			x: $.rand( 0, $.game.width ),
			y: $.rand( 40, $.game.height ),
			scale: $.rand( 1, 2 )
		}));
	}
};

$.statePlay.createClouds = function() {
	for( var i = 0, length = 5; i < length; i++ ) {
		this.clouds.create({
			x: 100 + ( i / length ) * $.game.width,
			y: $.rand( 40, $.game.height * 0.55 ),
			speed: $.rand( 1, 3 )
		});
	}
};

$.statePlay.updateDifficulty = function() {
	if( this.dead ) { return; }

	if( this.diffTracker.current >= this.diffTracker.target ) {
		console.log( 'UP' );
		this.diffTracker.current = 0;
	} else {
		this.diffTracker.current++;
	}
}

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

$.statePlay.generateJets= function() {
	if( this.dead ) { return; }

	if( this.jetSpawner.current >= this.jetSpawner.target ) {
		this.jets.create({
			y: $.rand( 40 + 100, $.game.height - 100 ),
			vx: -5,
			vy: 0,
			offset: 0,
			division: 20
		});
		this.jetSpawner.current = 0;
	} else {
		this.jetSpawner.current++;
	}
};

$.statePlay.createMountainRanges = function() {
	for( var i = 1, length = 4; i < length; i++ ) {
		var j = length - i;
		this.mountainRanges.push( new $.mountainRange({
			i: i,
			j: j,
			center: $.game.height * 0.75 + i * 30,
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

$.statePlay.updateUI = function() {
	if( this.scoreTick > 0 ) {
		this.scoreTick--;
	}
};

$.statePlay.renderUI = function() {
	$.ctx.fillStyle( '#000' );
	$.ctx.fillRect( 0, 0, $.game.width, 41 );

	this.renderHeart({
		x: 30,
		y: 20,
		color: this.lives >= 1 ? 'hsla(120, 80%, 65%, 1)' : '#222'
	});

	this.renderHeart({
		x: 55,
		y: 20,
		color: this.lives >= 2 ? 'hsla(120, 80%, 65%, 1)' : '#222'
	});

	this.renderHeart({
		x: 80,
		y: 20,
		color: this.lives >= 3 ? 'hsla(120, 80%, 65%, 1)' : '#222'
	});

	//$.ctx.font( '16px uni0553wf' ); // 10px tall
	$.ctx.font( '24px uni0553wf' ); // 15px tall
	//$.ctx.font( '32px uni0553wf' ); // 20px tall
	$.ctx.textBaseline( 'top' );
	$.ctx.textAlign( 'left' );
	if( this.scoreTick > 0 ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + ( 0.4 + ( this.scoreTick / this.scoreTickMax ) * 0.6 ) + ')' );
	} else {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, 0.4)' );
	}
	$.ctx.fillText( '' + $.pad( this.killed, 3 ), 110, 0 );

	$.ctx.textAlign( 'right' );
	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 0.4)' );
	$.ctx.fillText( 'HI ' + $.pad( 333, 3 ), $.game.width - 20, 1 );

};

$.statePlay.renderHeart = function( opt ) {
	this.points = [
		{
			x: -10,
			y: 0
		},
		{
			x: -10,
			y: -5
		},
		{
			x: -5,
			y: -10
		},
		{
			x: 0,
			y: -5
		},
		{
			x: 5,
			y: -10
		},
		{
			x: 10,
			y: -5
		},
		{
			x: 10,
			y: 0
		},
		{
			x: 0,
			y: 10
		}
	];

	$.ctx.save();
	$.ctx.translate( opt.x, opt.y );
	$.polygon( this.points );
	$.ctx.fillStyle( opt.color );
	$.ctx.fill();
	$.ctx.restore();
};


$.statePlay.gameover = function() {
	this.speed *= 0.99;

	if( this.gameoverTick == 0 ) {
		sound = $.game.playSound( 'gameover1' );
		$.game.sound.setVolume( sound, 0.1 );

		this.dead = true;
		$.game.state.explosions.create({
			x: this.hero.x,
			y: this.hero.y,
			radius: 90,
			hue: 120
		});

		for( var i = 0; i < 60; i++ ) {
			$.game.state.particles.create({
				x: this.hero.x + $.rand( -this.hero.radius / 2, this.hero.radius / 2 ),
				y: this.hero.y + $.rand( -this.hero.radius / 2, this.hero.radius / 2 ),
				vx: $.rand( -10, 10 ),
				vy: $.rand( -10, 10 ),
				radiusBase: $.rand( 12, 32 ),
				growth: $.rand( 0.5, 1 ),
				decay: $.rand( 0.01, 0.01 ),
				hue: 120,
				grow: true
			});
		}
	}

	if( this.gameoverTick > this.gameoverTickMax ) {
		$.game.setState( $.stateMenu );
	} else {
		this.gameoverTick++;
	}
};