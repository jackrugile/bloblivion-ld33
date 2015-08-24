$.puff = function( opt ) {};

$.puff.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.life = 1;
	this.scale = 1;
	this.alpha = 1;
};

$.puff.prototype.step = function() {
	this.life -= 0.05;

	this.alpha = this.life / 3;
	this.scale = 1 + ( 1 - this.life ) * 1;

	if( this.life <= 0 ) {
		$.game.state.puffs.release( this );
	}
};

$.puff.prototype.render = function() {
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.rotate( Math.PI / 4 );
	$.ctx.scale( this.scale, this.scale );
	$.ctx.lineWidth( 1 );
	$.ctx.strokeStyle( 'hsla(0, 0%, 100%, ' + this.alpha + ')' );
	$.ctx.strokeRect( -10, -10, 20, 20 );
	$.ctx.restore();
};