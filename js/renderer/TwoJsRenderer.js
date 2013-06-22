TwoJsRenderer = function( oType )
{
	this._oType = oType;
	this._nVertexCount = 0;
	this._oTwo = null;
	this._eContainer = null;
	this._nWidth = null;
	this._nHeight = null;
	this._mSettings = null;
	this._oPolygon = null;
};

TwoJsRenderer.prototype.init = function( eContainer, mSettings )
{
	this._eContainer = eContainer;
	this._mSettings = mSettings;
	this._nWidth = mSettings.width;
	this._nHeight = mSettings.height;

	var mParameters =
	{
		width: this._mSettings.width,
		height: this._mSettings.height,
		type: this._oType
	};

	this._oTwo = new Two( mParameters );
	this._oTwo.appendTo( eContainer );
};

TwoJsRenderer.prototype.destroy = function()
{
	this._oTwo.clear();
	this._eContainer.children[0].remove();
};

TwoJsRenderer.prototype.setSize = function( nWidth, nHeight )
{
	this._nWidth = nWidth;
	this._nHeight = nHeight;
	this._oTwo.height = nHeight;
	this._oTwo.width = nWidth;

	if( this._oPolygon )
	{
		this._oPolygon.vertices[ this._oPolygon.vertices.length - 2 ].set( this._nWidth, this._nHeight );
		this._oPolygon.vertices[ this._oPolygon.vertices.length - 1 ].set( 0, this._nHeight );
		this._oTwo.update();
	}
};

TwoJsRenderer.prototype.draw = function( pXCoords, pYCoords )
{
	var i, pVertices = [];
	/**
	* WebGL uses Arraybuffers of fixed length for vertices.
	* So as long as the number of vertices hasn't changed we can just
	* re-arrange the existend ones
	*/
	if( this._nVertexCount === pXCoords.length )
	{
		for( i = 0; i < pXCoords.length; i++ )
		{
			this._oPolygon.vertices[ i ].set( pXCoords[ i ], pYCoords[ i ] );
		}
	}

	/**
	* If the number of vertices however has changed, we basically throw
	* the entire Polygon away and create a new one - which is quite
	* expensive. Might be worth trying to create a polygon with one
	* vertex per pixel and do the interpolation in code
	*/
	else
	{
		for( i = 0; i < pXCoords.length; i++ )
		{
			pVertices.push( new Two.Vector( pXCoords[ i ], pYCoords[ i ] ) );
		}

		/**
		* Add two additional vertices to extend the shape to the
		* bottom of the graph and close it
		*/
		pVertices.push( new Two.Vector( this._nWidth, this._nHeight ) );
		pVertices.push( new Two.Vector( 0, this._nHeight ) );


		if( this._oPolygon )
		{
			this._oTwo.remove( this._oPolygon );
		}

		this._oPolygon = new Two.Polygon( pVertices, true, false );

		/**
		* Applying settings works directly in SVG, but requires
		* this._oTwo.update() to be called for Canvas and WebGL
		*/
		this._oPolygon.stroke = this._mSettings.lineColor;
		this._oPolygon.linewidth  = this._mSettings.lineWeight;
		this._oPolygon.fill = this._mSettings.fillColor;

		this._oTwo.add( this._oPolygon );
		this._nVertexCount = pXCoords.length;
	}

	this._oTwo.update();
};

renderer.TwoJsWebGl = TwoJsRenderer.bind( TwoJsRenderer.prototype, Two.Types.webgl );
renderer.TwoJsCanvas = TwoJsRenderer.bind( TwoJsRenderer.prototype, Two.Types.canvas );
renderer.TwoJsSvg = TwoJsRenderer.bind( TwoJsRenderer.prototype, Two.Types.svg );