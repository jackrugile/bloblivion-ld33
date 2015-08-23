$.group = function() {
	this.collection = [];
	this.length = 0;
};

$.group.prototype.push = function( item ) {
	this.length++;
	return this.collection.push( item );
};

$.group.prototype.pop = function() {
	this.length--;
	return this.collection.pop();
};

$.group.prototype.unshift = function( item ) {
	this.length++;
	return this.collection.unshift( item );
};

$.group.prototype.shift = function() {
	this.length--;
	return this.collection.shift();
};

$.group.prototype.getAt = function( index ) {
	return this.collection[ index ];
};

$.group.prototype.getByPropVal = function( prop, val ) {
	var foundItem = null;
	this.each( function( item, i, collection ) {
		if( item[ prop ] == val ) {
			foundItem = item;
			return;
		}
	}, 0, this );
	return foundItem;
};

$.group.prototype.removeAt = function( index ) {
	if( index < this.length ) {
		this.collection.splice( index, 1 );
		this.length--;
	}
};

$.group.prototype.remove = function( item ) {
	var index = this.collection.indexOf( item );
	if( index > -1 ) {
		this.collection.splice( index, 1 );
		this.length--;
	}
};

$.group.prototype.empty = function() {
	this.collection.length = 0;
	this.length = 0;
};

$.group.prototype.each = function( action, asc, context ) {
	var length = this.length,
		isString = $.isString( action ),
		ctx = context || window,
		i;
	if( asc ) {
		for( i = 0; i < length; i++ ) {
			if( isString ) {
				this.collection[ i ][ action ]( i );
			} else {
				action.bind( ctx, this.collection[ i ], i, this.collection )();
			}
		}
	} else {
		i = length;
		while( i-- ) {
			if( isString ) {
				this.collection[ i ][ action ]( i );
			} else {
				action.bind( ctx, this.collection[ i ], i, this.collection )();
			}
		}
	}
};