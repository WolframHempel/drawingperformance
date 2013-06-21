renderer.CanvasPixelRenderer = function()
{
	this._eCanvas = null;
	this._oContext = null;
	this._eContainer = null;
	this._nWidth = null;
	this._nHeight = null;
};

renderer.CanvasPixelRenderer.prototype.init = function( eContainer, mSettings )
{
	this._eContainer = eContainer;
	this._eCanvas = document.createElement( "canvas" );
	this.setSize( mSettings.width, mSettings.height );
	this._eContainer.appendChild( this._eCanvas );
	this._oContext = this._eCanvas.getContext( "2d" );
	this._oContext.strokeStyle = mSettings.lineColor;
	this._oContext.lineWidth = mSettings.lineWeight;
	this._oContext.fillStyle = mSettings.fillColor;
};

renderer.CanvasPixelRenderer.prototype.destroy = function()
{
	this._eCanvas.remove();
};

renderer.CanvasPixelRenderer.prototype.setSize = function( nWidth, nHeight )
{
	this._nWidth = nWidth;
	this._nHeight = nHeight;
	this._eCanvas.width = nWidth;
	this._eCanvas.height = nHeight;
};

renderer.CanvasPixelRenderer.prototype.draw = function( pXCoords, pYCoords )
{
	var oImageData = this._oContext.createImageData( this._nWidth, this._nHeight );

	var nValueIndex = 0,
		nXSpan,
		nYSpan,
		nX1, nX2, nY1, nY2,
		nImageDataIndex,
		nX,
		nY;

	for( nX = pXCoords[ 0 ]; nX < this._nWidth; nX++ )
	{
		if( nX > pXCoords[ nValueIndex + 1 ] )
		{
			nValueIndex++;
		}

		nX1 = pXCoords[ nValueIndex ];
		nX2 = pXCoords[ nValueIndex + 1 ];
		nY1 = pYCoords[ nValueIndex ];
		nY2 = pYCoords[ nValueIndex + 1 ];

		nY = nY1 + ( nY2 - nY1 ) * ( nX - nX1 ) / ( nX2 - nX1 );

		nImageDataIndex = ( ( oImageData.width * 4 ) * Math.floor( nY ) ) + ( Math.floor( nX ) * 4 );

		oImageData.data[ nImageDataIndex ] = 0;
		oImageData.data[ nImageDataIndex + 1 ] = 0;
		oImageData.data[ nImageDataIndex + 2 ] = 0;
		oImageData.data[ nImageDataIndex + 3 ] = 255;
	}

	this._oContext.putImageData( oImageData, 0, 0 );
};