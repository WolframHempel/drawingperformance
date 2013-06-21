/**
* Creates a simple sparkline in all browsers without any dependencies
*
* @param DOMNODE eContainer The element the sparkline will life in
* @param MAP mSettings OPTIONAL A map of settings that extend the defaults 
*/
Sparkline = function( eContainer, mSettings )
{
	this._eContainer = eContainer;
	this._eCanvas = null;
	this._oContext = null;
	this._nMinValue = null;
	this._nMaxValue = null;
	this._mSettings = this._extend( Sparkline.defaults, mSettings || {} );
	this._bSupportsDateNow = !!Date.now;
	this._pTimestamps = [];
	this._pValues = [];
	this._oRenderer = null;

	this._measureContainer();
};

/**
* A map of defaults, these will be extended by mSettings
*/
Sparkline.defaults = {
	/**
	* The timespan covered by the sparkline ( in ms )
	*/
	timeSpan: 3000,

	/**
	* The color of the line
	*/
	lineColor: "#1B4CE0",

	/**
	* The thickness of the line
	*/
	lineWeight: 4,

	/**
	* The color of the filled area
	*/
	fillColor: "#C8CEE0",

	/**
	* A relative padding to be added to the yCoordinates
	*/
	yPadding: 0.3
};
/**
* This method takes a new entry and draws it straight away
*
* @param FLOAT nDataPoint
*/
Sparkline.prototype.addDataPoint = function( nDataPoint )
{
	this._pValues.push( nDataPoint );
	this._pTimestamps.push( this._now() );

	this._updateData();
	this._updateMinMax();

	if( this._pValues.length > 1 )
	{
		this._draw();
	}
};

Sparkline.prototype.setRenderer = function( oRenderer )
{
	if( this._oRenderer )
	{
		this._oRenderer.destroy();
	}

	this._oRenderer = oRenderer;
	this._oRenderer.init( this._eContainer, this._mSettings );
};

Sparkline.prototype.destroy = function()
{
	if( this._oRenderer )
	{
		this._oRenderer.destroy();
	}
};

Sparkline.prototype.setSize = function( nWidth, nHeight )
{
	this._mSettings.width = nWidth;
	this._mSettings.height = nHeight;

	if( this._oRenderer )
	{
		this._oRenderer.setSize( nWidth, nHeight );
	}
};

Sparkline.prototype._draw = function()
{
	var pXCoords = this._calculateXCoords();
	var pYCoords = this._calculateYCoords();

	if( this._oRenderer )
	{
		this._oRenderer.draw( pXCoords, pYCoords );
	}

	requestAnimationFrame( this._draw.bind( this ) );
};

Sparkline.prototype._calculateXCoords = function()
{
	var pCoords = [],
		nSpan = this._mSettings.timeSpan,
		nMin = this._now() - this._mSettings.timeSpan,
		nWidth = this._mSettings.width,
		i;

	for( i = 0; i < this._pTimestamps.length; i++ )
	{
		pCoords.push( ( ( this._pTimestamps[ i ] - nMin ) / nSpan ) * nWidth );
	}

	pCoords.push( nWidth );

	return pCoords;
};

Sparkline.prototype._calculateYCoords = function()
{
	var pCoords = [],
		nMin = this._nMinValue,
		nSpan = this._nMaxValue - this._nMinValue,
		nHeight = this._mSettings.height,
		i;

	for( i = 0; i < this._pValues.length; i++ )
	{
		pCoords.push( ( ( this._pValues[ i ] - nMin ) / nSpan ) * nHeight );
	}

	pCoords.push( pCoords[ i - 1 ] );

	return pCoords;
};

/**
* This will calculate the min / max Y values while
*
* - keeping the current value in the center
* - determining the max scale based on the value farest away from the center
* - add a predefined padding
*/
Sparkline.prototype._updateMinMax = function()
{
	var nCurrent = this._pValues[ this._pValues.length - 1 ];
	var nMin = Math.min.apply( Math, this._pValues );
	var nMax = Math.max.apply( Math, this._pValues );
	var nOffset = Math.max( nCurrent - nMin, nMax - nCurrent ) * ( 1 + this._mSettings.yPadding );

	this._nMinValue = nCurrent - nOffset;
	this._nMaxValue = nCurrent + nOffset;
};

Sparkline.prototype._updateData = function()
{
	this._nStartTime = this._now() - this._mSettings.timeSpan;

	for( var i = 0; i < this._pValues.length; i++ )
	{
		if( this._pTimestamps[ i ] > this._nStartTime )
		{
			i = Math.max( i - 1, 0 );
			break;
		}
	}

	this._pTimestamps = this._pTimestamps.slice( i );
	this._pValues = this._pValues.slice( i );
};

Sparkline.prototype._now = function()
{
	if( this._bSupportsDateNow )
	{
		return Date.now();
	}
	else
	{
		return ( new Date() ).getTime();
	}
};

Sparkline.prototype._extend = function( mBase, mExtend )
{
	for( var sKey in mExtend )
	{
		mBase[ sKey ] = mExtend[ sKey ];
	}

	return mBase;
};

Sparkline.prototype._measureContainer = function()
{
	if( !this._mSettings.width )
	{
		this._mSettings.width = this._eContainer.offsetWidth;
	}

	if( !this._mSettings.height )
	{
		this._mSettings.height = this._eContainer.offsetHeight;
	}
};