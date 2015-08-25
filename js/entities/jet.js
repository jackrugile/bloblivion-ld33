$.jet = function( opt ) {};

$.jet.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.size = 40;
	this.sizeHalf = this.size / 2;
	this.ox = this.x;
	this.oy = this.y;
	this.rotation = 0;
	this.colorTop = 'hsla(0, 70%, 70%, 1)';
	this.colorBot = 'hsla(0, 70%, 50%, 1)';

	// starting at center left tip, drawing clockwise
	this.pointsTop = [
		{
			x:-this.sizeHalf,
			y: 0
		},
		{
			x: 0,
			y: -this.sizeHalf
		},
		{
			x: this.sizeHalf,
			y: -this.sizeHalf
		},
		{
			x: 0,
			y: 0
		}
	];

	// starting at center left tip, drawing clockwise
	this.pointsBot = [
		{
			x: -this.sizeHalf,
			y: 0
		},
		{
			x: 0,
			y: 0
		},
		{
			x: this.sizeHalf,
			y: this.sizeHalf
		},
		{
			x: 0,
			y: this.sizeHalf
		}
	];

	this.collisionRectLarge = {
		x: 0,
		y: 0,
		w: this.size * 2,
		h: this.size * 2
	};
	this.collisionRectSmall = {
		x: 0,
		y: 0,
		w: this.size * 0.75,
		h: this.size * 0.75
	};
};

$.jet.prototype.step = function() {
	this.updateCollisionRects();

	this.x += this.vx;
	this.y += this.vy;

	if( !this.stationary && this.sinFreqDiv ) {
		this.vy = Math.sin( ( $.game.state.tick + this.sinOffset ) / this.sinFreqDiv ) * this.sinAmp;
	}

	this.rotation = Math.atan2( this.oy - this.y, this.ox - this.x );

	this.ox = this.x;
	this.oy = this.y;

	if( $.game.state.tick % 5 === 0 && !this.stationary ) {
		$.game.state.particles.create({
			x: this.x,
			y: this.y,
			vx: -this.vx / 3 + $.rand( -1, 1 ),
			vy: -this.vy / 3 + $.rand( -1, 1 ),
			radiusBase: $.rand( 4, 8 ),
			growth: $.rand( 0.5, 1 ),
			decay: $.rand( 0.01, 0.1 ),
			hue: 0,
			grow: false
		});
	}

	if( $.game.state.dead ) {
		if( this.x + this.size < 0 ) {
			$.game.state.jets.release( this );
		}
	} else {
		if( this.x - this.sizeHalf < 0 ) {
			var sound = $.game.playSound( 'wall-hit1' );
			$.game.sound.setVolume( sound, 0.2 );

			sound = $.game.playSound( 'wall-hit2' );
			$.game.sound.setVolume( sound, 0.15 );

			$.game.state.lives--;

			$.game.state.explosions.create({
				x: this.x,
				y: this.y,
				radius: 60,
				hue: 0
			});
			for( var i = 0; i < 30; i++ ) {
				$.game.state.particles.create({
					x: this.x,
					y: this.y,
					vx: $.rand( 0, 15 ),
					vy: $.rand( -3, 3 ),
					radiusBase: $.rand( 16, 24 ),
					growth: $.rand( 0.5, 1 ),
					decay: $.rand( 0.01, 0.1 ),
					hue: 0,
					grow: false
				});
			}

			$.game.state.multiplier = 1;

			$.game.state.shake.translate += 20;
			$.game.state.shake.rotate += 0.1;
			$.game.state.recentHitTick = 20;

			$.game.state.jets.release( this );
		}
	}
};

$.jet.prototype.render = function() {
	// top
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.rotate( this.rotation );
	$.polygon( this.pointsTop );
	$.ctx.fillStyle( this.colorTop );
	$.ctx.fill();
	$.ctx.restore();

	// bot
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.rotate( this.rotation );
	$.polygon( this.pointsBot );
	$.ctx.fillStyle( this.colorBot );
	$.ctx.fill();
	$.ctx.restore();

	// hit box
	/*$.ctx.fillStyle( 'hsla(0, 100%, 50%, 0.5)' );
	$.ctx.fillRect( this.collisionRectLarge.x, this.collisionRectLarge.y, this.collisionRectLarge.w, this.collisionRectLarge.h );*/
};

$.jet.prototype.updateCollisionRects = function() {
	this.collisionRectLarge.x = this.x - this.collisionRectLarge.w / 2;
	this.collisionRectLarge.y = this.y - this.collisionRectLarge.h / 2;
	this.collisionRectSmall.x = this.x - this.collisionRectSmall.w / 2;
	this.collisionRectSmall.y = this.y - this.collisionRectSmall.h / 2;
}

$.jet.prototype.hitDestroy = function() {
	$.game.state.score += $.game.state.multiplier;
	$.game.state.scorePops.create({
		x: this.x,
		y: this.y - 20,
		val: $.game.state.multiplier
	});
	if( $.game.state.multiplier < $.game.state.multiplierMax ) {
		$.game.state.multiplier++;
	}
	$.game.state.scoreTick = $.game.state.scoreTickMax;
	$.game.state.jets.release( this );
	$.game.state.explosions.create({
		x: this.x,
		y: this.y,
		radius: 30,
		hue: 0
	});
	for( var i = 0; i < 30; i++ ) {
		$.game.state.particles.create({
			x: this.x ,
			y: this.y ,
			vx: $.rand( -3, 3 ),
			vy: $.rand( -3, 3 ),
			radiusBase: $.rand( 8, 16 ),
			growth: $.rand( 0.5, 1 ),
			decay: $.rand( 0.01, 0.1 ),
			hue: 0,
			grow: false
		});
	}

	if( $.game.state.score > $.game.state.hiScoreRef ) {
		$.storage.set( 'hiScore', $.game.state.score );
		// use below to prevent constant storage lookups in play state
		$.game.state.hiScoreRef = $.game.state.score;
		$.game.state.newHiScore = true;
	}
}