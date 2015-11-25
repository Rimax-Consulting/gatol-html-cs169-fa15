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
		gravity: [0,-2000]
	});

	this.foodBodies = [];
	this.foodGraphics = [];
	this.answerNumbers = [];
	this.answerChoices = [];

	this.bouncerRadius = 30;
	this.num_choices = num_choices;
	this.answerFunc = answerFunc;
	this.foodCreated = false;

	// var that = this;
	// $("body").mousemove(function(e) {

	// });

	// $("body").mousedown(function(e) {

	// });

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
		// draw enemies
		//this.createEnemies();
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
			damping: .3,
			angularDamping: .5,
			position:[Math.random()*this._width,Math.random()*this._height]
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
			var x = Math.random()*(this._width-30)+15;
			var y = Math.random()*(this._height-30)+15;
			// create the food physics body
			var food = new p2.Body({
				position: [x,y],
				mass: 1,
				damping: .3,
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


	getDistance: function(a, b) {
		return Math.sqrt(Math.pow(a.position[0] - b.position[0], 2) + Math.pow(a.position[1] - b.position[1], 2));
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

		for (var i = 0; i < this.foodBodies.length; i++) {
			this.foodGraphics[i].x = this.foodBodies[i].position[0];
			this.foodGraphics[i].y = this.foodBodies[i].position[1];

			this.answerChoices[i].x = this.foodBodies[i].position[0]-8;
			this.answerChoices[i].y = this.foodBodies[i].position[1]-14;
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