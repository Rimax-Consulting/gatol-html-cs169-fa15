/** Initializes a bouncer game object
 * @param parent the containing elemnt (like a div or something)
 * @param width element width
 * @param height element height
 * @param num_choices the number of answer choices to choose from
 * @param state object varies for each game
 	potential state variables for Bouncers:
 		radius: the radius of the bouncer
 		numEnemies: pretty self explanatory
 */
var Bouncers = function(parent, width, height, num_choices, state, answerFunc) {
	// set up scene width and height
	this._width = width-2;
	this._height = height-2;

	// set up rendering surface
	this.renderer = new PIXI.CanvasRenderer(this._width, this._height);
	this.renderer.backgroundColor = 0x448ed3;
	this.parent = parent;
	this.parent.appendChild(this.renderer.view);

	// create the main stage to draw on
	this.stage = new PIXI.Stage();

	// physics shit
	this.world = new p2.World({
		gravity: [0,0]
	});

	this.foodBodies = [];
	this.foodGraphics = [];
	this.answerNumbers = [];
	this.answerChoices = [];

	this.bouncerRadius = 30;
	this.num_choices = num_choices;
	this.answerFunc = answerFunc;
	this.foodCreated = false;
	this.inMotion = false;

	var that = this;
	$("body").mousemove(function(e) {
		if (that.inMotion || !that.mouseClicked) {
			return;
		}
		try {
			that.stage.removeChild(that.arrow);
		} catch (err) {

		}
		that.arrow = new PIXI.Graphics();
		that.arrow.lineStyle(1, 0xFFFFFF, .7);
		that.arrow.moveTo(0,0);
		that.arrow.lineTo(0,Math.pow(Math.pow(e.pageX-that.mouseStart[0],2) + Math.pow(e.pageY-that.mouseStart[1],2), .4));
		that.arrow.lineTo(3, Math.pow(Math.pow(e.pageX-that.mouseStart[0],2) + Math.pow(e.pageY-that.mouseStart[1],2), .4) - 6);
		that.arrow.lineTo(-3, Math.pow(Math.pow(e.pageX-that.mouseStart[0],2) + Math.pow(e.pageY-that.mouseStart[1],2), .4) - 6);
		that.arrow.lineTo(0,Math.pow(Math.pow(e.pageX-that.mouseStart[0],2) + Math.pow(e.pageY-that.mouseStart[1],2), .4));
		that.arrow.x = that.bouncerGraphics.x;
		that.arrow.y = that.bouncerGraphics.y;
		that.arrow.rotation = -1*Math.atan2(e.pageX-that.mouseStart[0], e.pageY-that.mouseStart[1]);
		that.stage.addChild(that.arrow);

	});

	$("body").mousedown(function(e) {
		that.mouseClicked = true;
		that.mouseStart = [e.pageX, e.pageY];
	});
	$("body").mouseup(function(e) {
		if (that.inMotion) {
			return;
		}
		that.mouseClicked = false;
		that.inMotion = true;
		that.bouncer.velocity[0] = (e.pageX-that.mouseStart[0]) * 2;
		that.bouncer.velocity[1] = (e.pageY-that.mouseStart[1]) * 2;
		that.stage.removeChild(that.arrow);
	});

	// Start running the game.
	this.build();
};

Bouncers.prototype = {
	// Build scene and start animating 
	build: function() {
		//draw bouncer
		this.createBouncer();
		// create foods
		this.createFoods(this);
		// draw goals
		this.drawGoals();
		// start first frame
		requestAnimationFrame(this.tick.bind(this));
	},

	recordAnswer: function(num) {
		this.stage.removeChild(this.bouncerGraphics);

		for (i=0; i < this.foodGraphics.length; i++) {
			this.stage.removeChild(this.foodGraphics[i]);
			this.world.removeBody(this.foodBodies[i]);
		}
		for (i=0; i < this.answerChoices.length; i++) {
			this.stage.removeChild(this.answerChoices[i]);
		}
		this.stage.removeChild(this.questionText);

		this.foodBodies = [];
		this.foodGraphics = [];
		this.foodBodies = [];
		this.foodGraphics = [];
		this.answerChoices = [];
		this.answerNumbers = [];
		this.answerFunc(num);
	},

	createBouncer: function() {
		this.bouncer = new p2.Body({
			mass: 1,
			angularVelocity: 0,
			damping: .2,
			angularDamping: .5,
			position:[Math.random()*(this._width-140)+70,Math.random()*(this._height-140)+70]
		});
		this.bouncerShape = new p2.Circle({radius:20});
		this.bouncer.addShape(this.bouncerShape);
		this.world.addBody(this.bouncer);

		this.bouncerGraphics = new PIXI.Graphics();

		// draw the bouncer's body
		this.bouncerGraphics.moveTo(0,0);
		this.bouncerGraphics.beginFill(0xFFFFFF);
		this.bouncerGraphics.drawCircle(0,0,20);
		this.bouncerGraphics.endFill();

		this.bouncerGraphics.x = this.bouncer.position[0];
		this.bouncerGraphics.y = this.bouncer.position[1];

		this.stage.addChild(this.bouncerGraphics);
	},

	createFoods: function(that) {
		for (i = 0; i < this.num_choices; i++) {
			var x = Math.random()*(this._width-140)+70;
			var y = Math.random()*(this._height-140)+70;
			var tooClose = function(x,y,that) {
				// console.log(x,y);
				// console.log(that.bouncer.position, that.getDistance(x,y,that.bouncer));
				if (that.getDistance(x,y,that.bouncer) < 41) {
					return true;
				}
				if (typeof that.foodBodies == undefined) {
					// console.log("no foodbodies");
					return false;
				}
				for (var i = 0; i < that.foodBodies.length; i++) {
					// console.log(that.foodBodies[i].position, that.getDistance(x,y,that.foodBodies[i]));
					if (that.getDistance(x,y,that.foodBodies[i]) < 41) {
						return true;
					}
				}
				return false;
			};
			while (tooClose(x,y,that)) {
				// console.log(x,y);
				x = Math.random()*(this._width-140)+70;
				y = Math.random()*(this._height-140)+70;
			};
			// create the food physics body
			var food = new p2.Body({
				position: [x,y],
				mass: 1,
				damping: .2,
				angularDamping: 0,
				velocity: [0,0],
				angularVelocity: 0
			});
			var foodShape = new p2.Circle({radius: 20});
			food.addShape(foodShape);
			that.world.addBody(food);

			// Create the graphics
			var foodGraphics = new PIXI.Graphics();
			foodGraphics.beginFill(0xB6EE65);
			foodGraphics.drawCircle(0,0,20);
			foodGraphics.endFill();


			var answerText = new PIXI.Text(String.fromCharCode(65+i), {font: "24px Verdana", fill: 0x51771a});

			foodGraphics.x = x;
			foodGraphics.y = y;
			answerText.x = x-8;
			answerText.y = y-14;

			that.stage.addChild(foodGraphics);
			that.stage.addChild(answerText);

			that.foodBodies.push(food);
			that.foodGraphics.push(foodGraphics);
			that.answerChoices.push(answerText);
			that.answerNumbers.push(i);
		}
		that.foodCreated = true;
	},

	drawGoals: function() {
		var xList = [0, this._width, 0, this._width];
		var yList = [0, 0, this._height, this._height];
		for (var i = 0; i < 4; i++) {
			var goal = new PIXI.Graphics();
			goal.beginFill(0xFFFFFF, .5);
			goal.drawCircle(0,0,70);
			goal.endFill();
			goal.beginFill(this.renderer.backgroundColor);
			goal.drawCircle(0,0,60);
			goal.endFill();
			goal.beginFill(0xFFFFFF, .5);
			goal.drawCircle(0,0,50);
			goal.endFill();
			goal.beginFill(this.renderer.backgroundColor);
			goal.drawCircle(0,0,40);
			goal.endFill();
			goal.beginFill(0xFFFFFF, .5);
			goal.drawCircle(0,0,30);
			goal.endFill();
			goal.beginFill(this.renderer.backgroundColor);
			goal.drawCircle(0,0,20);
			goal.endFill();
			goal.beginFill(0xFFFFFF, .5);
			goal.drawCircle(0,0,10);
			goal.endFill();
			goal.x = xList[i];
			goal.y = yList[i];
			this.stage.addChild(goal);
		}
	},


	getDistance: function(a, b) {
		return Math.sqrt(Math.pow(a.position[0] - b.position[0], 2) + Math.pow(a.position[1] - b.position[1], 2));
	},

	getDistance: function(a, b, thing) {
		return Math.sqrt(Math.pow(a - thing.position[0], 2) + Math.pow(b - thing.position[1], 2));
	},

	updatePhysics: function () {

		this.bouncerGraphics.x = this.bouncer.position[0];
		this.bouncerGraphics.y = this.bouncer.position[1];

		if (this.bouncer.position[0] > this._width - this.bouncer.shapes[0].radius) {
			this.bouncer.velocity[0] *= -1;
		}
		if (this.bouncer.position[1] > this._height - this.bouncer.shapes[0].radius) {
			this.bouncer.velocity[1] *= -1;
		}
		if (this.bouncer.position[0] < this.bouncer.shapes[0].radius) {
			this.bouncer.velocity[0] *= -1;
		}
		if (this.bouncer.position[1] < this.bouncer.shapes[0].radius) {
			this.bouncer.velocity[1] *= -1;
		}


		// bounce foods
		for (i = 0; i < this.foodBodies.length; i++) {
			if (this.getDistance(0,0,this.foodBodies[i]) < 70 || this.getDistance(0,this._height,this.foodBodies[i]) < 70 
				|| this.getDistance(this._width,0,this.foodBodies[i]) < 70 || this.getDistance(this._width, this._height,this.foodBodies[i]) < 70) {
				this.recordAnswer(i);
			}
			if (this.foodBodies[i].position[0] > this._width - this.foodBodies[i].shapes[0].radius) {
				this.foodBodies[i].velocity[0] *= -1;
			}
			if (this.foodBodies[i].position[1] > this._height - this.foodBodies[i].shapes[0].radius) {
				this.foodBodies[i].velocity[1] *= -1;
			}
			if (this.foodBodies[i].position[0] < this.foodBodies[i].shapes[0].radius) {
				this.foodBodies[i].velocity[0] *= -1;
			}
			if (this.foodBodies[i].position[1] < this.foodBodies[i].shapes[0].radius) {
				this.foodBodies[i].velocity[1] *= -1;
			}
		}

		var nothingInMotion = true;
		for (var i = 0; i < this.foodBodies.length; i++) {
			this.foodGraphics[i].x = this.foodBodies[i].position[0];
			this.foodGraphics[i].y = this.foodBodies[i].position[1];

			this.answerChoices[i].x = this.foodBodies[i].position[0]-8;
			this.answerChoices[i].y = this.foodBodies[i].position[1]-14;

			// console.log(Math.pow(this.foodBodies[i].velocity[0],2) + Math.pow(this.foodBodies[i].velocity[1],2));
			if (Math.pow(this.foodBodies[i].velocity[0],2) + Math.pow(this.foodBodies[i].velocity[1],2) > 25) {
				// console.log("SUMTHIN STILL MOVIN BITCH");
				nothingInMotion = false;
			}
		}

		if (nothingInMotion && Math.pow(this.bouncer.velocity[0],2) + Math.pow(this.bouncer.velocity[1],2) < 15) {
			this.inMotion = false;
		}

		this.world.step(1/60);
	},


	//fires at the end of the gameloop to reset and redraw the canvas
	tick: function() {
		this.renderer.render(this.stage);
		requestAnimationFrame(this.tick.bind(this));
		this.updatePhysics();
	}
};

var BouncersMetaGame = function() {
	/**
	 * calculates score based on how many we got right and possibly how many we got wrong
	 */
	this.calculateScore = function(correct, index) {
		return 200*correct;
	};
	/** 
	 * returns object of radius and numEnemies based on game progress
	 */
	this.getMetaGame = function(correct, index, total) {
		var gravity = 4 + 10*index/total;
		return {gravity:gravity};
	};
	this.initializeGame = function(parent, width, height, num_choices, state, answerFunc) {
		if (state) {
			var Game = new Bouncers(parent, width, height, num_choices, state, answerFunc);
			return true;
		} else {
			return false;
		}
	};
	this.getTitle = function() {
		return "Bouncers";
	};
	this.getInstructions = function() {
		return "Click and drag the mouse to fire the cue ball. Make sure the correct answer lands in a pocket first!";
	};
	return {
		getMetaGame:this.getMetaGame,
		calculateScore:this.calculateScore,
		initializeGame:this.initializeGame,
		getTitle:getTitle,
		getInstructions:getInstructions
	};
};