ControlViewModel = function()
{
	this._oSparkline = new Sparkline( document.getElementById( "output" ) );

	this.renderer = ko.observableArray([
		{ "className": "CanvasApiRenderer", "name": "Canvas API Renderer" },
		{ "className": "CanvasPixelRenderer", "name": "Canvas Pixel Renderer" }
	]);

	this.selectedRenderer = ko.observable( "" );
	this._nTimeout = null;

	this.isRunning = ko.observable( true );
	this.toggleText = ko.observable( "running" );
	this.activeRenderer = ko.observable( "" );
	this.chartNumber = ko.observable( 1 );

	this.updatesPerSeconds = ko.observable( 1 );
	this.updatesPerSeconds.subscribe( this.onFrequencyUpdate.bind( this ) );
	this.value = ko.observable( 1 );

	this.setRenderer( this.renderer()[0].className );
	this.addPoint();
};

ControlViewModel.prototype.setChartNumber = function( nOffset )
{
	this.chartNumber( this.chartNumber() + nOffset );
};

ControlViewModel.prototype.onFrequencyUpdate = function()
{
	if( this.isRunning() )
	{
		clearTimeout( this._nTimeout );
		this.addPoint();
	}
};

ControlViewModel.prototype.setRenderer = function( sClassName )
{
	this.activeRenderer( sClassName );
	this._oSparkline.setRenderer( new renderer[ sClassName ]() );
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
	this._oSparkline.addDataPoint( this.value() );
	this._nTimeout = setTimeout( this.addPoint.bind( this ), ( 1 / this.updatesPerSeconds() ) * 1000 );
};


