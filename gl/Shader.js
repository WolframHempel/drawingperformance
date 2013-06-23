gl.Shader = function( sShaderCode, sShaderType, oWebGlContext )
{
	this._oContext = oWebGlContext;
    this._oShader = oWebGlContext.createShader( oWebGlContext[ sShaderType ] );

    this._oContext.shaderSource( this._oShader, sShaderCode );
    this._oContext.compileShader( this._oShader );

    // See if it compiled successfully
    if (! this._oContext.getShaderParameter( this._oShader, oWebGlContext.COMPILE_STATUS ) )
    {
        console.error( "An error occurred compiling the shaders: " + this._oContext.getShaderInfoLog( this._oShader ) );
    }
};

gl.Shader.prototype.getWebGlShader = function()
{
	return this._oShader;
};