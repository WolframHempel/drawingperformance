ControlViewModel = function()
{
	this._eContainer = document.getElementById( "output" );
	this._pChartContainers = [];
	this._pSparkLines = [];
	this._nTimeout = null;
	this._nFramesForInterval = 0;
	this._nCurrentIntervalStart = 0;

	/**
	* Renderers
	*/
	this.renderer = ko.observableArray([
		{ "className": "CanvasApiRenderer", "name": "Canvas API Renderer" },
		{ "className": "CanvasPixelRenderer", "name": "Canvas Pixel Renderer" },
		{ "className": "RaphaelRenderer", "name": "Raphael JS Renderer" },
		{ "className": "NativeWebGl", "name": "Native WebGl Renderer" },
		{ "className": "TwoJsWebGl", "name": "Two.js WebGl Renderer" },
		{ "className": "TwoJsCanvas", "name": "Two.js Canvas Renderer" },
		{ "className": "TwoJsSvg", "name": "Two.js SVG Renderer" },
		{ "className": "KineticRenderer", "name": "Kineticjs Canvas Renderer" }
	]);

	/**
	* Observables
	*/
	this.isRunning = ko.observable( true );
	this.toggleText = ko.observable( "running" );
	this.activeRenderer = ko.observable( this.renderer()[0].className );
	this.chartNumber = ko.observable( 1 );
	this.updatesPerSeconds = ko.observable( 1 );
	this.value = ko.observable( 1 );
	this.fps = ko.observable( 0 );
	this.fpsMeasureInterval = ko.observable( 500 );

	/**
	* Events
	*/
	this.activeRenderer.subscribe( this._applyRenderer.bind( this ) );
	this.chartNumber.subscribe( this._updateCharts.bind( this ) );
	this.updatesPerSeconds.subscribe( this._onFrequencyUpdate.bind( this ) );
	window.onresize = this._updateCharts.bind( this );

	/**
	* Startup
	*/
	requestAnimationFrame( this._measurePerformance.bind( this ) );
	this._updateCharts();
	this._addPoint();
};

ControlViewModel.prototype.setChartNumber = function( nOffset )
{
	var nValue = parseInt( this.chartNumber(), 10 ) + nOffset;

	if( nValue > 0 )
	{
		this.chartNumber( nValue );
	}
};

ControlViewModel.prototype.toggle = function()
{
	if( this.isRunning() )
	{
		clearTimeout( this._nTimeout );
		this.isRunning( false );
		this.toggleText( "paused" );
	}
	else
	{
		this._addPoint();
		this.isRunning( true );
		this.toggleText( "running" );
	}
};

/************************************************************
* PRIVATE METHODS											*
************************************************************/
ControlViewModel.prototype._measurePerformance = function()
{
	this._nFramesForInterval++;

	if( performance.now() - this._nCurrentIntervalStart > this.fpsMeasureInterval() )
	{
		this.fps( this._nFramesForInterval * ( 1000 / this.fpsMeasureInterval() ) );
		this._nCurrentIntervalStart = performance.now();
		this._nFramesForInterval = 0;
	}

	requestAnimationFrame( this._measurePerformance.bind( this ) );
};

ControlViewModel.prototype._addPoint = function()
{
	this.value( this.value() * (  0.999 + ( Math.random() / 500 ) ) );

	for( var i = 0; i < this._pSparkLines.length; i++ )
	{
		this._pSparkLines[ i ].addDataPoint( this.value() );
	}

	this._nTimeout = setTimeout( this._addPoint.bind( this ), ( 1 / this.updatesPerSeconds() ) * 1000 );
};

ControlViewModel.prototype._onFrequencyUpdate = function()
{
	if( this.isRunning() )
	{
		clearTimeout( this._nTimeout );
		this._addPoint();
	}
};

ControlViewModel.prototype._updateCharts = function()
{
	var i, mData,
	nChartContainerHeight = Math.floor( this._eContainer.offsetHeight / this.chartNumber() ) -1,
	nChartContainerWidth = document.getElementById( "output" ).offsetWidth;

	/**
	* Create containers
	*/
	for( i = 0; i < this.chartNumber(); i++ )
	{
		if( this._pChartContainers[ i ] === undefined )
		{
			this._pChartContainers[ i ] = document.createElement( "li" );
			this._eContainer.appendChild( this._pChartContainers[ i ] );
			this._pSparkLines[ i ] = new Sparkline( this._pChartContainers[ i ] );

			if( i !== 0 )
			{
				mData = this._pSparkLines[ 0 ].getCurrentData();
				this._pSparkLines[ i ].setInitialData( mData.values, mData.timestamps );
			}

			this._pSparkLines[ i ].setRenderer( new renderer[ this.activeRenderer() ]() );
		}

		this._pChartContainers[ i ].style.height = nChartContainerHeight + "px";
		this._pSparkLines[ i ].setSize( nChartContainerWidth, nChartContainerHeight );
	}

	/**
	* Destroy containers
	*/
	for( i; i < this._pChartContainers.length; i++ )
	{
		this._pSparkLines[ i ].destroy();
		this._pChartContainers[ i ].remove();
	}

	/**
	* Remove surplus containers and sparklines
	*/
	this._pChartContainers.splice( this.chartNumber() );
	this._pSparkLines.splice( this.chartNumber() );
};

ControlViewModel.prototype._applyRenderer = function()
{
	for( var i = 0; i < this._pSparkLines.length; i++ )
	{
		this._pSparkLines[ i ].setRenderer( new renderer[ this.activeRenderer() ]() );
	}
};