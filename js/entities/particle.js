$.particle = function( opt ) {};

$.particle.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.drag = 0.99;
	this.life = 1;
	this.radius = this.grow ? 0 : this.radiusBase;
	this.alphaBase = $.rand( 0.25, 1 );
	this.saturation = 80;
};

$.particle.prototype.step = function() {
	this.vx *= this.drag;
	this.vy *= this.drag;

	this.vy += 0.05;

	this.x += this.vx;
	this.y += this.vy;

	if( this.radius < this.radiusBase ) {
		this.radius += this.growth;
	} else {
		this.life -= this.decay;
	}

	if( this.life <= 0 ) {
		$.game.state.particles.release( this );
	}
};

$.particle.prototype.render = function() {
	$.ctx.fillStyle( 'hsla(' + this.hue + ', ' + this.saturation + '%, 70%, ' + ( this.life * this.alphaBase ) + ')' );
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.rotate( Math.PI / 4 );
	$.ctx.fillRect( -this.radius / 2, -this.radius / 2, this.radius, this.radius );
	$.ctx.restore();
};