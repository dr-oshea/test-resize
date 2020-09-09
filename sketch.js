// Canvas
let width = window.innerWidth;	// width of canvas
let height = window.innerHeight-20;	// height of canvas
let comps = [];
let tex = 0;

// Define locations on Canvas
let w_XS = (1/2)*width;
let h_XS = (2/3)*height;
let x0_XS = w_XS/2;
let y0_XS = h_XS/2;

let w_MC = (1/2)*width;
let h_MC = (2/3)*height;
let x0_MC = 3*width/4;
let y0_MC = y0_XS;

let w_DB = width;
let h_DB = height-h_XS;
let x0_DB = (1/2)*w_DB;
let y0_DB = height-(1/2)*h_DB;

// Define DOS objects
var sliderB1;
var sliderB2;
var sliderB3;
var sliderR;
var buttonR0;
var buttonRP;
var selXS;
var chkCentroid;

// Initial Origin position
let Ox = 1.0*x0_XS;
let Oy = 1.0*y0_XS;

// Defining initial cross-section dimensions
let b1 = 50;
let h1 = 250;
let x1 = x0_XS;
let y1 = y0_XS;

let b2 = 250;
let h2 = 50;
let x2 = x0_XS;
let y2 = y0_XS-h1/2-h2/2;

let b3 = 250;
let h3 = 50;
let x3 = x0_XS;
let y3 = y0_XS+h1/2+h2/2;

let clkd1 = false;
let clkd3 = false;
let clkd4 = true;
let clkdRP = false;
let lock = false;

// Set up the canvas and DOM objects
function setup() {
		
	// Create the Canvas
	createCanvas(windowWidth, windowHeight);
	
	// Reset Tex Items
	tex1 = createP(); tex2 = createP(); tex3 = createP();
	tex4 = createP();
	
	// Create Dashboard (Sliders + Switches)
	createDashboard();
	
	// Reset the Canvas
	resetSpace();
	
	// Re-draw scene upon change of DOM elements
	buttonRO.mousePressed(buttonClick_RO);
	buttonRP.mousePressed(buttonClick_RP);
	buttonOC.mousePressed(buttonClick_OC);
	buttonC1.mousePressed(buttonClick_C1);
	buttonLines.mousePressed(buttonClick_Lines);
	button2ndMom.mousePressed(buttonClick_Calcs);
	sliderB1.input(resetSpace);
	sliderB2.input(resetSpace);
	sliderB3.input(resetSpace);
	sliderR.input(resetSpace);
	selXS.changed(changeXS);
	chkCentroid.changed(lockCentroid);
	
	
	
}

// Create Dashboard area with sliders and toggles
function createDashboard() {
	
	push()
	
		// Width of Web
		sliderB1 = createSlider(0.5*b1,2*b1,b1,1);
		sliderB1.position(x0_DB-0.95*w_DB/2,y0_DB-0.8*h_DB/2);
		sliderB1.style('width','175px');
		
		// Width of Top Flange
		sliderB2 = createSlider(0.5*b2,1.5*b2,b2,1);
		sliderB2.position(x0_DB-0.95*w_DB/2,y0_DB-0.65*h_DB/2);
		sliderB2.style('width','175px');
		
		// Width of Bottom Flange
		sliderB3 = createSlider(0.5*b3,1.5*b3,b3,1);
		sliderB3.position(x0_DB-0.95*w_DB/2,y0_DB-0.50*h_DB/2);
		sliderB3.style('width','175px');
		
		// Rotation of axes
		sliderR = createSlider(-90,90,0,0.05);
		sliderR.position(x0_DB-0.95*w_DB/2,y0_DB-0.35*h_DB/2);
		sliderR.style('width','175px');
		
		// Reset Angle
		buttonRO = createButton('Reset Angle');
		buttonRO.position(x0_DB-0.94*w_DB/2,y0_DB-0.1*h_DB/2);
		
		// Show Calculations
		button2ndMom = createButton('Calculate 2nd Mom. of Area');
		button2ndMom.position(x0_DB-0.94*w_DB/2,y0_DB+0.1*h_DB/2);
		
		// Show Centroid of Shapes
		buttonC1 = createButton('Show Centroid of Parts');
		buttonC1.position(x0_DB-0.94*w_DB/2,y0_DB+0.3*h_DB/2);
		
		// Draw lines of centroids of shapes
		buttonLines = createButton('Lines');
		buttonLines.position(x0_DB-0.94*w_DB/2+160,y0_DB+0.3*h_DB/2);
	
		// Place Origin at Centroid
		buttonOC = createButton('Place Origin at Centroid');
		buttonOC.position(x0_DB-0.94*w_DB/2,y0_DB+0.5*h_DB/2);
		
		// Rotate Axes to Principal Orientation
		buttonRP = createButton('Principal Orientation');
		buttonRP.position(x0_DB-0.94*w_DB/2,y0_DB+0.7*h_DB/2);
		
		// Select Cross-Section Type
		selXS = createSelect();
		selXS.position(x0_DB-0.94*w_DB/2,y0_DB-0.95*h_DB/2);
		selXS.option('I Section');
		selXS.option('T Section');
		selXS.option('Box Section');
		selXS.option('L Section');
		selXS.selected('I Section');
		
		// Checkbox for Lock Origin to Centroid
		chkCentroid = createCheckbox('Lock',false)
		chkCentroid.position(x0_DB-0.94*w_DB/2+170,y0_DB+0.5*h_DB/2);
		
	
	pop()
}

// Reset the Canvas to the initial state each time a change is made
function resetSpace() {
	
	background(250);
	
	// Plot cross-section
	
	if (lock) {
		calcTotalCentroid();
		Ox = xbar;
		Oy = ybar;
	}
	
	plotSection();
	
	// Plot dashboard sections
	noFill()
	rectMode(CENTER);
	stroke(0);
	strokeWeight(2);
	
	// Cross-section zone
	push()
		translate(x0_XS,y0_XS)			
		rect(0,0,2*x0_XS,2*y0_XS)
	pop()
	
	// Mohr zone
	push()
		translate(x0_MC,y0_MC)
		fill(250);
		rect(0,0,2*x0_XS,2*y0_XS)
	pop()
	
	// Tool zone
	push()
		translate(x0_DB,y0_DB)
		fill(240);
		rect(0,0,width,2*(height-y0_DB))
	pop()
	
	
	
	// Plot Mohr's circle
	plotMohr();	
	
	
	// Plot Calculations
	if (clkd4 == true) {
		plotCalcs();
	}
	
	// Display current angle
	push();
		strokeWeight(1);
		stroke(0);
		text(nfc(sliderR.value().toFixed(2))+' deg',x0_DB-0.95*w_DB/2+180,y0_DB-0.30*h_DB/2+5);
	pop();
	
}

// Plot the cross-section shape
function plotSection() {
		
	let typeXS = selXS.value();
	
	
	if (typeXS == 'I Section') {
		
		// Plot I cross Section
		b1 = sliderB1.value();
		b2 = sliderB2.value();
		b3 = sliderB3.value();
		
		comps[0] = new Component(x1,y1,b1,h1);
		comps[1] = new Component(x2,y2,b2,h2);
		comps[2] = new Component(x3,y3,b3,h3);		
		
	} else if (typeXS == 'T Section') {

		// Plot T cross Section
		
		b1 = sliderB1.value();
		b2 = sliderB2.value();
		b3 = sliderB3.value();
		
		comps[0] = new Component(x1,y1,b1,h1);
		comps[1] = new Component(x2,y2,b2,h2);

	} else if (typeXS == 'Box Section') {

		// Plot Box cross Section
		comps[0] = new Component(x1-100,y1,b1,h1);
		comps[1] = new Component(x1+100,y1,b1,h1);
		comps[2] = new Component(x2,y2,b2,h2);
		comps[3] = new Component(x3,y3,b3,h3);

	} else if (typeXS == 'L Section') {

		// Plot L cross Section
		comps[0] = new Component(x1-100,y1,b1,h1);
		comps[1] = new Component(x3,y3,b3,h3);
		
	}
	
	// Draw the Cross Section
	beginShape();
		
		rectMode(CENTER);
		fill(200,200,255);
		stroke(0);
		strokeWeight(1.5);
		
		// Rectangle 1 (centre Web)	
		for (let i = 0; i < comps.length; i++) {
			rect(comps[i].x0,comps[i].y0,comps[i].w,comps[i].h)
		}

	endShape();
		
	// Plot the origin
	plotOrigin();
	
	// Plot centroids of each shape if button is on
	if (clkd1 == true) {
		plotCentroids();
	}
	
	// Plot centroids of composite shape is button is on
	//if (clkd2 == true) {
	//	plotTotalCentroid();
	//}
	
	
}


function plotMohr() {
	
	let localWidth = w_MC;
	let localHeight = h_MC;
	let diameter = min(0.45*localHeight,0.45*localWidth)
	
	push()
	
		translate(x0_MC,y0_MC)
		noFill();
		
		// Initial Circle and Axes (doesnt need to change shape)
		strokeWeight(0.5);
		line(-0.8*localWidth/2,-0.9*localHeight/2,-0.8*localWidth/2,0.9*localHeight/2);
		line(-0.9*localWidth/2,0,0.9*localWidth/2,0);
		strokeWeight(2);
		circle(0,0,diameter);
	
		// Updating locations of circles based on rotation of reference axes
		[IxxT, IyyT, IxyT, IuuT, IvvT, IuvT] = calc2ndMom();	
		Ipr1 = 0.5*(IxxT+IyyT) + sqrt(((IxxT-IyyT)/2)**2+IxyT**2);
		Ipr2 = 0.5*(IxxT+IyyT) - sqrt(((IxxT-IyyT)/2)**2+IxyT**2);
		IxyM = (Ipr1-Ipr2)/2;
		
		// Need to normalise so that largest possible Ixx and Iyy are the radius, then for any other value, you can find coordinates and plot the two little circles.
		c1x = map(IuuT,Ipr2,Ipr1,-diameter/2,diameter/2);
		c1y = map(IuvT,-IxyM,IxyM,-diameter/2,diameter/2);
		c2x = map(IvvT,Ipr2,Ipr1,-diameter/2,diameter/2);
		c2y = map(-IuvT,-IxyM,IxyM,-diameter/2,diameter/2);
		
		push()
			strokeWeight(2.5)
			line(c1x,c1y,c2x,c2y);
		pop()
	
		push()
			stroke(0)
			fill(0,0,255)	
			circle(c1x,c1y,0.05*diameter)
		pop()
		
		push()
			stroke(0)
			fill(255,0,0)
			circle(c2x,c2y,0.05*diameter)
		pop()	
		
		// Plot labels etc..
		fill(0);
		stroke(0);
		strokeWeight(1);
		textStyle(ITALIC);
		textAlign(RIGHT,CENTER);
		textSize(16);
		text('Ixx,Iyy',0.8*localWidth/2,-0.05*localHeight/2);
		textAlign(LEFT,CENTER)
		text('+Ixy',-0.75*localWidth/2,-0.9*localHeight/2);
		text('-Ixy',-0.75*localWidth/2,+0.9*localHeight/2);
		
	pop()
}


// Plot the Origin and Coordinate axes
function plotOrigin() {
	
	fill(0);
	
	let angle = -sliderR.value()*PI/180;
	let lineLength = w_DB/8;
	
	origin = createVector(Ox,Oy);
	
	push();
		strokeWeight(2);
		circle(origin.x,origin.y,5);
		push();
		translate(origin.x,origin.y)
		push()
			rotate(angle)
			//stroke(0,0,255)
			//line(-lineLength,0,lineLength,0)
			drawArrow(0,0,lineLength,0, 'blue', 6)
			rotate(HALF_PI)
			//stroke(255,0,0)
			//line(-lineLength,0,lineLength,0)
			drawArrow(0,0,-lineLength,0, 'red', 6)
		pop()
		strokeWeight(0.5);
		stroke(0,0,0,100);
		if (clkd1 && clkd3) {
			line(-10*lineLength,0,10*lineLength,0)
			line(0,-10*lineLength,0,10*lineLength)
		} else {
			line(-lineLength,0,lineLength,0)
			line(0,-lineLength,0,lineLength)
		}
			
	pop();
	
	push();
		strokeWeight(0.5);
		textStyle(ITALIC);
		text('O',origin.x-15,origin.y-5);
	pop();
	
}

function plotCentroids () {

	colVec = ['darkgreen','coral','darkmagenta','black'];
	
	for (let i = 0; i < comps.length; i++) {
		fill(colVec[i]);
		stroke(colVec[i]);
		strokeWeight(0.8);
		circle(comps[i].x0,comps[i].y0,5);
		
		// Draw lines if switched on
		if (clkd3 == true) {
			push();
			//rotate(sliderR.value());
			line(Ox,comps[i].y0,comps[i].x0,comps[i].y0);
			line(comps[i].x0,Oy,comps[i].x0,comps[i].y0);
			if (abs(comps[i].x0-Ox) > 20) {
				text('x'+(i+1)+' = '+nfc(comps[i].x0-Ox,0),Ox+(comps[i].x0-Ox)/2,comps[i].y0-10);
			}
			if (abs(comps[i].y0-Oy) > 20) {
				text('y'+(i+1)+' = '+nfc(Oy-comps[i].y0,0),comps[i].x0+10,Oy+3*(comps[i].y0-Oy)/4);
			}
			pop();
		}
		
	}
	
}

function plotTotalCentroid() {
	
	fill(0);
	
	push();
	strokeWeight(2);
	pC = createVector(xbar,ybar);
	circle(pC.x,pC.y,7);
	pop()
	
	push();
	strokeWeight(1.5);
	fill('red');
	stroke('red');
	if (clkd3 == true) {
		line(Ox,ybar,xbar,ybar);
		line(xbar,Oy,xbar,ybar);
		strokeWeight(0.5);
		if (abs(xbar-Ox) > 20) {
			text('xbar = '+nfc(xbar-Ox,0),Ox+(xbar-Ox)/2,ybar-10);
		}
		if (abs(ybar-Oy) > 20) {
			text('ybar = '+nfc(Oy-ybar,0),xbar+10,Oy+3*(ybar-Oy)/4);
		}
	}
	pop();
	
}


// Display the caluclations
function plotCalcs() {
	
	inc = h_DB/19;
		
	push();
		stroke(0);
		strokeWeight(1);
		fill(0);
		textSize(inc);
		textAlign(LEFT,TOP);
		translate(x0_DB,y0_DB-h_DB/2);
		calc2ndMom();
		calcTotalCentroid();
		
		// Second Moment of Areas for Rotated Coordinate System
		tex1.remove();
		tex1 = createP();
		tex1.style('font-size', '16px');
		tex1.position(x0_DB+2*inc, y0_DB-h_DB/2+2*inc);
		katex.render('I_{x\'x\'} = \\sum \\left(I_{xx} + A dy^{2}\\right) = '+convertToSciNot(IuuT,4), tex1.elt);
		
		
		tex2.remove();
		tex2 = createP();
		tex2.style('font-size', '16px');
		tex2.position(x0_DB+2*inc, y0_DB-h_DB/2+6*inc);
		katex.render('I_{y\'y\'} = \\sum \\left(I_{yy} + A dx^{2}\\right) = '+convertToSciNot(IvvT,4), tex2.elt);
		
		
		tex3.remove();
		tex3 = createP();
		tex3.style('font-size', '16px');
		tex3.position(x0_DB+2*inc, y0_DB-h_DB/2+10*inc);
		katex.render('I_{x\'y\'} = \\sum \\left(I_{xy} + A dx dy\\right) = '+convertToSciNot(IuvT,4), tex3.elt);
		
		
		//text('Ixx = \u03A3 ( Ix\'x\' + A*dy^2 )  = '+convertToSciNot(IuuT,4)+'  mm4',2*inc,2*inc);
		//text('      = '+convertToSciNot(IuuT,4)+'  mm4',2*inc,4.0*inc);
		//text('Iyy = \u03A3 ( Iy\'y\' + A*dx^2 )  = '+convertToSciNot(IvvT,4)+'  mm4',2*inc,6*inc);
		//text('      = '+convertToSciNot(IvvT,4)+'  mm4',20,160);
		//text('Ixy = \u03A3 ( Ix\'y\' + A*dx*dy ) = '+convertToSciNot(IuvT,4)+'  mm4',2*inc,10*inc);
		//text('      = '+convertToSciNot(IuvT,4)+'  mm4',20,240);
		
		
		// Total Centroid
		tex4.remove();
		tex4 = createP();
		tex4.style('font-size', '18px');
		tex4.position(x0_DB+w_DB/4+8*inc, y0_DB-h_DB/2+2*inc);
		katex.render('\\bar{x} = \\frac{\\sum x_{i} A_{i}}{\\sum A_{i}} = '+ xbar, tex4.elt);
		
		
		
	pop();
	
}

// Changing the cross-section type that is being analysed
function changeXS() {
	
	comps.length = 0;
	clkd1 = false;
	clkd3 = false;
	clkd4 = true;
	lock = false;
	sliderR.value(0);
	
	// Set defaults for each XS type
	if (selXS.value() == 'I Section') {
		b1 = 50;
		h1 = 250;
		b2 = 250;
		h2 = 50;
		b3 = 250;
		h3 = 50;
	} else if (selXS.value() == 'T Section') {
		b1 = 50;
		h1 = 250;
		b2 = 250;
		h2 = 50;
	}
	
	resetSpace();
	
}

function lockCentroid() {
	
	if (chkCentroid.checked()) {
		lock = true;
	} else {
		lock = false;
	}
	 resetSpace();
}



// Clicking on button C1
function buttonClick_C1() {
	
	if (clkd1 == true) {
		clkd1 = false;
		resetSpace();
	} else if (clkd1 == false) {
		clkd1 = true;
		resetSpace();
	}
	
}

// Clicking on button C2
function buttonClick_C2() {
	
	if (clkd2 == true) {
		clkd2 = false;
		resetSpace();
	} else if (clkd2 == false) {
		clkd2 = true;
		resetSpace();
	}
	
}

// Clicking on button Lines
function buttonClick_Lines() {
	
	if (clkd3 == true) {
		clkd3 = false;
		resetSpace();
	} else if (clkd3 == false) {
		clkd3 = true;
		resetSpace();
	}
	
}

// Clicking on button 2nd Mom
function buttonClick_Calcs() {
	
	if (clkd4 == true) {
		clkd4 = false;
		resetSpace();
	} else if (clkd4 == false) {
		clkd4 = true;
		resetSpace();
	}
	
}

// Calculate coordinates of centroid for entire shape
function calcTotalCentroid() {
	
	let numerX = 0;
	let numerY = 0;
	let denom = 0;
	for (let i = 0; i < comps.length; i++) {
		numerX += comps[i].x0 * comps[i].A;
		numerY += comps[i].y0 * comps[i].A;
		denom += comps[i].A;
	}
	
	xbar = numerX/denom;
	ybar = numerY/denom;
	
}

// Calculate Second Moment of Area values
function calc2ndMom() {
	
	let IxxT = 0;
	let IyyT = 0;
	let IxyT = 0;
	
	for (let i = 0; i < comps.length; i++) {
		IxxT += comps[i].Ixx + comps[i].PAxx;
		IyyT += comps[i].Iyy + comps[i].PAyy;
		IxyT += comps[i].Ixy + comps[i].PAxy;
	}
	
	let angle = sliderR.value()*PI/180;
	IuuT = IxxT*cos(angle)*cos(angle)+IyyT*sin(angle)*sin(angle)-2*IxyT*sin(angle)*cos(angle);
	IvvT = IyyT*cos(angle)*cos(angle)+IxxT*sin(angle)*sin(angle)+2*IxyT*sin(angle)*cos(angle);
	IuvT = (IxxT-IyyT)*sin(angle)*cos(angle)+IxyT*(cos(angle)**2-sin(angle)**2);
	
	return [IxxT, IyyT, IxyT, IuuT, IvvT, IuvT];
	
}

// Clicking "Place Origin at Centroid" Button
function buttonClick_OC() {
	
	calcTotalCentroid();
	Ox = xbar;
	Oy = ybar;
	clkd1=false;
	clkd3=false;
	buttonClick_RO();
	
}

// Clicking "Reset Angle" Button
function buttonClick_RO() {
	sliderR.value(0);
	resetSpace();
}

// Clicking "Principal Orientation" Button
function buttonClick_RP() {
	calc2ndMom();
	prin_angle = (1/2)*atan(-2*IxyT/(IxxT-IyyT));
	sliderR.value(prin_angle*180/PI);
	resetSpace();
}

// Clicking on Cross-Section zone defines new origin
function mouseReleased() {
	
	if (mouseX > 0 && mouseX < w_XS && mouseY < height-h_DB && mouseY > 0 && lock == false) {
		dragging = true;
		Ox = mouseX;
		Oy = mouseY;
		buttonClick_RO();
	}
	
}

// draw an arrow for a vector at a given base position
function drawArrow(x1, y1, x2, y2, myColor, arrowSize) {
	
	let base = createVector(x1,y1)
	let  vec = createVector(x2,y2);
	
	push();
	stroke(myColor);
	strokeWeight(1.5);
	fill(myColor);
	translate(base.x, base.y);
	line(0, 0, vec.x, vec.y);
	rotate(vec.heading());
	translate(vec.mag() - arrowSize, 0);
	triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	pop();
	
}

function convertToSciNot(number, precision) {
    power = Math.round(Math.log10(abs(number)));
	//console.log(power);
    mantissa = (number / (Math.pow(10,Math.abs(power)))).toFixed(precision);
    if (number ==0){
      return 0}
  	else 
  	{return mantissa + ' \\times 10^' + power}
}

function windowResized() { 
    resizeCanvas(window.innerWidth, window.innerHeight); 
	resetSpace();
}
