$.projectile = function( opt ) {
	this.collisionRectLarge = {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	};
	this.collisionRectSmall = {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	};

	this.trackerLeft = {
		x: 0,
		y: 0,
		ox: 0,
		oy: 0
	};

	this.trackerRight = {
		x: 0,
		y: 0,
		ox: 0,
		oy: 0
	};
};

$.projectile.prototype.init = function( opt ) {
	$.merge( this, opt );

	this.collisionRectLarge.x = 0;
	this.collisionRectLarge.y = 0;
	this.collisionRectLarge.w = this.radius * 2;
	this.collisionRectLarge.h = this.radius * 2;

	this.collisionRectSmall.x = 0;
	this.collisionRectSmall.y = 0;
	this.collisionRectSmall.w = this.radius * Math.sqrt( 2 );
	this.collisionRectSmall.h = this.radius * Math.sqrt( 2 );

	this.trackerLeft.x = this.x;
	this.trackerLeft.y = this.y;
	this.trackerRight.x = this.x;
	this.trackerRight.y = this.y;

	this.trackerLeft.ox = this.x;
	this.trackerLeft.oy = this.y;
	this.trackerRight.ox = this.x;
	this.trackerRight.oy = this.y;

	this.createBlobs();
};

$.projectile.prototype.step = function() {
	this.updateCollisionRects();

	this.trackerLeft.ox = this.trackerLeft.x;
	this.trackerLeft.oy = this.trackerLeft.y;
	this.trackerRight.ox = this.trackerRight.x;
	this.trackerRight.oy = this.trackerRight.y;

	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed;
	this.speed *= 1.1;

	this.trackerLeft.x = this.x + Math.cos( this.angle - Math.PI / 2 ) * this.radius;
	this.trackerLeft.y = this.y + Math.sin( this.angle - Math.PI / 2 ) * this.radius;
	this.trackerRight.x = this.x + Math.cos( this.angle + Math.PI / 2 ) * this.radius;
	this.trackerRight.y = this.y + Math.sin( this.angle + Math.PI / 2 ) * this.radius;

	this.blobs.each( 'step' );

	$.game.state.particles.create({
		x: this.x + $.rand( -this.radius / 2, this.radius / 2 ),
		y: this.y + $.rand( -this.radius / 2, this.radius / 2 ),
		vx: 0,
		vy: $.rand( 0, 1 ),
		radiusBase: $.rand( 4, 8 ),
		growth: $.rand( 0.5, 1 ),
		decay: $.rand( 0.03, 0.08 ),
		hue: this.hue,
		grow: false
	});

	if( !this.inView() ) {
		this.blobs.each( 'destroy' );
		this.blobs.empty();
		this.blobs = null;
		$.game.state.projectiles.release( this );
	}

	this.checkJetCollisions();
};

$.projectile.prototype.render = function() {
	$.ctx.save()
	$.ctx.translate( this.x, this.y );
	this.blobs.each( 'render', true );
	$.ctx.restore();


	/* trackers */
	/*$.ctx.fillStyle( 'hsla(120, 80%, 80%, ' + $.rand( 0.1, 1 ) + ')' );
	$.ctx.strokeStyle( 'hsla(120, 80%, 80%, ' + $.rand( 0.1, 1 ) + ')' );

	$.ctx.beginPath();
	$.ctx.moveTo( this.trackerLeft.ox, this.trackerLeft.oy );
	$.ctx.lineTo( this.trackerLeft.x, this.trackerLeft.y );
	$.ctx.lineWidth( 2 );
	$.ctx.stroke();

	$.ctx.beginPath();
	$.ctx.moveTo( this.trackerRight.ox, this.trackerRight.oy );
	$.ctx.lineTo( this.trackerRight.x, this.trackerRight.y );
	$.ctx.lineWidth( 2 );
	$.ctx.stroke();*/
};

$.projectile.prototype.updateCollisionRects = function() {
	this.collisionRectLarge.x = this.x - this.collisionRectLarge.w / 2;
	this.collisionRectLarge.y = this.y - this.collisionRectLarge.h / 2;
	this.collisionRectSmall.x = this.x - this.collisionRectSmall.w / 2;
	this.collisionRectSmall.y = this.y - this.collisionRectSmall.h / 2;
}

$.projectile.prototype.inView = function() {
	return $.colliding( $.game.viewportRect, this.collisionRectLarge );
};

$.projectile.prototype.createBlobs = function() {
	this.blobs = new $.group();

	// main shape 1
	this.blobs.push( new $.blob({
		x: 0,
		y: 0,
		count: this.radius,
		radius: this.radius,
		spread: this.radius / 2,
		division: $.rand( 5, 10 ),
		hue: this.hue,
		saturation: 70,
		lightness: 70,
		alpha: 0.6,
		blend: 'lighter'
	}));

	// main shape 2
	this.blobs.push( new $.blob({
		x: 0,
		y: 0,
		count: this.radius,
		radius: this.radius,
		spread: this.radius / 2,
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
		count: this.radius,
		radius: this.radius,
		spread: this.radius / 2,
		division: $.rand( 5, 10 ),
		hue: this.hue,
		saturation: 70,
		lightness: 70,
		alpha: 0.6,
		blend: 'lighter'
	}));
};

$.projectile.prototype.hitDestroy = function() {
	var sound = $.game.playSound( 'hit' + $.randInt( 1, 3 ) );
	$.game.sound.setVolume( sound, 0.4 );
	$.game.sound.setPlaybackRate( sound, $.rand( 0.9, 1.1 ) );
	if( this.blobs ) {
		this.blobs.each( 'destroy' );
		this.blobs.empty();
		this.blobs = null;
	}
	$.game.state.projectiles.release( this );

	$.game.state.shake.translate += 6;
	$.game.state.shake.rotate += 0.03;
}

$.projectile.prototype.checkJetCollisions = function() {
	var i = $.game.state.jets.alive.length,
		hasCollision = false;
	while( i-- ) {

		var jet = $.game.state.jets.alive[ i ];

		if( $.segmentToRectIntersect(
			{
				x: this.trackerLeft.x,
				y: this.trackerLeft.y
			},
			{
				x: this.trackerLeft.ox,
				y: this.trackerLeft.oy
			},
			jet.collisionRectLarge
		) ) { hasCollision = true; };

		if( $.segmentToRectIntersect(
			{
				x: this.trackerRight.x,
				y: this.trackerRight.y
			},
			{
				x: this.trackerRight.ox,
				y: this.trackerRight.oy
			},
			jet.collisionRectLarge
		) ) { hasCollision = true; };

		if( hasCollision ) {
			this.hitDestroy();
			jet.hitDestroy();
			return true;
		}
	}
}