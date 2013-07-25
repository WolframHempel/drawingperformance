(function(renderer){
	KineticRenderer = function()
	{
		/**
		 * @type {Kinetic.Stage}
		 * @private
		 */
		this._stage = null;

		/**
		 * @type {Kinetic.Layer}
		 * @private
		 */
		this._layer = null;

		/**
		 * @type {Object.<String, String>}
		 * @private
		 */
		this._settings = null;
	};

	KineticRenderer.prototype.init = function(container, settings)
	{
		this._settings = settings;

		this._stage = new Kinetic.Stage({
			container: container,
			width: settings.width,
			height: settings.height
		});
		this._layer = new Kinetic.Layer();
		this._stage.add(this._layer);
	};

	KineticRenderer.prototype.draw = function(xCoords, yCoords)
	{
		if(this._layer) {
			this._layer.destroyChildren();
		}

//		var line = new Kinetic.Line({
//			points: this._convertPointsArray(xCoords, yCoords),
//			lineJoin: 'round',
//			fill: this._settings.fillColor,
//			stroke: this._settings.lineColor,
//			strokeWidth: this._settings.lineWeight
//		});
//		this._layer.add(line);

		var path = new Kinetic.Path({
			data: this._convertPointsArrayToPath(xCoords, yCoords),
			fill: this._settings.fillColor,
			stroke: this._settings.lineColor,
			strokeWidth: this._settings.lineWeight
		});
		this._layer.add(path);

		this._layer.draw();
	};

	KineticRenderer.prototype.setSize = function(width, height)
	{
		this._stage.setSize(width, height);
	};

	/**
	 * @param {Array.<Number>} xCoords
	 * @param {Array.<Number>} yCoords
	 * @returns {Array.<Array.<Number>>} The x,y points in a Kinetic compatible array format.
	 * @private
	 */
	KineticRenderer.prototype._convertPointsArray = function(xCoords, yCoords)
	{
		var res = [];
		for (var i = 0; i < xCoords.length; i++) {
			res[i] = [xCoords[i], yCoords[i]];
		}

		res[i] = [res[i-1][0], this._settings.height];
		res[++i] = [res[0][0], this._settings.height];
		res[++i] = [res[0][0], res[0][1]];
		return res;
	};

	KineticRenderer.prototype._convertPointsArrayToPath = function(xCoords, yCoords)
	{
		var res = "";
		res += "M" + xCoords[0] + "," + yCoords[0];
		res += "L" + xCoords[1] + "," + yCoords[1];
		for (var i = 2; i < xCoords.length; i++) {
			res += "L" + xCoords[i] + "," + yCoords[i];
		}

		res += "L" + xCoords[i-1] + "," + this._settings.height;
		res += "L" + xCoords[0] + "," + this._settings.height;
		res += "Z";
		return res;
	};

	KineticRenderer.prototype.destroy = function()
	{
		if(this._stage) {
			this._stage.destroyChildren();
			this._stage.destroy();
			this._stage = null;
			this._layer = null;
		}
	};

	renderer.KineticRenderer = KineticRenderer;
})(renderer);