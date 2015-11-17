var Screens = (function() {

	var currentGame = "";

	//Prototypes
	function Question(questionText, answer, incorrectAnswers) {
		this.questionText = questionText;
		this.answerText = answer;
		this.incorrectAnswerTexts = incorrectAnswers;
		this.allChoices = incorrectAnswers.concat([answer]);
		// this will shuffle allChoices
		for(var j, x, i = this.allChoices.length; i; j = Math.floor(Math.random() * i), x = this.allChoices[--i], this.allChoices[i] = this.allChoices[j], this.allChoices[j] = x);
	}

	function Game(questionList, metaGame) {
		this.questions = questionList;
		this.numCorrect = 0;
		this.index = 0;
		this.mostRecentAnswer = "";
		this.metaGame = metaGame;

		/** EDIT: not sure if game.score is a good idea because it's more specific for gametype
		 *  I refactored so that Game only stores numCorrect and relies on metaGame to handle actual scoring
		 * Accessor and Mutator for Game.score
		this.setScore = function(newScore) {
			this.score = newScore;
		};
		 */

		this.getScore = function() {
			return this.metaGame.getScore(this.numCorrect, this.questions.length);
		};

		/**
		 * Determines whether the user's answer is correct.
		 * answer is user's answer from the game
		 */
		this.checkAnswer = function(answer) {
			this.mostRecentAnswer = this.getCurrentQuestion().allChoices[answer];
			return this.mostRecentAnswer == this.getCurrentQuestion().answerText;
		};

		/**
		 * Increases the user's score and increments the question number.
		 * Called whenever the user attempts to answer a question.
		 * Returns True if there is a next question or False if no more questions.
		 * isCorrect is whether the user is True or False for the current question 
		 */
		this.incrementQuestion = function(isCorrect) {
			if (isCorrect){
				this.score += 200; // Score for a correct answer
			} else {
				this.score -= 100; // Score for an incorrect answer
			}
			this.index += 1;
		};

		/**
		 * Check to see if the next question exists
		 */
		this.hasNextQuestion = function() {
			return this.index < this.questions.length 
		};
		/** 
		 * Returns the current question
		 */
		this.getCurrentQuestion = function() {
			return this.questions[this.index];
		};

		/**
		 * Returns whether or not the player won the game.
		 */
		this.isWin = function() {
			return this.score >= (this.questions.length * 200 * 0.75)

		};

		/**
		 * Resets the state of the game
		 */
		this.reset = function() {
			this.score = 0;
			this.index = 0;
			this.mostRecentAnswer = "";		 	
		};

		/**
		 * Returns mid-game metagame state data for blobber
		 * @return radius - this is some function of the current score. bigger score = bigger blob
		 * @return numEnemies - this should slowly increase over the course of the game
		 */
		this.getMetaGame = function() {
			return this.metaGame.getMetaGame(this.numCorrect, this.index, this.questions.lenth);
		};

		this.initializeGame = function(answer) {
			this.metaGame.initializeGame(document.getElementById("gameScreen"), 
								$(".gameScreen").width(),
								$(".gameScreen").height(),
								this.getCurrentQuestion().incorrectAnswerTexts.length +1, 
								this.getMetaGame(),
								answer);
		}
	};


	//Mehtods for transition screens

	var setMainTitleScreen = function() {
		$(".all").hide();
		
		$(".screenTitle").show();
		$(".btnSynopsis").show();
		$(".btnHowTo").show();
		$(".centerBtns .btnQuitGame").show();

		$(".screenTitle").text("Blobbers"); //name of game template.
	};

	var setHowToScreen = function() {
		$(".all").hide();

		$(".screenTitle").show();
		$(".centerText").show();
		$(".bottomBtns .btnMain").show();

		
		var blobberInstructions = "Use W, A, S, and D to move your bubble Up, Left, Down, and Right, respectively. To choose an answer, collide your bubble with the smaller bubble that represents answer."
		
		$(".screenTitle").text("How to Play");
		$(".centerText").text(blobberInstructions);
	};

	var setSynopsisScreen = function() {
		

		$(".all").hide();

		$(".screenTitle").show();
		$(".qSet").show();
		$(".qSetDescr").show();
		$(".btnNext").show();
		

		$(".screenTitle").text("Synopsis");
	};

	var setQuestionScreen = function(){
		$(".all").hide();

		$(".screenTitle").show();
		$(".currQuestion").show();
		$(".answer").show();
		$(".btnGame").show();

		var question = currentGame.getCurrentQuestion();

		$(".screenTitle").text("Question " + (currentGame.index+1).toString());
		$(".currQuestion").text(question.questionText);
		$(".answer").text("Choose between the following:");

		// $(".answer").append("<div>"+question.answerText+"</div>");
		for (var i = 0; i < question.allChoices.length; i++) {
			$(".answer").append("<div>"+String.fromCharCode('A'.charCodeAt() + i)+ ") " + question.allChoices[i]+"</div>");
		};
	};

	var setCorrectScreen = function(){
		$(".all").hide();

		$(".screenTitle").show();
		$(".currQuestion").show();
		$(".answer").show();
		$(".btnNext").show();
		
		$(".screenTitle").text("Correct!");
		$(".answer").text("Good job! You got the correct answer: ");

		$(".questionText").css('position','relative')
	};

	var setIncorrectScreen = function() {
		$(".all").hide();

		$(".screenTitle").show();
		$(".currQuestion").show();
		$(".answer").show();
		$(".btnNext").show();
		$(".bottomBtns .btnQuitGame").show();
		
		$(".screenTitle").text("Incorrect");
		$(".answer").text("You chose: " + currentGame.mostRecentAnswer + ". The correct answer is " + currentGame.questions[currentGame.index].answerText);

		$(".questionText").css('position','relative')
	};

	var setDoneScreen = function(gameWon) {
		$(".all").hide();

		$(".screenTitle").show();
		// $(".centerText").show();
		$(".centerBtns .btnQuitGame").show();
		// $(".btnSummary").show();
		$(".centerBtns .btnMain").show();
		
		if (gameWon){
			$(".screenTitle").text("You won");	
		} else {
			$(".screenTitle").text("Better luck next time");
		}

		currentGame.reset();

	};


	var answer = function(num) {
		//TODO: report progress to database
		var gameDivChildren = document.getElementById("gameScreen").childNodes;
		for (i = 0; i < gameDivChildren.length; i++) {
			if (gameDivChildren[i].nodeName === "CANVAS") {
				document.getElementById("gameScreen").removeChild(gameDivChildren[i]);
			}
		}
		// while (gameDiv.firstChild) {
		// 	console.log(gameDiv.firstChild.nodeName);
		//     gameDiv.removeChild(gameDiv.firstChild);
		// }
		var wasCorrect = currentGame.checkAnswer(num);
		currentGame.incrementQuestion(wasCorrect);
		if (!currentGame.hasNextQuestion()) {
			setDoneScreen(currentGame.isWin());
		} else if (wasCorrect) {
			setCorrectScreen();
		} else {
			setIncorrectScreen();
		}

	}

	var loadGame = function() {
		$(".all").hide();
		$(".gameScreen").show();
		// $(".questionText").show();
		$(".currQuestion").show();
		$(".answer").show();

		var game = currentGame.initializeGame(answer);
	};

	var attachHandlers = function() {
		//pretty much just button clicks at this point
		
		$(".btnHowTo").click(function() {
			setHowToScreen();
		});

		$(".btnSynopsis").click(function() {
			setSynopsisScreen();
		});

		$(".btnMain").click(function() {
			setMainTitleScreen();
			//if done from HowToScreen this is all that needs to be done
			//but if done from Done Screen should anything be reset?
		});

		$(".btnNext").click(function() {
			//Increment Question number

			//If question number is the question limit -> setDoneScreen(); else
			setQuestionScreen(); 
		});

		$(".btnGame").click(function() {
			// Goes to start a level of the bubble game. Depends on how we 
			// implement and merge the beginning of the game. Also depends on 
			// which game template was chosed for this game.
			// window.location.href="../public/scripts.testing.html";
			loadGame();
		});

		$(".btnQuitGame").click(function() {
			window.location.href="index.html";
		});
	};

	/**
	 * This will be called when the game is over and it will determine whether
	 * the question was answered correctly or incorrectly.
	 */
	var levelOver = function() {
		// until we figure out how we are going to merge the game level in, this 
		// will not be very robust

		isCorrect = false;

		if (isCorrect) {

			setIncorrectScreen();
		} else {
			setCorrectScreen();
		}
		currGame.incrementQuestion();



		var update = function() {
			console.log("it did it!");
		}
		var updateFailed = function() {
			console.error('update score failed');
		}
		send_data = {student: studentID, gameName: gName, score: currScore, questionIndex: index};
		
		gameID = "0"
		
		makePutRequest("/api/game_instances/" + gameID, send_data, update, updateFailed) //here to update the score of the current player
	};


	var start = function() {
		//probably initialized in a public method that is called by the screen that chooses the game from the student's game list
		studentID = 0; 
		gName = "";

		var setGame = function(data){
			if (data.status == 1) {
				//make question set and set current question index
			} else if (data.status == -1) {
				console.error('unrecognized game name');
			} else if (data.status == -2) {
				console.error('student does not have access to this game');
			}
		};
		var gameNotReached = function(){
			console.error("game load failure");
		}

		gameID = 0;
		send_data = {student: studentID, gameName: gName};
		makeGetRequest("/api/game_instances/" + gameID, setGame, gameNotReached);

        attachHandlers();
        setMainTitleScreen();
        // setDoneScreen();

		//TEMPORARY QUESTION INITIALIZATION CODE (pretend getRequest actually works)
		//not even sure this is the right place
		var questionList = [new Question("What is two plus two?", "4", ["1", "2", "3", "potato"]),
			new Question("The square root of 1600 is 40.", "true", ["false"]),
			new Question("Which of these is not a color?", "cheese stick", ["red", "orange", "yellow", "green", "blue", "purple"])];
		currentGame = new Game(questionList, BlobbersMetaGame());
        
    };

    return {
        start: start
    };

})();
