ControlViewModel = function()
{
	this._eContainer = document.getElementById( "output" );
	this._pChartContainers = [];
	this._pSparkLines = [];

	this.renderer = ko.observableArray([
		{ "className": "CanvasApiRenderer", "name": "Canvas API Renderer" },
		{ "className": "CanvasPixelRenderer", "name": "Canvas Pixel Renderer" }
	]);


	this._nTimeout = null;

	this.isRunning = ko.observable( true );
	this.toggleText = ko.observable( "running" );
	this.activeRenderer = ko.observable( this.renderer()[0].className );
	this.activeRenderer.subscribe( this._applyRenderer.bind( this ) );
	this.chartNumber = ko.observable( 1 );
	this.chartNumber.subscribe( this._updateChartNumber.bind( this ) );
	this.updatesPerSeconds = ko.observable( 1 );
	this.updatesPerSeconds.subscribe( this.onFrequencyUpdate.bind( this ) );
	this.value = ko.observable( 1 );
	this._updateChartNumber();

	this.addPoint();
};

ControlViewModel.prototype.setChartNumber = function( nOffset )
{
	if( this.chartNumber() + nOffset > 0 )
	{
		this.chartNumber( this.chartNumber() + nOffset );
	}
};

ControlViewModel.prototype.onFrequencyUpdate = function()
{
	if( this.isRunning() )
	{
		clearTimeout( this._nTimeout );
		this.addPoint();
	}
};


ControlViewModel.prototype._updateChartNumber = function()
{
	var i,
	nChartContainerHeight = Math.floor( this._eContainer.offsetHeight / this.chartNumber() ) -1;

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
			this._pSparkLines[ i ].setRenderer( new renderer[ this.activeRenderer() ]() );
		}

		this._pChartContainers[ i ].style.height = nChartContainerHeight + "px";
		this._pSparkLines[ i ].setSize( this._pChartContainers[ i ].offsetWidth, nChartContainerHeight );
	}

	/**
	* Destroy containers
	*/
	for( i; i < this._pChartContainers.length; i++ )
	{
		this._pChartContainers[ i ].remove();
		this._pSparkLines[ i ].destroy();
	}

	/**
	* Remove surplus containers
	*/
	this._pChartContainers.splice( this.chartNumber() );
};

ControlViewModel.prototype._applyRenderer = function()
{
	for( var i = 0; i < this._pSparkLines.length; i++ )
	{
		this._pSparkLines[ i ].setRenderer( new renderer[ this.activeRenderer() ]() );
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
		this.addPoint();
		this.isRunning( true );
		this.toggleText( "running" );
	}
};

ControlViewModel.prototype.addPoint = function()
{
	this.value( this.value() * (  0.999 + ( Math.random() / 500 ) ) );

	for( var i = 0; i < this._pSparkLines.length; i++ )
	{
		this._pSparkLines[ i ].addDataPoint( this.value() );
	}

	this._nTimeout = setTimeout( this.addPoint.bind( this ), ( 1 / this.updatesPerSeconds() ) * 1000 );
};