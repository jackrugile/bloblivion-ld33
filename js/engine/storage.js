Storage.prototype.setObject = function( key, value ) {
	this.setItem( key, JSON.stringify( value ) );
};

Storage.prototype.getObject = function( key ) {
	var value = this.getItem( key );
	return value && JSON.parse( value );
};

Storage.prototype.removeObject = function( key ) {
	this.removeItem( key );
};

$.storage = function( namespace ) {
	this.namespace = namespace;
	this.obj = localStorage.getObject( this.namespace ) || {};
};

$.storage.prototype.get = function( key ) {
	return this.obj[ key ];
};

$.storage.prototype.set = function( key, val ) {
	this.obj[ key ] = val;
	this.sync();
};

$.storage.prototype.sync = function() {
	localStorage.setObject( this.namespace, this.obj );
};

$.storage.reset = function() {
	this.obj = {};
	this.sync();
};