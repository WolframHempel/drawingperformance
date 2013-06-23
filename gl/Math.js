gl.Math = {};

gl.Math.makePerspective = function(fovy, aspect, znear, zfar)
{
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return gl.Math.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
};

//
// glFrustum
//
gl.Math.makeFrustum = function(left, right, bottom, top, znear, zfar)
{
    var X = 2 * znear / ( right - left );
    var Y = 2 * znear / ( top - bottom );
    var A = ( right + left ) / ( right - left );
    var B = ( top + bottom ) / ( top - bottom );
    var C = -( zfar + znear ) / ( zfar - znear );
    var D = -2 * zfar * znear / (zfar-znear);

	var oMatrix = Matrix.create(
		[	
			[X, 0, A, 0],
			[0, Y, B, 0],
			[0, 0, C, D],
			[0, 0, -1, 0]
		]
	);

	return oMatrix;
};

gl.Math.TranslateMatrix = function ( v )
{
	var r;

	if( v.elements.length === 2 )
	{
		r = Matrix.I( 3 );
		r.elements[ 2 ][ 0 ] = v.elements[ 0 ];
		r.elements[ 2 ][ 1 ] = v.elements[ 1 ];
		return r;
	}

	if (v.elements.length == 3)
	{
		r = Matrix.I( 4 );
		r.elements[ 0 ][ 3 ] = v.elements[ 0 ];
		r.elements[ 1 ][ 3 ] = v.elements[ 1 ];
		r.elements[ 2 ][ 3 ] = v.elements[ 2 ];
		return r;
	}

	throw "Invalid length for Translation";
};

gl.Math.flattenMatrix = function( oMatrix )
{
	var result = [];

	if (oMatrix.elements.length === 0)
	{
		return [];
	}

	for( var j = 0; j < oMatrix.elements[0].length; j++ )
	{
		for( var i = 0; i < oMatrix.elements.length; i++ )
		{
			result.push( oMatrix.elements[i][j] );
		}
	}

    return result;
};

gl.Math.hexToRGBA = function( sHex )
{
	var r = parseInt( sHex.substr( 1,2 ), 16 ) / 256;
	var g = parseInt( sHex.substr( 3,2 ), 16 ) / 256;
	var b = parseInt( sHex.substr( 5,2 ), 16 ) / 256;

	return [ r, g, b, 1.0];
};