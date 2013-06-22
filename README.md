drawingperformance
==================

A comparison of various ways to draw a real time chart and their performance.

Renderer
-----------------
Each renderer has to implement the following interface

*init* is called once when the renderer is created. This would be the point to append any canvas/svg etc. element
and append it to eContainer.

	init( eContainer, mSettings )

*draw* is called on every frame. pXCoords and pYCoords are arrays of the same length that
contain the actual screen coordinates

	draw( pXCoords, pYCoords )

Please take into account that *setSize* can be called at any given point. Before or after init and draw

	setSize( nWidth, nHeight )

*destroy* should stop all drawing activities and remove all elements the renderer has previously added to the DOM
It should NOT remove the container it is in

	destroy()

mSettings contains the following. These settings can be extended 
when creating a new instance of Sparkline

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

