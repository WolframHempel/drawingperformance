renderer.CanvasApiRenderer = function()
{
	this._eCanvas = null;
	this._oContext = null;
	this._eContainer = null;
	this._nWidth = null;
	this._nHeight = null;
	this._mSettings = null;
};

renderer.CanvasApiRenderer.prototype.init = function( eContainer, mSettings )
{
	this._eContainer = eContainer;
	this._mSettings = mSettings;
	this._eCanvas = document.createElement( "canvas" );
	this.setSize( mSettings.width, mSettings.height );
	this._eContainer.appendChild( this._eCanvas );
	this._oContext = this._eCanvas.getContext( "2d" );
	this._applySettings();
};

renderer.CanvasApiRenderer.prototype.destroy = function()
{
	this._eCanvas.remove();
};

renderer.CanvasApiRenderer.prototype.setSize = function( nWidth, nHeight )
{
	this._nWidth = nWidth;
	this._nHeight = nHeight;
	this._eCanvas.width = nWidth;
	this._eCanvas.height = nHeight;
	this._applySettings();
};

renderer.CanvasApiRenderer.prototype.draw = function( pXCoords, pYCoords )
{
	this._oContext.clearRect( 0, 0, this._nWidth, this._nHeight );
	this._oContext.beginPath();
	this._oContext.moveTo( pXCoords[ 0 ], pYCoords[ 0 ] );

	for( var i = 1; i < pXCoords.length; i++ )
	{
		this._oContext.lineTo( pXCoords[ i ], pYCoords[ i ] );
	}

	this._oContext.stroke();

	this._oContext.lineTo( this._nWidth, this._nHeight );
	this._oContext.lineTo( pXCoords[ 0 ], this._nHeight );
	this._oContext.closePath();

	this._oContext.fill();
};

/**
* I think this is an actual bug in Chromes canvas implementation
* If you change a Canvas' height at runtime it looses it's fillColor setting
*/
renderer.CanvasApiRenderer.prototype._applySettings = function()
{
	if( this._oContext )
	{
		this._oContext.strokeStyle = this._mSettings.lineColor;
		this._oContext.lineWidth = this._mSettings.lineWeight;
		this._oContext.fillStyle = this._mSettings.fillColor;
	}
};