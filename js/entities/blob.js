$.blob = function( opt ) {
	$.merge( this, opt );
	this.rotation = $.rand( 0, Math.PI * 2 );
	this.rotationSpeed = $.rand( 0.001, 0.005 );
	this.points = [];
	
	for( var i = 0, length = this.count; i < length; i++ ) {
		this.points.push({
			radius: this.radius,
			angle: i / length * Math.PI * 2,
			x: Math.cos( i / length * Math.PI * 2 ) * this.radius,
			y: Math.sin( i / length * Math.PI * 2 ) * this.radius,
			spread: $.rand( -this.spread, this.spread ),
			offset: $.rand( 0, 100 ),
			division: $.rand( 10, 25 ),
			sin: 0
		});
	}
}

$.blob.prototype.step = function() {
	this.rotation += this.rotationSpeed;

	for( var i = 0, length = this.count; i < length; i++ ) {
		var point = this.points[ i ];
		point.sin = Math.sin( ( $.game.tick + point.offset ) / point.division );
		point.x = Math.cos( point.angle ) * ( point.radius + point.spread * point.sin );
		point.y = Math.sin( point.angle ) * ( point.radius + point.spread * point.sin );
	}
};

$.blob.prototype.render = function() {
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.rotate( this.rotation );

	$.polygon( this.points );
	$.ctx.globalCompositeOperation( this.blend );
	$.ctx.fillStyle( 'hsla(' + this.hue + ', ' + this.saturation + '%, ' + this.lightness + '%, ' + this.alpha + ')' );
	$.ctx.fill();
	
	$.ctx.restore();
};