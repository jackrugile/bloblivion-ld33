$.scorePop = function( opt ) {};

$.scorePop.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.life = 1;
	this.tweenY = $.game.tween( this ).to( { y: this.y - 50 }, 1, 'outExpo' );
	this.tweenLife = $.game.tween( this ).to( { life: 0 }, 1 );
};

$.scorePop.prototype.step = function() {
	this.alpha = this.life * 2;

	if( this.life <= 0 ) {
		$.game.state.scorePops.release( this );
	}
};

$.scorePop.prototype.render = function() {

	$.ctx.font( ( 16 + this.val * 6 ) +'px uni0553wf' );
	$.ctx.textBaseline( 'bottom' );
	$.ctx.textAlign( 'center' );
	if( this.val < 4 ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + this.alpha + ')' );
	} else {
		$.ctx.fillStyle( 'hsla(120, 80%, 65%, ' + this.alpha + ')' );
	}
	$.ctx.fillText( '+' + this.val, this.x, this.y );
};