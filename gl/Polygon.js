gl.Polygon = function( oCanvas, pXCoordinates, pYCoordinates )
{
	this._oCanvas = oCanvas;
	this._oContext = oCanvas.getContext();
	this._sDrawMode = "TRIANGLE_STRIP";
	this._pVertices = new Float32Array( this._createVerticesFromCoordinates( pXCoordinates, pYCoordinates ) );
	this._pColors = new Float32Array([ 1.0, 1.0, 1.0, 1.0 ]);

	this._oVerticesBuffer = this._oContext.createBuffer();
	this._oContext.bindBuffer( this._oContext.ARRAY_BUFFER, this._oVerticesBuffer );

	this._oColorBuffer = this._oContext.createBuffer();
	this._oContext.bindBuffer( this._oContext.ARRAY_BUFFER, this._oColorBuffer );
};


gl.Polygon.prototype.updateCoordinates = function( pXCoordinates, pYCoordinates )
{
	this._pVertices = new Float32Array( this._createVerticesFromCoordinates( pXCoordinates, pYCoordinates ) );
};

gl.Polygon.prototype.setDrawMode = function( sDrawMode )
{
	this._sDrawMode = sDrawMode;
};

gl.Polygon.prototype.setColors = function( pRgb, bUniform )
{
	var pColors = [];

	if( bUniform === true )
	{
		for( var i = 0; i < this._pVertices.length; i+=3 )
		{
			pColors = pColors.concat( pRgb );
		}
	}
	else
	{
		pColors = pRgb;
	}

	this._pColors = new Float32Array( pColors );
};

gl.Polygon.prototype.draw = function()
{
	this._oContext.bindBuffer( this._oContext.ARRAY_BUFFER, this._oVerticesBuffer );
	this._oContext.bufferData( this._oContext.ARRAY_BUFFER, this._pVertices, this._oContext.STATIC_DRAW );
	this._oContext.vertexAttribPointer( this._oCanvas.getVertexPositionAttribute(), 3, this._oContext.FLOAT, false, 0, 0);

	this._oContext.bindBuffer( this._oContext.ARRAY_BUFFER, this._oColorBuffer );
	this._oContext.bufferData( this._oContext.ARRAY_BUFFER, this._pColors, this._oContext.STATIC_DRAW );
	this._oContext.vertexAttribPointer( this._oCanvas.getVertexColorAttribute(), 4, this._oContext.FLOAT, false, 0, 0);

	this._oContext.drawArrays(this._oContext[ this._sDrawMode ], 0, this._pVertices.length / 3 );
};

gl.Polygon.prototype.getVertexCount = function()
{
	return this._pVertices.length / 3;
};

gl.Polygon.prototype._createVerticesFromCoordinates = function( pXCoordinates, pYCoordinates )
{
	var nRatio = this._oCanvas.getPixelToCoordinateRatio();
	var nHalfWidth = this._oCanvas.getVisibleWidth() / 2;
	var nHalfHeight = this._oCanvas.getVisibleHeight() / 2;
	var pVertices = [];

	for( var i = 0; i < pXCoordinates.length; i++ )
	{
		/**
		* WebGL has a reversed, kartesian coordinate system
		* Who on earth thought that would be a good idea ?!?
		*/
		pVertices.push( pXCoordinates[ i ] / nRatio - nHalfWidth );
		pVertices.push( ( this._oCanvas.getHeight() - pYCoordinates[ i ] ) / nRatio - nHalfHeight );
		pVertices.push( 0 );
	}

	return pVertices;
};
