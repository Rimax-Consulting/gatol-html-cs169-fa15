/** Initializes a shooterber game object
 * @param parent the containing elemnt (like a div or something)
 * @param width element width
 * @param height element height
 * @param num_choices the number of answer choices to choose from
 * @param state object varies for each game
 	potential state variables for Shooters:
 		radius: the radius of the shooter
 		numEnemies: pretty self explanatory
 */
var Shooters = function(parent, width, height, num_choices, state, answerFunc) {
	console.log({parent: parent, width:width, height:height, num_choices: num_choices, state:state, answerFunc:answerFunc})
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
		gravity: [0,10]
	});

	// speed
	this.speed = state.gravity*10;
	this.turnSpeed = 5;

	this.foodBodies = [];
	this.foodGraphics = [];
	this.answerNumbers = [];
	// this.enemyBodies = [];
	// this.enemyGraphics = [];
	this.answerChoices = [];

	this.shooterRadius = 30;
	this.interval = state.interval || 1000;
	this.num_choices = num_choices;
	this.answerFunc = answerFunc;

	var that = this;
	$("body").mousemove(function(e) {
		that.shooterGraphics.rotation = Math.atan2(e.pageX - that.shooterGraphics.x, that.shooterGraphics.y - e.pageY);
	});

	$("body").mousedown(function(e) {
		that.clicked = true;
	});

	// Start running the game.
	this.build();
};

Shooters.prototype = {
	// Build scene and start animating 
	build: function() {
		// create foods
		this.createFoods(this);
		//draw shooter
		this.createShooter();
		// draw enemies
		//this.createEnemies();
		// start first frame
		requestAnimationFrame(this.tick.bind(this));
	},

	recordAnswer: function(num) {
		this.stage.removeChild(this.shooterGraphics);

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
		clearInterval(this.foodMaker);
	},

	createShooter: function() {

		this.shooterGraphics = new PIXI.Graphics();

		// draw the shooter's body
		this.shooterGraphics.moveTo(0,0);
		this.shooterGraphics.beginFill(0xFFFFFF);
		this.shooterGraphics.drawCircle(0,0,60);
		this.shooterGraphics.drawRect(-20,-75,40,75);
		this.shooterGraphics.drawRect(-8,-110,16,110);
		this.shooterGraphics.drawRect(-10,-110,20,15);
		this.shooterGraphics.endFill();

		this.shooterGraphics.x = this._width/2;
		this.shooterGraphics.y = this._height;

		this.stage.addChild(this.shooterGraphics);
	},

	createFoods: function(that) {
		for (i = 0; i < this.num_choices; i++) {
			var x = this._width*((i+.5)/this.num_choices);
			var y = 10;
			var vx = 0;
			var vy = 6 + Math.random()*10;
			var va = 0;//(Math.random() - 0.5) * that.speed/100;
			// create the food physics body
			var food = new p2.Body({
				position: [x,y],
				mass: 1,
				damping: 0,
				angularDamping: 0,
				velocity: [vx, vy],
				angularVelocity: va
			});
			var foodShape = new p2.Circle({radius: 2});
			food.addShape(foodShape);
			that.world.addBody(food);

			// Create the graphics
			var foodGraphics = new PIXI.Graphics();
			foodGraphics.beginFill(0xB6EE65);
			foodGraphics.drawCircle(0,0,20);
			foodGraphics.endFill();


			var answerText = new PIXI.Text(String.fromCharCode(65+i), {font: "24px Verdana", fill: 0x51771a});

			that.stage.addChild(foodGraphics);
			that.stage.addChild(answerText);

			that.foodBodies.push(food);
			that.foodGraphics.push(foodGraphics);
			that.answerChoices.push(answerText);
			that.answerNumbers.push(i);
		}
	},


	handleKeys: function (key, state) {
		switch(key) {
			case 65:
			case 37:
			this.keyLeft = state;
			break;
			case 68:
			case 39:
			this.keyRight = state;
			break;
		}
	},


	getDistance: function(a, b) {
		return Math.sqrt(Math.pow(a.position[0] - b.position[0], 2) + Math.pow(a.position[1] - b.position[1], 2));
	},

	updatePhysics: function () {


		// make sure out-of-bounds foods are deleted, end when one food reaches the bottom
		spliceIndices = [];
		for (i = 0; i < this.foodBodies.length; i++) {
			if (this.foodBodies[i].position[0] > this._width - this.foodBodies[i].shapes[0].radius) {
				this.foodBodies[i].velocity[0] *= -1;
			}
			if (this.foodBodies[i].position[1] > this._height + this.foodBodies[i].shapes[0].radius+20) { // modifying this to make ball disappear
				this.foodBodies[i].velocity[1] *= 0;
				this.recordAnswer(this.answerNumbers[i]);
			}
			if (this.foodBodies[i].position[0] < this.foodBodies[i].shapes[0].radius) {
				this.foodBodies[i].velocity[0] *= -1;
			}
			if (this.foodBodies[i].position[1] < this.foodBodies[i].shapes[0].radius) {
				this.foodBodies[i].velocity[1] *= -1;
			}
		}

		for (i = 0; i < spliceIndices.length; i++) {
			this.world.removeBody(this.foodBodies[spliceIndices[i]]);
			this.stage.removeChild(this.foodGraphics[spliceIndices[i]]);
			this.foodBodies.splice(spliceIndices[i], 1);
			this.foodGraphics.splice(spliceIndices[i], 1);
			this.answerChoices.splice(spliceIndices[i], 1);
			this.answerNumbers.splice(spliceIndices[i], 1);
		}


		// console.log([this.mouseX, this.mouseY]);
		// console.log(Math.atan2(this.mouseX - this.shooterGraphics.x, -this.mouseY + this.shooterGraphics.y)*180/Math.PI);

		// update food positions
		for (var i = 0; i < this.foodBodies.length; i++) {
			this.foodGraphics[i].x = this.foodBodies[i].position[0];
			this.foodGraphics[i].y = this.foodBodies[i].position[1];

			this.answerChoices[i].x = this.foodBodies[i].position[0]-8;
			this.answerChoices[i].y = this.foodBodies[i].position[1]-14;
		}

		// // update enemy positions
		// for (var i = 0; i < this.enemyBodies.length; i++) {
		// 	this.enemyGraphics[i].x = this.enemyBodies[i].position[0];
		// 	this.enemyGraphics[i].y = this.enemyBodies[i].position[1]-19;
		// }


		this.world.step(1/60);
	},


	//fires at the end of the gameloop to reset and redraw the canvas
	tick: function() {
		this.renderer.render(this.stage);
		requestAnimationFrame(this.tick.bind(this));
		this.updatePhysics();
	}
};

var ShootersMetaGame = function() {
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
		var incorrect = index - correct;
		var gravity = 200 + 600*index/total;
		var interval = 1500 / Math.pow(((total + index)/total), 2.5);
		return {gravity:gravity, interval:interval};
	};
	this.initializeGame = function(parent, width, height, num_choices, state, answerFunc) {
		if (state) {
			var Game = new Shooters(parent, width, height, num_choices, state, answerFunc);
			return true;
		} else {
			return false;
		}
	};
	this.getTitle = function() {
		return "Shooters";
	};
	this.getInstructions = function() {
		return "Use the mouse to aim the gun and click to shoot. Make sure the correct answer lands first by shooting the wrong answers!";
	};
	return {
		getMetaGame:this.getMetaGame,
		calculateScore:this.calculateScore,
		initializeGame:this.initializeGame,
		getTitle:getTitle,
		getInstructions:getInstructions
	};
};