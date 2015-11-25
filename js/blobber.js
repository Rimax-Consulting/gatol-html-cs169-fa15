/** Initializes a blobber game object
 * @param parent the containing elemnt (like a div or something)
 * @param width element width
 * @param height element height
 * @param num_choices the number of answer choices to choose from
 * @param state object varies for each game
 	potential state variables for Blobber:
 		radius: the radius of the blob
 		numEnemies: pretty self explanatory
 */
var Blobbers = function(parent, width, height, num_choices, state, answerFunc) {
	console.log({parent: parent, width:width, height:height, num_choices: num_choices, state:state, answerFunc:answerFunc})
	// set up scene width and height
	this._width = width-2;//window.innerWidth - 4;
	this._height = height-2;//window.innerHeight - 4;

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

	// speed
	this.speed = 3000;
	this.turnSpeed = 5;

	window.addEventListener('keydown', function(event) {
		this.handleKeys(event.keyCode, true);
	}.bind(this), false);	
	window.addEventListener('keyup', function(event) {
		this.handleKeys(event.keyCode, false);
	}.bind(this), false);

	this.foodBodies = [];
	this.foodGraphics = [];
	this.enemyBodies = [];
	this.enemyGraphics = [];
	this.answerChoices = [];

	this.blobRadius = state.radius || 40;
	this.numEnemies = state.numEnemies || 0;
	this.num_choices = num_choices;
	this.answerFunc = answerFunc;

	// Start running the game.
	this.build();
};

Blobbers.prototype = {
	// Build scene and start animating 
	build: function() {
		// create foods
		this.createFoods();
		//draw blob
		this.createBlob();
		// draw enemies
		//this.createEnemies();
		// start first frame
		requestAnimationFrame(this.tick.bind(this));
	},

	recordAnswer: function(num) {
		this.stage.removeChild(this.blobGraphics);
		this.stage.removeChild(this.blobEyeGraphics);
		this.world.removeBody(this.blob);

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
		this.answerFunc(num);

	},

	createBlob: function() {
		// create blob object
		this.blob = new p2.Body({
			mass: 1,
			angularVelocity: 0,
			damping: .99,
			angularDamping: .5,
			position:[Math.round(this._width/2),Math.round(this._height/2)]
		});
		this.blobShape = new p2.Circle({radius:this.blobRadius});
		this.blob.addShape(this.blobShape);
		this.world.addBody(this.blob);

		this.blobGraphics = new PIXI.Graphics();

		// draw the blob's body
		this.blobGraphics.moveTo(0,0);
		// this.blobGraphics.beginFill(0x106283);
		// this.blobGraphics.drawCircle(0,0,this.blobRadius+4);
		this.blobGraphics.beginFill(0xFFFFFF);
		this.blobGraphics.drawCircle(0,0,this.blobRadius);
		this.blobGraphics.endFill();

		this.stage.addChild(this.blobGraphics);

	},

	createFoods: function() {
		for (i = 0; i < this.num_choices; i++) {
			var x = Math.round(Math.random() * this._width);
			var y = Math.round(Math.random() * this._height);	
			while (Math.sqrt(Math.pow(x - this._width/2, 2) + Math.pow(y - this._height/2, 2)) < this.blobRadius * 2) {
				x = Math.round(Math.random() * this._width);
				y = Math.round(Math.random() * this._height);	
			}
			var vx = (Math.random() - 0.5) * this.speed/20;
			var vy = (Math.random() - 0.5) * this.speed/20;
			var va = 0;//(Math.random() - 0.5) * this.speed/100;
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
			this.world.addBody(food);

			// Create the graphics
			var foodGraphics = new PIXI.Graphics();
			foodGraphics.beginFill(0xB6EE65);
			foodGraphics.drawCircle(0,0,20);
			foodGraphics.endFill();


			var answerText = new PIXI.Text(String.fromCharCode(65+i), {font: "24px Verdana", fill: 0x51771a});

			this.stage.addChild(foodGraphics);
			this.stage.addChild(answerText);

			this.foodBodies.push(food);
			this.foodGraphics.push(foodGraphics);
			this.answerChoices.push(answerText);
			
		}
	},

	createEnemies: function() {
		for (i = 0; i < this.numEnemies; i++) {
			var x = Math.round(Math.random() * this._width);
			var y = Math.round(Math.random() * this._height);	
			while (Math.sqrt(Math.pow(x - this._width/2, 2) + Math.pow(y - this._height/2, 2)) < this.blobRadius * 2) {
				x = Math.round(Math.random() * this._width);
				y = Math.round(Math.random() * this._height);	
			}
			var vx = (Math.random() - 0.5) * this.speed/12;
			var vy = (Math.random() - 0.5) * this.speed/12;
			var va = (Math.random() - 0.5) * this.speed/100;
			// create the enemy physics body
			var enemy = new p2.Body({
				position: [x,y],
				mass: 1,
				damping: 0,
				angularDamping: 0,
				velocity: [vx, vy],
				angularVelocity: va
			});
			var enemyShape = new p2.Circle({radius: 10});
			enemy.addShape(enemyShape);
			this.world.addBody(enemy);

			// Create the graphics
			var enemyGraphics = new PIXI.Text("*", {font: "36px Verdana", fill: 0x762E25});
			this.stage.addChild(enemyGraphics);

			this.enemyBodies.push(enemy);
			this.enemyGraphics.push(enemyGraphics);
			
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
			case 87:
			case 38:
			this.keyUp = state;
			break;
			case 83:
			case 40:
			this.keyDown = state;
			break;
		}
	},


	getDistance: function(a, b) {
		return Math.sqrt(Math.pow(a.position[0] - b.position[0], 2) + Math.pow(a.position[1] - b.position[1], 2));
	},

	updatePhysics: function () {

		if (this.keyUp) {
			this.blob.force[1] -= this.speed;
		}
		if (this.keyDown) {
			this.blob.force[1] += this.speed;
		}
		if (this.keyRight) {
			this.blob.force[0] += this.speed;
		}
		if (this.keyLeft) {
			this.blob.force[0] -= this.speed;
		}

		for (i = 0; i < this.enemyBodies.length; i++) {
			this.enemyBodies[i].force[0] += this.enemyBodies[i].velocity[1]*2;
			this.enemyBodies[i].force[1] -= this.enemyBodies[i].velocity[0]*2;
		}


		this.blobGraphics.x = this.blob.position[0];
		this.blobGraphics.y = this.blob.position[1];
		// console.log(this.blobEyeGraphics.x);
		// this.blobEyeGraphics.x = this.blob.position[0] + 15;//this.blob.velocity[0]/10;
		// this.blobEyeGraphics.y = this.blob.position[1] + 15;//this.blob.velocity[1]/10;

		for (i=0; i < this.foodBodies.length; i++) {
			if (this.getDistance(this.foodBodies[i], this.blob) < this.blobRadius*1.25) {
				this.recordAnswer(i);
			}
		}

		// wrap to other side of screen
		// console.log(this.blob);
		if (this.blob.position[0] > this._width - this.blob.shapes[0].radius) {
			this.blob.position[0] = this._width - this.blob.shapes[0].radius - 1;
		}
		if (this.blob.position[1] > this._height - this.blob.shapes[0].radius) {
			this.blob.position[1] = this._height - this.blob.shapes[0].radius - 1;
		}
		if (this.blob.position[0] < this.blob.shapes[0].radius) {
			this.blob.position[0] = this.blob.shapes[0].radius + 1;
		}
		if (this.blob.position[1] < this.blob.shapes[0].radius) {
			this.blob.position[1] = this.blob.shapes[0].radius + 1;
		}


		// wrap foods
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

		// wrap enemies
		for (i = 0; i < this.enemyBodies.length; i++) {
			if (this.enemyBodies[i].position[0] > this._width - this.enemyBodies[i].shapes[0].radius) {
				this.enemyBodies[i].velocity[0] *= -1;
			}
			if (this.enemyBodies[i].position[1] > this._height - this.enemyBodies[i].shapes[0].radius) {
				this.enemyBodies[i].velocity[1] *= -1;
			}
			if (this.enemyBodies[i].position[0] < this.enemyBodies[i].shapes[0].radius) {
				this.enemyBodies[i].velocity[0] *= -1;
			}
			if (this.enemyBodies[i].position[1] < this.enemyBodies[i].shapes[0].radius) {
				this.enemyBodies[i].velocity[1] *= -1;
			}
		}

		this.blobGraphics.rotation = this.blob.angle;
		// update food positions
		for (var i = 0; i < this.foodBodies.length; i++) {
			this.foodGraphics[i].x = this.foodBodies[i].position[0];
			this.foodGraphics[i].y = this.foodBodies[i].position[1];

			this.answerChoices[i].x = this.foodBodies[i].position[0]-8;
			this.answerChoices[i].y = this.foodBodies[i].position[1]-14;
		}

		// update enemy positions
		for (var i = 0; i < this.enemyBodies.length; i++) {
			this.enemyGraphics[i].x = this.enemyBodies[i].position[0];
			this.enemyGraphics[i].y = this.enemyBodies[i].position[1]-19;
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

var BlobbersMetaGame = function() {
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
		var radius = 40 + 60*(correct/total) - 80*(incorrect/total);
		radius = Math.max(10, radius);
		var numEnemies = Math.floor(5*index/total);
		console.log(correct, index, total);
		console.log({radius:radius, numEnemies:numEnemies});
		return {radius:radius, numEnemies:numEnemies};
	};
	this.initializeGame = function(parent, width, height, num_choices, state, answerFunc) {
		if (state) {
			var Game = new Blobbers(parent, width, height, num_choices, state, answerFunc);
			return true;
		} else {
			return false;
		}
	};
	this.getTitle = function() {
		return "Blobbers";
	};
	this.getInstructions = function() {
		return "Use W, A, S, and D (or arrow keys) to move your bubble Up, Left, Down, and Right, respectively. To choose an answer, collide your bubble with the smaller bubble that represents the answer.";
	};
	return {
		getMetaGame:this.getMetaGame,
		calculateScore:this.calculateScore,
		initializeGame:this.initializeGame,
		getTitle:getTitle,
		getInstructions:getInstructions
	};
};