renderer.RaphaelRenderer = function()
{
	this._oPaper = null;
	this._nWidth = null;
	this._nHeight = null;
	this._ePath = null;AAA = this;
};

renderer.RaphaelRenderer.prototype.init = function( eContainer, mSettings )
{
	this._nWidth = mSettings.width;
	this._nHeight = mSettings.height;
	this._oPaper = new Raphael( eContainer, this._nWidth, this._nHeight );
	this._ePath = this._oPaper.path( "M0,0L10,10" );

	this._ePath.attr({
		"fill": mSettings.fillColor,
		"stroke": mSettings.lineColor,
		"stroke-width":  mSettings.lineWeight
	});
};

renderer.RaphaelRenderer.prototype.setSize = function( nWidth, nHeight )
{
	this._nWidth = nWidth;
	this._nHeight = nHeight;
	this._oPaper.setSize( nWidth, nHeight );
};

renderer.RaphaelRenderer.prototype.draw = function( nXCoords, nYCoords )
{
	this._ePath.attr( "path", this._coordsToPathString( nXCoords, nYCoords ) );
};

renderer.RaphaelRenderer.prototype.destroy = function()
{
	this._oPaper.clear();
	this._oPaper.canvas.remove();
};

renderer.RaphaelRenderer.prototype._coordsToPathString = function( pXCoords, pYCoords )
{
	var pPath = [ "M", pXCoords[ 0 ] , ",", pYCoords[ 0 ] ];

	for( var i = 1; i < pXCoords.length; i++ )
	{
		pPath.push( "L" );
		pPath.push( pXCoords[ i ] );
		pPath.push( "," );
		pPath.push( pYCoords[ i ] );
	}

	pPath.push( "L" );
	pPath.push( this._nWidth );
	pPath.push( "," );
	pPath.push( this._nHeight );

	pPath.push( "L" );
	pPath.push( 0 );
	pPath.push( "," );
	pPath.push( this._nHeight );

	return pPath.join( "" );
};