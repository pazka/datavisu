class DataMap {
	pdz = import_pdz_json
	grid = import_carroyage_json
	allPoly = [];
	opacity = 255;
	mapStrokeImg;
	mapMaskImg;
	zoom = 1;

	mapOn = false;
	gridOn = false
	logOn = true;
	mapPopGrid;


	screenBounds = {
		lines: [],
		points: [],
		maxX: 0,
		maxY: 0,
		minX: 100,
		minY: 100
	}

	internalGeoBounds = {
		minX: Infinity,
		maxX: 0,
		minY: Infinity,
		maxY: 0,
		amplX: 0,
		amplY: 0,
		ratioX: 0.0,
		ratioY: 0.0,
		coefX: 1,
		orientation: 0
	}

	popBounds = {
		min: Infinity,
		max: 0
	}
	gridColors = [
		[255, 0, 0],
		[0, 255, 0],
		[0, 0, 255],
		[255, 255, 0],
		[255, 255, 255]
	]

	dimension = {
		width: 0, height: 0
	}
	pos = {
		x: 0, y: 0
	}

	constructor(_width, _height, posx = 0, posy = 0) {
		this.dimension.width = _width;
		this.dimension.height = _height;
		this.pos.x = posx;
		this.pos.y = posy;
	}

	setup = () => {
		//prepare bounds
		this.pdz.forEach(coords => {
			if (coords[0] < this.internalGeoBounds.minX)
				this.internalGeoBounds.minX = coords[0];
			if (coords[0] > this.internalGeoBounds.maxX)
				this.internalGeoBounds.maxX = coords[0];

			if (coords[1] < this.internalGeoBounds.minY)
				this.internalGeoBounds.minY = coords[1];
			if (coords[1] > this.internalGeoBounds.maxY)
				this.internalGeoBounds.maxY = coords[1];
		});

		this.internalGeoBounds.amplX = this.internalGeoBounds.maxX - this.internalGeoBounds.minX
		this.internalGeoBounds.amplY = this.internalGeoBounds.maxY - this.internalGeoBounds.minY

		//if the map is longer than wider, turn it.
		this.internalGeoBounds.orientation = this.internalGeoBounds.amplX / this.internalGeoBounds.amplY < 1 ? 1 : 0

		this.internalGeoBounds.ratioY = this.dimension.height
			/
			((1 - this.internalGeoBounds.orientation) * this.internalGeoBounds.amplY +
				(this.internalGeoBounds.orientation) * this.internalGeoBounds.amplX)

		//ratio X is different because of map
		this.internalGeoBounds.ratioX = this.internalGeoBounds.coefX * this.dimension.width
			/
			((this.internalGeoBounds.orientation) * this.internalGeoBounds.amplY +
				(1 - this.internalGeoBounds.orientation) * this.internalGeoBounds.amplX)

		//prepare polygon to screen coordonates
		let mapScreenPoly = [];
		this.pdz.forEach(coords => {
			this.screenBounds.points.push([this.getX(coords), this.getY(coords)])

			mapScreenPoly.push([this.getX(coords), this.getY(coords)]);
		});

		//draw the map one time
		this.mapStrokeImg = _p.createGraphics(_p.width, _p.height);

		this.mapStrokeImg.stroke([20, 10, 255, this.opacity]);
		this.mapStrokeImg.strokeWeight(5);
		this.mapStrokeImg.fill([0, 0, 0, this.opacity]);

		//Draw map
		this.mapStrokeImg.beginShape()
		let coord
		for (let i = 0; i < mapScreenPoly.length; i++) {
			coord = mapScreenPoly[i];
			this.mapStrokeImg.vertex(coord[0], coord[1])
		}
		this.mapStrokeImg.endShape(this.mapStrokeImg.CLOSE)
	}

	setupGrid() {
		let includedSquares = []
		//draw Squares
		this.mapPopGrid = _p.createGraphics(_p.width, _p.height);
		this.mapPopGrid.noStroke()

		this.grid.forEach((square) => {
			//check every point if out of bounds
			let toExclude = true

			square.geometry.coordinates[0].forEach((point) => {
				let test = [this.getX(point), this.getY(point)]

				if (!DataType.exclude(test)) {
					toExclude = false
				}
			})
			//if totally out of bounds stop this iteration
			if (toExclude) {
				return;
			}

			includedSquares.push(square)

			if (_map.popBounds.min > square.properties.pop)
				_map.popBounds.min = square.properties.pop
			if (_map.popBounds.max < square.properties.pop)
				_map.popBounds.max = square.properties.pop
		})

		//popBounds have been made, calculate step
		let addedAmplitude = 0.7;
		let step = ((_map.popBounds.max - _map.popBounds.min) / (this.gridColors.length + 1)) * addedAmplitude

		includedSquares.forEach((square) => {
			//draw vertex in grid with adequat color
			let colorIndex = Math.floor((square.properties.pop - _map.popBounds.min) / step);
			colorIndex = colorIndex > this.gridColors.length - 1 ? this.gridColors.length - 1 : colorIndex;
			this.mapPopGrid.fill(_map.gridColors[colorIndex])

			//draw Vertex
			this.mapPopGrid.beginShape();
			square.geometry.coordinates[0].forEach((point) => {
				this.mapPopGrid.vertex(this.getX(point), this.getY(point))
			})
			this.mapPopGrid.endShape(this.mapPopGrid.CLOSE);
		})

		//draw ref 
		let refSize = 30
		for (let i = 0; i < this.gridColors.length; i++) {
			const color = this.gridColors[i];

			this.mapPopGrid.fill(color);
			this.mapPopGrid.textSize(34);
			this.mapPopGrid.text(i + 1, this.mapPopGrid.width - refSize - 30, i * refSize + refSize / 1.5);
			this.mapPopGrid.square(this.mapPopGrid.width - refSize, i * refSize, refSize)
		}
	}

	toggleMap() {
		this.mapOn = !this.mapOn
	}
	toggleLog() {
		this.logOn = !this.logOn
		document.getElementById("logs").innerHTML = "";
	}

	draw = (p, opa = false) => {
		//draw map
		p.push()

		if (this.mapOn) {
			p.image(this.mapStrokeImg, 0, 0);
		}
		else {
			p.fill([0, 0, 0, this.opacity])
			p.rect(0, 0, p.width, p.height)
		}
		p.pop()

		//
		if (this.logOn) {
			document.getElementById("logs").innerHTML = "S : Save / C : Carroyage / L : Logs / M : map / P : pause"
				+ "\r\n" +
				_dataMngr.getCurrentProjectedDate().toLocaleString('fr-FR', { timeZone: 'UTC' }) +
				"\r\n" +
				"nb data left to disp : " + _dataMngr.allDataToDisplay.length +
				"\r\n" +
				"nb data curr displayed : " + _dataMngr.nbDataDrawn
				+ "\r\n" +
				Math.round(_dataMngr.getTimeRef()) +
				"\r\n" +
				"Progress : " + Math.round((_dataMngr.phase_time_elapsed + _dataMngr.getTimeRef()) / _dataMngr.phases.reduce((a, b) => a + b.totalTimeLength, 0) * 100, 2) + "%" +
				"\r\n" +
				"vs:" + Math.round(vs()) +
				"\r\n" +
				"vc:" + Math.round(vc()) +
				"\r\n" +
				"ratioY " + this.internalGeoBounds.ratioY +
				"\r\n" +
				"ratioX " + this.internalGeoBounds.ratioX +
				"\r\n" +
				"phase : " + _dataMngr.phase +
				"\r\n" +
				"posX mouse : " + (p.mouseX / p.width)
		}
	}

	prepareMask = (p) => {
		//	this.mapMaskImg = p.loadImage('./res/mask1.png')

		//create balck mapMaskImg
		this.mapMaskImg = p.createGraphics(p.width, p.height);
		this.mapMaskImg.fill("#000000");
		//  this.mapMaskImg.stroke("#FF0000")
		this.mapMaskImg.beginShape();
		for (let i = 0; i < this.screenBounds.points.length; i++) {
			this.mapMaskImg.vertex(this.screenBounds.points[i][0], this.screenBounds.points[i][1])
		}

		//drawing black of mask, the finnish have to go through corners starting from upperLeft
		this.mapMaskImg.vertex(this.screenBounds.points[0][0], this.screenBounds.points[0][1])

		let cornersOrder = [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]];
		let cornerOffset = 1
		for (let i = 0; i < cornersOrder.length; i++) {
			const c = cornersOrder[(i + cornerOffset) % (cornersOrder.length - 1)];
			this.mapMaskImg.vertex(c[0] * this.mapMaskImg.width, c[1] * this.mapMaskImg.height)
		}
		this.mapMaskImg.endShape(this.mapMaskImg.CLOSE);
	}

	toggleGrid() {
		this.gridOn = !this.gridOn
	}
	drawMask(p) {
		p.image(this.mapMaskImg, 0, 0, p.width, p.height)

		//draw bounds mapMaskImg
		if (this.gridOn)
			p.image(this.mapPopGrid, 0, 0, p.width, p.height)
	}

	// !! Capital functions !!
	getX = (pos) => {
		//get ratio
		//normal case
		let position =
			(1 - this.internalGeoBounds.orientation) * (pos[0] - this.internalGeoBounds.minX) +
			this.internalGeoBounds.orientation * (pos[1] - this.internalGeoBounds.minY);

		//get screen pos
		return this.pos.x + this.internalGeoBounds.ratioX * position;
	}

	getY = (pos) => {
		//get ratio
		//normal case
		let position =

			(1 - this.internalGeoBounds.orientation) * (pos[1] - this.internalGeoBounds.minY) +
			this.internalGeoBounds.orientation * (pos[0] - this.internalGeoBounds.minX);

		//get screen pos
		return this.pos.y + this.internalGeoBounds.ratioY * position;
	}
}