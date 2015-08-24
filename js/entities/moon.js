$.moon = function( opt ) {
	$.merge( this, opt );
	this.x = $.game.width - 150;
	this.y = 165;
	this.width = 90;
	this.height = 90;
	this.rotation = Math.PI / 4;
};

$.moon.prototype.step = function( i ) {
	this.rotation = Math.PI / 4 + Math.sin( $.game.state.tick / 100 ) * Math.PI / 8;
};

$.moon.prototype.render = function() {
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.rotate( this.rotation );
	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 0.15)' );
	$.ctx.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );
	$.ctx.restore();

	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.rotate( -this.rotation );
	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 0.15)' );
	$.ctx.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );
	$.ctx.restore();
};