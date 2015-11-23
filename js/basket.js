/** Initializes a basketber game object
 * @param parent the containing elemnt (like a div or something)
 * @param width element width
 * @param height element height
 * @param num_choices the number of answer choices to choose from
 * @param state object varies for each game
 	potential state variables for Basketber:
 		radius: the radius of the basket
 		numEnemies: pretty self explanatory
 */
var Baskets = function(parent, width, height, num_choices, state, answerFunc) {
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
		gravity: [0,state.gravity || 500]
	});

	// speed
	this.speed = state.gravity*10;
	this.turnSpeed = 5;

	window.addEventListener('keydown', function(event) {
		this.handleKeys(event.keyCode, true);
	}.bind(this), false);	
	window.addEventListener('keyup', function(event) {
		this.handleKeys(event.keyCode, false);
	}.bind(this), false);

	this.foodBodies = [];
	this.foodGraphics = [];
	this.answerNumbers = [];
	// this.enemyBodies = [];
	// this.enemyGraphics = [];
	this.answerChoices = [];

	this.basketRadius = 30;
	this.interval = state.interval || 1000;
	this.num_choices = num_choices;
	this.answerFunc = answerFunc;

	// Start running the game.
	this.build();
};

Baskets.prototype = {
	// Build scene and start animating 
	build: function() {
		// create foods
		var that = this;
		this.foodMaker = setInterval(this.createFoods, this.interval, that);
		//draw basket
		this.createBasket();
		// draw enemies
		//this.createEnemies();
		// start first frame
		requestAnimationFrame(this.tick.bind(this));
	},

	recordAnswer: function(num) {
		this.stage.removeChild(this.basketGraphics);
		this.stage.removeChild(this.basketEyeGraphics);
		this.world.removeBody(this.basket);

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

	createBasket: function() {
		// create basket object
		this.basket = new p2.Body({
			mass: 1,
			angularVelocity: 0,
			damping: .99,
			angularDamping: .5,
			position:[Math.round(this._width/2),Math.round(this._height + 10)]
		});
		this.basketShape = new p2.Circle({radius:this.basketRadius});
		this.basket.addShape(this.basketShape);
		this.world.addBody(this.basket);

		this.basketGraphics = new PIXI.Graphics();

		// draw the basket's body
		this.basketGraphics.moveTo(-30,10);
		this.basketGraphics.lineStyle(10, 0xFFFFFF, 1);
		this.basketGraphics.lineTo(-40,-30);
		this.basketGraphics.lineTo(40,-30);
		this.basketGraphics.lineTo(30,10);
		this.basketGraphics.lineTo(-30,10);

		this.stage.addChild(this.basketGraphics);
	},

	createFoods: function(that) {
		// console.log(that.num_choices);
		var i = Math.floor(Math.random() * that.num_choices);
		var x = Math.random() < .5 ? 10 : that._width - 10;
		var y = Math.round(Math.random() * that._height/4);	
		while (Math.sqrt(Math.pow(x - that._width/2, 2) + Math.pow(y - that._height/2, 2)) < that.basketRadius * 2) {
			x = Math.round(Math.random() * that._width);
			y = Math.round(Math.random() * that._height);	
		}
		var vx = x < that._width/2 ? (Math.random()*.8 + .2)*that.speed/6 : (Math.random()*.8 + .2)*that.speed/(-6);
		var vy = (Math.random() - 0.5) * that.speed/20;
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

		if (this.keyRight) {
			this.basket.force[0] += this.speed;
		}
		if (this.keyLeft) {
			this.basket.force[0] -= this.speed;
		}

		// for (i = 0; i < this.enemyBodies.length; i++) {
		// 	this.enemyBodies[i].force[0] += this.enemyBodies[i].velocity[1]*2;
		// 	this.enemyBodies[i].force[1] -= this.enemyBodies[i].velocity[0]*2;
		// }


		this.basketGraphics.x = this.basket.position[0];
		this.basketGraphics.y = this.basket.position[1];
		// console.log(this.basketEyeGraphics.x);
		// this.basketEyeGraphics.x = this.basket.position[0] + 15;//this.basket.velocity[0]/10;
		// this.basketEyeGraphics.y = this.basket.position[1] + 15;//this.basket.velocity[1]/10;

		for (i=0; i < this.foodBodies.length; i++) {
			if (this.getDistance(this.foodBodies[i], this.basket) < this.basketRadius*1.25) {
				this.recordAnswer(this.answerNumbers[i]);
			}
		}

		if (this.basket.position[0] > this._width - this.basket.shapes[0].radius) {
			this.basket.position[0] = this._width - this.basket.shapes[0].radius - 2;
		}
		if (this.basket.position[1] > this._height - this.basket.shapes[0].radius) {
			this.basket.position[1] = this._height - this.basket.shapes[0].radius + 2;
		}
		if (this.basket.position[0] < this.basket.shapes[0].radius) {
			this.basket.position[0] = this.basket.shapes[0].radius + 2;
		}

		// bounce off walls and kill things that fall below the bottom?
		spliceIndices = [];
		for (i = 0; i < this.foodBodies.length; i++) {
			if (this.foodBodies[i].position[0] > this._width - this.foodBodies[i].shapes[0].radius) {
				this.foodBodies[i].velocity[0] *= -1;
			}
			if (this.foodBodies[i].position[1] > this._height + this.foodBodies[i].shapes[0].radius+20) { // modifying this to make ball disappear
				this.foodBodies[i].velocity[1] *= 0;
				spliceIndices.push(i);
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

		// for (i = 0; i < this.enemyBodies.length; i++) {
		// 	if (this.enemyBodies[i].position[0] > this._width - this.enemyBodies[i].shapes[0].radius) {
		// 		this.enemyBodies[i].velocity[0] *= -1;
		// 	}
		// 	if (this.enemyBodies[i].position[1] > this._height - this.enemyBodies[i].shapes[0].radius) {
		// 		this.enemyBodies[i].velocity[1] *= -1;
		// 	}
		// 	if (this.enemyBodies[i].position[0] < this.enemyBodies[i].shapes[0].radius) {
		// 		this.enemyBodies[i].velocity[0] *= -1;
		// 	}
		// 	if (this.enemyBodies[i].position[1] < this.enemyBodies[i].shapes[0].radius) {
		// 		this.enemyBodies[i].velocity[1] *= -1;
		// 	}
		// }

		this.basketGraphics.rotation = this.basket.angle;
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

var BasketsMetaGame = function() {
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
		var gravity = 200 + 700*index/total;
		var interval = 1500 / Math.pow(((total + index)/total), 3);
		return {gravity:gravity, interval:interval};
	};
	this.initializeGame = function(parent, width, height, num_choices, state, answerFunc) {
		if (state) {
			var Game = new Baskets(parent, width, height, num_choices, state, answerFunc);
			return true;
		} else {
			return false;
		}
	};
	this.getTitle = function() {
		return "Baskets";
	};
	this.getInstructions = function() {
		return "Use A and D (or the left and right arrow keys) to move your basket Left and Right, respectively. To choose an answer, collect the bubble that corresponds to the correct answer.";
	};
	return {
		getMetaGame:this.getMetaGame,
		calculateScore:this.calculateScore,
		initializeGame:this.initializeGame,
		getTitle:getTitle,
		getInstructions:getInstructions
	};
};