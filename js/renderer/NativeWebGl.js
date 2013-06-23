renderer.NativeWebGl = function()
{
	this._sVertexShaderCode = "\
	attribute vec3 aVertexPosition;\
	attribute vec4 aVertexColor;\
	uniform mat4 uMVMatrix;\
	uniform mat4 uPMatrix;\
	varying vec4 vColor;\
	void main(void) {\
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
		vColor = aVertexColor;\
	}";

	this._sFragmentShaderCode = "\
	precision mediump float;\
		varying vec4 vColor;\
	void main(void) {\
		gl_FragColor = vColor;\
	}";
};

renderer.NativeWebGl.prototype.init = function( eContainer, mSettings )
{
	this._nWidth = mSettings.width;
	this._nHeight = mSettings.height;

	this._pFillColor = gl.Math.hexToRGBA( mSettings.fillColor );
	this._oCanvas = new gl.Canvas( eContainer );

	/**
	* Create Vertex shader
	*/
	var oVertexShader = new gl.Shader( this._sVertexShaderCode, "VERTEX_SHADER", this._oCanvas.getContext() );
	this._oCanvas.addShader( oVertexShader );

	/**
	* Create Fragment shader
	*/
	var oFragmentShader = new gl.Shader( this._sFragmentShaderCode, "FRAGMENT_SHADER", this._oCanvas.getContext() );
	this._oCanvas.addShader( oFragmentShader );

	this._oCanvas.initShaders();

	this._oPolygon = new gl.Polygon( this._oCanvas, [], [] );
	this._oPolygon.setDrawMode( "TRIANGLE_STRIP" );
	this._oPolygon.setColors( [1.0,0.0,1.0,1.0], true );

	this._oCanvas.addPolygon( this._oPolygon );
};

renderer.NativeWebGl.prototype.draw = function( pXCoords, pYCoords )
{
	pXCoords.unshift( 0 );
	pYCoords.unshift( this._nHeight );
	pXCoords.push( this._nWidth );
	pYCoords.push( this._nHeight );

	this._oPolygon.updateCoordinates( pXCoords, pYCoords );
	this._oPolygon.setColors( this._pFillColor, true );
	this._oCanvas.draw();
};

renderer.NativeWebGl.prototype.destroy = function()
{
	this._oCanvas.destroy();
};

renderer.NativeWebGl.prototype.setSize = function( nWidth, nHeight )
{
	this._oCanvas.setSize( nWidth, nHeight );
};