var size = 10;
var shape = 0;
var colorCount = 5;
var s3;
var perlinSeed;
var strokeWidth = 1;
var baseColor = "#FFFFFF";
var spaceHue = 10, spaceSat = 10, spaceBri = 10;
var strokeHue = 20, strokeSat = 20, strokeBri = 20;

var colors = [];
var shapes = [];

//Export to SVG help
//https://forum.processing.org/two/discussion/27844/p5-js-export-to-svg.html

function updateVar () {
	// console.log("update var");
	window[this.attributes.var.nodeValue] = this.value; //update this element's value
	//update linked elemtents if they exist
	let thisElem = document.getElementById(this.id);
	if (thisElem.hasAttribute("linked")) {
		this.attributes.linked.nodeValue.split(",").forEach(linkID => {
			document.getElementById(linkID).value = this.value;
		});
	}
	drawPlane();
}

function setup() {
	var canvas = createCanvas(windowWidth * 0.5, windowWidth * 0.5);
	canvas.parent('sketch');
	colorMode(HSB, 360, 100, 100);
	background(240);
	frameRate(60);

	noSmooth();
	// defaultPrefs = loadStrings("data/defaultPrefs.txt");
	s3 = Math.sqrt(3);
	// lpShape = -1;

	let linked = {} //key-value list to hold any linked controls. Used to update one input when another linked one updates.
	/* Example
		linked = {"varName": ["textField", "slider"], ...}
	*/
	//Setup control inputs to update their variables
	document.querySelectorAll("input.updateVar").forEach(input=>{
		//Initialize the inputs with the current variable values
		let varName;
		try {
			varName = input.attributes.var.nodeValue;
			input.value = window[varName];
		} catch (error) {
			console.error("Error on input of id " + input.id + ": " + error);
		}
		input.addEventListener("change", updateVar); //Update when "done" changing (click off or enter)
		if (input.classList.contains("linked")) {
			if (!linked[varName]) {
				linked[varName] = [];
			}
			linked[varName].push(input.id);
		}
		// input.addEventListener("input", updateVar); //Alternate way, update on EVERY change (mid-typing)
	});

	//Setup linked controls
	Object.entries(linked).forEach(([_, list]) => {
		list.forEach(elemID => {
			let linkElem = document.getElementById(elemID);
			let otherList = [];
			list.forEach(otherID => {
				if (otherID != elemID) {
					otherList.push(otherID);
				}
			});
			linkElem.setAttribute("linked", otherList);
		});
	});

	// console.log();
	baseColor = document.getElementById("baseColorText").value;
	startHue = hue(color(baseColor));
	startSat = saturation(color(baseColor));
	startBri = brightness(color(baseColor));

	randomizePerlinSeed();
	drawPlane();
}

// function draw() {

// }

function randomizePerlinSeed() {
	perlinSeed = int(Math.random() * 999999999);
	noiseSeed(perlinSeed);
}

function drawPlane() {
	rectMode(CORNERS);
	background(255);

	if (strokeWidth > 0) {
	    strokeWeight(strokeWidth);
	    stroke(color(strokeHue, strokeSat, strokeBri));
	    strokeCap(PROJECT);
	} else {
	    noStroke();
	}

	let xCount, yCount;
	if (shape == 0 || shape == 1 || shape == 8) {
	    xCount = int(size * s3);
		yCount = int(size * 4 / 3);
	} else if (shape == 3 || shape == 5 || shape == 7) {
	    xCount = int(size);
		yCount = int(size) - 1;
	} else {
	    xCount = int(size) - 1;
		yCount = int(size) - 1;
	}

	genColors(round(colorCount));
	// console.log(colors);

	for (let y = 0; y <= yCount; y++) {
	    for (let x = 0; x <= xCount; x++) {
	        let leftTop = new pointData(x * height / size / 2 * s3 - (y % 2 ==  0 ? 0 : height / size / 4 * s3), y * height / size - height / size / 4 * y);
	        let top = new pointData((x * height / size / 2 * s3 - (y % 2 ==  0 ? 0 : height / size / 4 * s3)) + height / size / 4 * s3, y * height / size - height / size / 4 - height / size / 4 * y);
	        let rightTop = new pointData((x * height / size / 2 * s3 - (y % 2 ==  0 ? 0 : height / size / 4 * s3)) + height / size / 2 * s3, y * height / size - height / size / 4 * y);
	        let rightBottom = new pointData((x * height / size / 2 * s3 - (y % 2 ==  0 ? 0 : height / size / 4 * s3)) + height / size / 2 * s3, y * height / size + height / size / 2 - height / size / 4 * y);
	        let bottom = new pointData((x * height / size / 2 * s3 - (y % 2 ==  0 ? 0 : height / size / 4 * s3)) + height / size / 4 * s3, y * height / size + height / size * 3 / 4 - height / size / 4 * y);
	        let leftBottom = new pointData(x * height / size / 2 * s3 - (y % 2 ==  0 ? 0 : height / size / 4 * s3), y * height / size + height / size / 2 - height / size / 4 * y);
	        let center = new pointData((x * height / size / 2 * s3 - (y % 2 ==  0 ? 0 : height / size / 4 * s3)) + height / size / 4 * s3, y * height / size + height / size / 4 - height / size / 4 * y);
	        let squareTL = new pointData(x * height / size,y * height / size);
	        let squareTR = new pointData((x + 1) * height / size,y * height / size);
	        let squareBL = new pointData(x * height / size,(y + 1) * height / size);
	        let squareBR = new pointData((x + 1) * height / size,(y + 1) * height / size);
	        let squareOTL = new pointData(x * height / size - (y % 2 ==  0 ? 0 : height / size / 2),y * height / size);
	        let squareOTR = new pointData((x + 1) * height / size - (y % 2 ==  0 ? 0 : height / size / 2),y * height / size);
	        let squareOBL = new pointData(x * height / size - (y % 2 ==  0 ? 0 : height / size / 2),(y + 1) * height / size);
	        let squareOBR = new pointData((x + 1) * height / size - (y % 2 ==  0 ? 0 : height / size / 2),(y + 1) * height / size);
			
	        switch(shape) {
	            case 0 : //Equilateral Triangle
		               shapes.push(new Shape([leftTop, top, center]));
		               shapes.push(new Shape([top, rightTop, center]));
		               shapes.push(new Shape([rightTop, rightBottom, center]));
		               shapes.push(new Shape([rightBottom, bottom, center]));
		               shapes.push(new Shape([bottom, leftBottom, center]));
		               shapes.push(new Shape([leftBottom, leftTop, center]));
		               break;
			}
		}
	}

	shapes.forEach(shape => {
		fill(rColor(shape));
	    drawPoly(shape);
	});
}

function genColors(count) {
	colors = [];
	
	let startHue = hue(baseColor);
	let startSat = saturation(baseColor);
	let startBri = brightness(baseColor);
	//start with random HSB values for any value that is negative
	colors.push(color(startHue >= 0 ? startHue : random(0,360), startSat >= 0 ? startSat : random(0, 100), startBri >= 0 ? startBri : random(0,100)));
	
	let iHue = hue(colors.at(0));
	let hueCurrent = iHue;
	let iSat = saturation(colors.at(0));
	let satCurrent = iSat;
	let iBri = brightness(colors.at(0));
	let briCurrent = iBri;
	
	let mode = 0;
	switch(mode) {
	    case 0 : //Intermediate
			let spacingH;
			if (count != 0) {
				spacingH = 360 / count;
			} else {
				spacingH = 360;
			}
	        for (let i = 1; i < count; i++) {
	            hueCurrent = iHue + i * spacingH;
	            while(hueCurrent > 360) {
		               hueCurrent -= 360;
		           }
	            satCurrent = iSat - i * spaceSat;
	            while(satCurrent < 0) {
		               satCurrent += 100;
		           }
	            briCurrent = iBri - i * spaceBri;
	            while(briCurrent < 0) {
		               briCurrent += 100;
		           }
				colors.push(color(hueCurrent, satCurrent, briCurrent));
	        }
	        break;
	}
}

function rColor(shape) {
	c = colors.at(int(random(0,colors.length)));
	// switch(noiseMode) {
	// 	case 1 : //Color Mode
	// 		return colors.get(int(noise(shape.midPoint.x * perlinScale, shape.midPoint.y * perlinScale) * colors.size()));
	// 	case 2 : //Brightnes Tint Mode
	// 		return color(hue(c), saturation(c), noise(shape.midPoint.x * perlinScale, shape.midPoint.y * perlinScale) * 100);
	// 	case 3 : //Saturation Tint Mode
	// 		return color(hue(c), noise(shape.midPoint.x * perlinScale, shape.midPoint.y * perlinScale) * 100, brightness(c));
	// 	default:
	// 		return c;
	// }
	return c;
}

function drawPoly(s) {
	beginShape();
	if (s.pointData.length == 2) { //Assume 2 points = rectangle
		vertex(s.pointData[0].x, s.pointData[0].y);
		vertex(s.pointData[1].x, s.pointData[0].y);
		vertex(s.pointData[1].x, s.pointData[1].y);
		vertex(s.pointData[0].x, s.pointData[1].y);
	} else {
		s.pointData.forEach(point => vertex(point.x, point.y));
	}
	endShape(CLOSE);
}

class pointData {	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

// const ShapeType = {
// 	HEX: 'HEX',
// 	TRI: 'TRI',
// 	SQUARE: 'SQUARE',
// 	QUAD: 'QUAD'
// };

class Shape {	
	constructor(pointData, depth = 0) {
	    this.pointData = pointData;
		this.depth = depth;
	}
}