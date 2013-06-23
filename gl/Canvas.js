gl.Canvas = function( eContainer )
{
	/**
	* Create the canvas element
	*/
	this._eContainer = eContainer;
	this._nWidth = this._eContainer.offsetWidth;
	this._nHeight = this._eContainer.offsetHeight;

	this._eCanvas = document.createElement( "canvas" );
	this._eCanvas.width = this._nWidth;
	this._eCanvas.height = this._nHeight;

	this._eContainer.appendChild( this._eCanvas );

	/**
	* All polygons will be stored seperately
	*/
	this._pPolygons = [];

	/**
	* Determines if the perspective Matrix has changed
	*/
	this._bMatrixChanged = true;

	/**
	* The Field of View in Degrees
	*/
	this._nFieldOfView = 45;

	/**
	* The distance between the observer and the canvas
	*/
	this._nDistance = 6;

	this.updateRatios();

	/**
	* Initialise WebGL context
	*/
	this._oContext = this._eCanvas.getContext( "webgl", {antialias: true} ) || this._eCanvas.getContext( "experimental-webgl" );

	if( this._oContext === null )
	{
		throw "Couldn't initialise WebGL context";
	}

	this._oContext.clearColor(0.0, 0.0, 0.0, 0.0);
	this._oContext.enable( this._oContext.DEPTH_TEST );
	this._oContext.depthFunc( this._oContext.LEQUAL );
	this._oContext.clear( this._oContext.COLOR_BUFFER_BIT | this._oContext.DEPTH_BUFFER_BIT );
	this._oContext.viewport( 0, 0, this._nWidth, this._nHeight );

	/** 
	* Create the un-initialised shader program
	*/
	this._oShaderProgram = this._oContext.createProgram();
};

gl.Canvas.prototype.draw = function()
{
	this._oContext.clear( this._oContext.COLOR_BUFFER_BIT | this._oContext.DEPTH_BUFFER_BIT );
	//this._oContext.vertexAttribPointer( this._sVertexPositionAttribute, 3, this._oContext.FLOAT, false, 0, 0);

	if( this._bMatrixChanged === true )
	{
		this.setMatrixUniforms();
		this._bMatrixChanged = false;
	}

	for( var i = 0; i < this._pPolygons.length; i++ )
	{
		this._pPolygons[ i ].draw();
	}

};


gl.Canvas.prototype.destroy = function()
{
	this._eCanvas.remove();
};

gl.Canvas.prototype.setSize = function( nWidth, nHeight )
{
	this._nWidth = nWidth;
	this._nHeight = nHeight;

	this._eCanvas.width = nWidth;
	this._eCanvas.height = nHeight;

	this._oContext.viewport( 0, 0, nWidth, nHeight );

	this.updateRatios();
	this.setMatrixUniforms();
};

gl.Canvas.prototype.updateRatios = function()
{
	/**
	* Pre-calculate the relationship between the canvas' pixel dimension
	* and the rendered space
	*/
	this._nVisibletoActual = this._nHeight / ( 2 * Math.tan( this._nFieldOfView * Math.PI / 180 / 2 ) * this._nDistance );
	this._nVisibleWidth = this._nWidth / this._nVisibletoActual;
	this._nVisibleHeight = this._nHeight / this._nVisibletoActual;
};

gl.Canvas.prototype.getContext = function()
{
	return this._oContext;
};

gl.Canvas.prototype.getPixelToCoordinateRatio = function()
{
	return this._nVisibletoActual;
};

gl.Canvas.prototype.getWidth = function()
{
	return this._nVWidth;
};

gl.Canvas.prototype.getHeight = function()
{
	return this._nHeight;
};

gl.Canvas.prototype.getVisibleWidth = function()
{
	return this._nVisibleWidth;
};

gl.Canvas.prototype.getVisibleHeight = function()
{
	return this._nVisibleHeight;
};

gl.Canvas.prototype.getVertexPositionAttribute = function()
{
	return this._sVertexPositionAttribute;
};

gl.Canvas.prototype.getVertexColorAttribute = function()
{
	return this._sVertexColorAttribute;
};

gl.Canvas.prototype.addPolygon = function( oPolygon )
{
	this._pPolygons.push( oPolygon );
};

gl.Canvas.prototype.addShader = function( oShader )
{
	this._oContext.attachShader( this._oShaderProgram, oShader.getWebGlShader() );
};

gl.Canvas.prototype.initShaders = function()
{
	this._oContext.linkProgram( this._oShaderProgram );
	this._oContext.useProgram( this._oShaderProgram );

	/**
	* Vertex position
	*/
	this._sVertexPositionAttribute = this._oContext.getAttribLocation( this._oShaderProgram, "aVertexPosition" );
	this._oContext.enableVertexAttribArray( this._sVertexPositionAttribute );

	/**
	* Vertex Color
	*/
	this._sVertexColorAttribute = this._oContext.getAttribLocation( this._oShaderProgram, "aVertexColor" );
	this._oContext.enableVertexAttribArray( this._sVertexColorAttribute );
};

gl.Canvas.prototype.setMatrixUniforms = function()
{
	var oPerspectiveMatrix = gl.Math.makePerspective( this._nFieldOfView, this._nWidth / this._nHeight, 0.1, 100.0);
	var oIdentityMatrix = Matrix.I( 4 );
	var oTranslationVector = Vector.create( [ -0.0, 0.0, -this._nDistance ] );
	var oTranslationMatrix = gl.Math.TranslateMatrix( oTranslationVector );
	var oMultiMatrix = oIdentityMatrix.x( oTranslationMatrix );

	var pUniform = this._oContext.getUniformLocation( this._oShaderProgram, "uPMatrix" );
	var mvUniform = this._oContext.getUniformLocation( this._oShaderProgram, "uMVMatrix" );

	this._oContext.uniformMatrix4fv( pUniform, false, new Float32Array( gl.Math.flattenMatrix( oPerspectiveMatrix ) ) );
	this._oContext.uniformMatrix4fv( mvUniform, false, new Float32Array( gl.Math.flattenMatrix( oMultiMatrix ) ) );
};