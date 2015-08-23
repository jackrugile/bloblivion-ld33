$.cloud = function( opt ) {};

$.cloud.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.type = $.randInt( 1, 2 );
	this.image = $.game.images[ 'cloud' + this.type ];
	this.scale = $.rand( 0.25, 0.75 );
	this.width = this.image.width * this.scale;
	this.height = this.image.height * this.scale;
	this.alpha = $.rand( 0.02, 0.1 );
}

$.cloud.prototype.step = function( i ) {
	this.x += -this.speed * $.game.state.speed / 40;
	if( this.x + this.width < 0 ) {
		$.game.state.clouds.release( this );
	}
};

$.cloud.prototype.render = function() {
	$.ctx.a( this.alpha );
	$.ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
	$.ctx.ra();
};