$.mountainRange = function( opt ) {
	$.merge( this, opt );
	this.speedBase = opt.speed;
	this.points = [];

	this.points.push({
		x: $.game.width,
		y: $.game.height
	});

	this.points.push({
		x: 0,
		y: $.game.height
	});

	var xTotal = 0;
	while( xTotal < $.game.width + this.variance.h.max + this.speed ) {
		this.points.push({
			x: xTotal,
			y: this.center +$.randInt( this.variance.v.min, this.variance.v.max )
		});
		xTotal += $.randInt( this.variance.h.min, this.variance.h.max );
	}

}

$.mountainRange.prototype.step = function() {
	var second = this.points[ 3 ],
		last = this.points[ this.points.length - 1 ];

	if( last.x < $.game.width + this.variance.h.max + this.speed ) {
		var p;
		if( second.x < 0 ) {
			p = this.points.splice( 2, 1 );
		} else {
			p = { x: 0, y: 0 };
		}
		p.x = last.x + $.randInt( this.variance.h.min, this.variance.h.max ) + this.speed;
		p.y = this.center + $.randInt( this.variance.v.min, this.variance.v.max );
		this.points.push( p );
	}

	//if( this.state.hasStarted ) {
		for( var i = 2, length = this.points.length; i < length; i++ ) {
			this.points[ i ].x -= this.speed;
		}
	//}

	this.speed = this.speedBase * $.game.state.speed;
};

$.mountainRange.prototype.render = function() {
	$.polygon( this.points );
	$.ctx.fillStyle( this.color );
	$.ctx.fill();
};