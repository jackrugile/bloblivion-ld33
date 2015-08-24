$.star = function( opt ) {
	$.merge( this, opt );
	this.size = 3;
	this.width = this.size * this.scale;
	this.height = this.size * this.scale;
	this.rotation = Math.PI / 4
	this.offset = $.randInt( 0, 1000 );
	this.alpha = 1;
	this.rotationDivider = $.rand( 30, 60 );
	this.twinkleDivider = $.rand( 10, 30 );
	this.twinkleTimer = 0;
	this.twinkleTimerMax = 60;
};

$.star.prototype.step = function( i ) {
	this.rotation = Math.PI / 4 + Math.sin( ( $.game.tick + this.offset ) / this.rotationDivider ) * Math.PI / 6;
	this.alpha = 0.08 + Math.cos( ( $.game.tick + this.offset ) / this.twinkleDivider ) * 0.06;

	if( $.rand( 0, 1 ) > 0.99 ) {
		this.twinkleTimer = this.twinkleTimerMax;
	}

	if( this.twinkleTimer > 0 ) {
		this.twinkleTimer--;
	}
};

$.star.prototype.render = function() {
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.rotate( this.rotation );
	if( this.twinkleTimer ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + ( ( this.twinkleTimer / this.twinkleTimerMax ) * 0.15 ) + ')' );
	} else {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + this.alpha + ')' );
	}
	$.ctx.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );
	$.ctx.restore();
};