ControlViewModel = function()
{
	this._oSparkline = new Sparkline( document.getElementById( "sparklineContainer" ) );
	this._oSparkline.setRenderer( new CanvasApiRenderer() );
	this._nTimeout = null;
	
	this.isRunning = ko.observable( true );
	this.toggleText = ko.observable( "stop" );

	this.updatesPerSeconds = ko.observable( 1 );
	this.updatesPerSeconds.subscribe( this.onFrequencyUpdate.bind( this ) );
	this.value = ko.observable( 1 );
	this.addPoint();
};

ControlViewModel.prototype.onFrequencyUpdate = function()
{
	if( this.isRunning() )
	{
		clearTimeout( this._nTimeout );
		this.addPoint();
	}
};

ControlViewModel.prototype.setRenderer = function( fRenderer )
{
	this._oSparkline.setRenderer( new fRenderer() );
};

ControlViewModel.prototype.toggle = function()
{
	if( this.isRunning() )
	{
		clearTimeout( this._nTimeout );
		this.isRunning( false );
		this.toggleText( "start" );
	}
	else
	{
		this.addPoint();
		this.isRunning( true );
		this.toggleText( "stop" );
	}
};

ControlViewModel.prototype.addPoint = function()
{
	this.value( this.value() * (  0.999 + ( Math.random() / 500 ) ) );
	this._oSparkline.addDataPoint( this.value() );
	this._nTimeout = setTimeout( this.addPoint.bind( this ), ( 1 / this.updatesPerSeconds() ) * 1000 );
};


