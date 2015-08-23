$.hero = function( opt ) { 
	$.merge( this, opt );
	this.x = 100;
	this.y = 100;
	this.vx = 0;
	this.vy = 0;
	this.vmax = 2.4;
	this.accel = 0.75;
	this.drag = 0.9;
	this.radius = 40;
	this.radiusBase = this.radius;
	this.pupilMouseAngle = 0;
	this.collisionRectLarge = {
		x: 0,
		y: 0,
		w: this.radius * 2,
		h: this.radius * 2
	};
	this.collisionRectSmall = {
		x: 0,
		y: 0,
		w: this.radius * Math.sqrt( 2 ),
		h: this.radius * Math.sqrt( 2 )
	};

	this.createBlobBody();
};

$.hero.prototype.step = function() {
	this.updateCollisionRects();
	this.handleMovement();
	this.updateCollisionRects();
	this.updatePupil();

	this.blobs.each( 'step' );

	/*if( $.game.state.tick % 2 == 0 ) {
		$.game.state.particles.create({
			x: this.x + $.rand( -this.radius, this.radius ),
			y: this.y + $.rand( -this.radius, this.radius ),
			vx: -this.vx * 0.2 + $.rand( -0.5, 0.5 ),
			vy: -this.vy * 0.2 + $.rand( -0.5, 0.5 ),
			decay: 0.02,
			hue: $.game.state.level.hue,
			desaturated: false
		});
	}*/
};

$.hero.prototype.render = function() {
	$.ctx.save()
	$.ctx.translate( this.x, this.y );
	//$.ctx.fillStyle( 'limegreen' );
	//$.ctx.fillCircle( 0, 0, Math.max( 0, this.radius ) );
	this.blobs.each( 'render', true );
	$.ctx.restore();
};

$.hero.prototype.updateCollisionRects = function() {
	this.collisionRectLarge.x = this.x - this.collisionRectLarge.w / 2;
	this.collisionRectLarge.y = this.y - this.collisionRectLarge.h / 2;
	this.collisionRectSmall.x = this.x - this.collisionRectSmall.w / 2;
	this.collisionRectSmall.y = this.y - this.collisionRectSmall.h / 2;
}

$.hero.prototype.handleMovement = function() {
	// apply forces from controls
	if( $.game.keyboard.keys.w || $.game.keyboard.keys.up ) {
		this.vy -= this.accel;
	}
	if( $.game.keyboard.keys.d || $.game.keyboard.keys.right ) {
		this.vx += this.accel;
	}
	if( $.game.keyboard.keys.s || $.game.keyboard.keys.down ) {
		this.vy += this.accel;
	}
	if( $.game.keyboard.keys.a || $.game.keyboard.keys.left ) {
		this.vx -= this.accel;
	}

	// lock max velocity
	if( this.vx > this.vmax ) {
		this.vx = this.vmax;
	}

	if( this.vy > this.vmax ) {
		this.vy = this.vmax;
	}

	if( this.vx < -this.vmax ) {
		this.vx = -this.vmax;
	}

	if( this.vy < -this.vmax ) {
		this.vy = -this.vmax;
	}

	// lock viewport bounds
	if( this.collisionRectLarge.x >= 0 ) {
		this.x += this.vx;
	} else {
		this.x = this.radius;
		this.vx = -this.vx;
	}

	if( this.collisionRectLarge.y >= 0 ) {
		this.y += this.vy;
	} else {
		this.y = this.radius;
		this.vy = -this.vy;
	}

	if( this.collisionRectLarge.x + this.collisionRectLarge.w <= $.game.width ) {
		this.x += this.vx;
	} else {
		this.x = $.game.width - this.radius;
		this.vx = -this.vx;
	}

	if( this.collisionRectLarge.y + this.collisionRectLarge.h <= $.game.height ) {
		this.y += this.vy;
	} else {
		this.y = $.game.height - this.radius;
		this.vy = -this.vy;
	}

	// apply drag
	this.vx *= this.drag;
	this.vy *= this.drag;
};

$.hero.prototype.inView = function() {
	return $.containing( $.game.viewportRect, this.collisionRectLarge );
};

$.hero.prototype.updatePupil = function() {
	var dx = $.game.mouse.x - this.x - this.blobEye.x,
		dy = $.game.mouse.y - this.y - this.blobEye.y;
	this.pupilMouseAngle = Math.atan2( dy, dx );

	this.pupil.tx = this.blobPupil.x + Math.cos( this.pupilMouseAngle ) * ( this.blobEye.radius - this.blobPupil.radius );
	this.pupil.ty = this.blobPupil.y + Math.sin( this.pupilMouseAngle ) * ( this.blobEye.radius - this.blobPupil.radius );
	this.pupil.x += ( this.pupil.tx - this.pupil.x ) * 0.2;
	this.pupil.y += ( this.pupil.ty - this.pupil.y ) * 0.2;
};

$.hero.prototype.createBlobBody = function() {
	this.blobs = new $.group();

	this.blobEye = {
		x: 0,
		y: -30,
		radius: 20
	};

	this.blobPupil = {
		x: this.blobEye.x,
		y: this.blobEye.y,
		radius: 8
	};

	// main shape 1
	this.blobs.push( new $.blob({
		x: 0,
		y: 0,
		count: 25,
		radius: 40,
		spread: 15,
		hue: 90,
		saturation: 70,
		lightness: 50,
		alpha: 0.4,
		blend: 'lighter'
	}));

	// main shape 2
	this.blobs.push( new $.blob({
		x: 0,
		y: 0,
		count: 25,
		radius: 40,
		spread: 15,
		hue: 120,
		saturation: 70,
		lightness: 50,
		alpha: 0.4,
		blend: 'lighter'
	}));

	// main shape 3
	this.blobs.push( new $.blob({
		x: 0,
		y: 0,
		count: 25,
		radius: 40,
		spread: 15,
		hue: 150,
		saturation: 70,
		lightness: 50,
		alpha: 0.4,
		blend: 'lighter'
	}));

	// mouth
	this.blobs.push( new $.blob({
		x: 0,
		y: 20,
		count: 15,
		radius: 15,
		spread: 5,
		hue: 120,
		saturation: 80,
		lightness: 5,
		alpha: 1,
		blend: 'source-over'
	}));

	// eyeball
	this.blobs.push( new $.blob({
		x: this.blobEye.x,
		y: this.blobEye.y,
		count: 20,
		radius: this.blobEye.radius,
		spread: 5,
		hue: 0,
		saturation: 0,
		lightness: 100,
		alpha: 1,
		blend: 'source-over'
	}));

	// pupil
	this.blobs.push( new $.blob({
		x: this.blobPupil.x,
		y: this.blobPupil.y,
		count: 10,
		radius: this.blobPupil.radius,
		spread: 2,
		hue: 120,
		saturation: 40,
		lightness: 15,
		alpha: 1,
		blend: 'source-over'
	}));

	this.pupil = this.blobs.getAt( this.blobs.length - 1 );
	this.pupil.tx = 0;
	this.pupil.ty = 0;
};

/*$.hero.prototype.checkScreenCollision = function( x, y ) {
	return $.pointInRect( x, y, 0, 0, $.game.width, $.game.height );
};

$.hero.prototype.checkWallCollision = function( x, y, through ) {
	var foundCollision = false;

	for( var i = 0; i < $.game.state.walls.length; i++ ) {
		var wall = $.game.state.walls.alive[ i ];
		if( $.pointInRect( x, y, wall.x, wall.y, wall.w, wall.h ) ) {
			wall.clickTick = wall.clickTickMax;
			foundCollision = true;
		}
	}

	if( foundCollision ) {
		return true;
	}

	for( var i = 0; i < $.game.state.walls.length; i++ ) {
		var wall = $.game.state.walls.alive[ i ];
		if( through ) {
			var tl = { x: wall.x, y: wall.y },
				tr = { x: wall.x + wall.w, y: wall.y },
				bl = { x: wall.x, y: wall.y + wall.h },
				br = { x: wall.x + wall.w, y: wall.y + wall.h },
				h1 = { x: this.x, y: this.y },
				h2 = { x: x, y: y };
			if( $.segmentIntersect( tl, tr, h1, h2 ) ) {
				// check top left - top right
				return true;
			} else if( $.segmentIntersect( tr, br, h1, h2 ) ) {
				// check top right - bottom right
				return true;
			} else if( $.segmentIntersect( br, bl, h1, h2 ) ) {
				// check bottom right- bottom left
				return true;
			} else if( $.segmentIntersect( bl, tl, h1, h2 ) ) {
				// check bottom left - top left
				return true;
			}
		}
	}
	return false;
};*/