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

	function Game(id, questionList, descr, template) {
		this.id = id;
		this.questions = questionList;
		this.numCorrect = 0;
		this.index = 0;
		this.mostRecentAnswer = "";
		this.description = descr;
		this.templateID = template;
		this.metaGame = "";
		this.responses = [];

		if (gameTemplateIdToTitle[this.templateID] == "Blobbers"){
			this.metaGame = BlobbersMetaGame()
		} else if (gameTemplateIdToTitle[this.templateID] == "Baskets"){
			this.metaGame = BasketsMetaGame()
		} else if (gameTemplateIdToTitle[this.templateID] == "Shooters"){
			this.metaGame = ShootersMetaGame()
		} else if (gameTemplateIdToTitle[this.templateID] == "Bouncers"){
			this.metaGame = BouncersMetaGame()
		}

		this.getScore = function() {
			return this.metaGame.calculateScore(this.numCorrect, this.questions.length);
		};

		/**
		 * Determines whether the user's answer is correct.
		 * answer is user's answer from the game
		 */
		this.checkAnswer = function(answer) {
			if (answer < 0) {
				this.mostRecentAnswer = "nothing";
				return false;
			}
			this.mostRecentAnswer = this.getCurrentQuestion().allChoices[answer];
			return this.mostRecentAnswer == this.getCurrentQuestion().answerText;
		};

		/**
		 * Increases the user's score and increments the question number.
		 * Called whenever the user attempts to answer a question.
		 * isCorrect is whether the user is True or False for the current question 
		 */
		this.incrementQuestion = function(isCorrect) {
			this.numCorrect += isCorrect ? 1:0;
			this.responses.push(isCorrect);
			this.index += 1;
		};

		/**
		 * Check to see if the next question exists
		 * Returns True if there is a next question or False if at the end of questinonList.
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
			return this.getScore() >= (this.questions.length * 200 * 0.75);
		};

		/**
		 * Resets the state of the game
		 */
		this.reset = function() {
			this.numCorrect = 0;
			this.responses = [];
			this.index = 0;
			this.mostRecentAnswer = "";		 	
		};

		/**
		 * Returns mid-game metagame state data for whatever game is loaded
		 */
		this.getMetaGame = function() {
			return this.metaGame.getMetaGame(this.numCorrect, this.index, this.questions.length);
		};

		this.getTitle = function() {
			return this.metaGame.getTitle();
		}

		this.getInstructions = function() {
			return this.metaGame.getInstructions();
		}

		this.initializeGame = function(answer) {
			this.metaGame.initializeGame(document.getElementById("gameScreen"), 
								$(".gameScreen").width(),
								$(".gameScreen").height(),
								this.getCurrentQuestion().incorrectAnswerTexts.length +1, 
								this.getMetaGame(),
								answer);
		}
	};


	//Methods for  screen transitions

	var setMainTitleScreen = function() {
		$(".all").hide();
		
		$(".screenTitle").show();
		$(".main").show();
		// $(".btnSynopsis").show();
		// $(".btnHowTo").show();
		// $(".centerBtns .btnQuitGame").show();

		$("head title").text("Game-A-Thon of Learning - " + currentGame.getTitle());

		$(".screenTitle").text(currentGame.getTitle()); //name of game template.
		$(".centerText").removeClass("centerBtns");
	};

	var setLoadingScreen = function() {
		$(".all").hide();
		
		$(".screenTitle").show();
		// $(".main").show();
		// $(".btnSynopsis").show();
		// $(".btnHowTo").show();
		// $(".centerBtns .btnQuitGame").show();

		$(".screenTitle").text("Loading..."); //name of game template.
		$(".centerText").removeClass("centerBtns");
	};

	var setHowToScreen = function() {
		$(".all").hide();

		$(".screenTitle").show();
		$(".howTo").show();
		// $(".centerText").show();
		// $(".bottomBtns .btnMain").show();

		$(".screenTitle").text("How to Play");
		$(".centerText").text(currentGame.getInstructions());
	};

	var setSynopsisScreen = function() {
		

		$(".all").hide();

		$(".screenTitle").show();
		$(".synopsis").show();
		// $(".centerText").show();
		// $(".btnNext").show();
		

		$(".screenTitle").text("Synopsis");
		$(".centerText").text(currentGame.description);
	};

	var setQuestionScreen = function(){
		$(".all").hide();

		$(".screenTitle").show();
		$(".questionDisp").show();
		// $(".currQuestion").show();
		// $(".answer").show();
		// $(".btnGame").show();

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
		$(".answerDisp").show();
		// $(".currQuestion").show();
		// $(".answer").show();
		// $(".btnNext").show();
		
		$(".screenTitle").text("Correct!");
		$(".answer").text("Good job! You got the correct answer: " + currentGame.questions[currentGame.index-1].answerText + ".");

		$(".questionText").css('position','relative');

		if (!currentGame.hasNextQuestion()) {
			$(".btnNext").text("Finish");
		}
	};

	var setIncorrectScreen = function() {
		$(".all").hide();

		$(".screenTitle").show();
		$(".answerDisp").show();
		// $(".currQuestion").show();
		// $(".answer").show();
		// $(".btnNext").show();
		$(".bottomBtns .btnQuitGame").show();
		
		$(".screenTitle").text("Incorrect");
		$(".answer").text("You chose: " + currentGame.mostRecentAnswer + ". The correct answer is " + currentGame.questions[currentGame.index-1].answerText + ".");

		$(".questionText").css('position','relative');

		if (!currentGame.hasNextQuestion()) {
			$(".btnNext").text("Finish");
		}
	};

	var setDoneScreen = function(gameWon) {
		$(".all").hide();

		$(".screenTitle").show();
		$(".done").show();
		// $(".centerText").show();
		// $(".centerBtns .btnQuitGame").show();
		// $(".btnProgress").show();
		// $(".centerBtns .btnMain").show();
		
		if (gameWon){
			$(".screenTitle").text("You won");	
		} else {
			$(".screenTitle").text("Better luck next time");
		}

		$(".centerText").text("Your final score is " + currentGame.getScore().toString() + ".");
		$(".centerText").addClass("centerBtns"); //this is only to make the div center-aligned
		$(".btnNext").text("Next Question");
	};

	var setProgressScreen = function() {
		$(".all").hide();

		$(".screenTitle").show();
		$(".progress").show();

		$(".screenTitle").text("Progress Report");

	};


	/**
	 * This will be called when the game is over and it will determine whether
	 * the question was answered correctly or incorrectly.
	 */
	var answer = function(num) {
		// console.log(num);
		$(".questionText").addClass("questionZoomed");
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
		if (wasCorrect) {
			setCorrectScreen();
		} else {
			setIncorrectScreen();
		}

		//TODO: report progress to database

		var updateSuccess = function(data){
			console.log("update succeeded");
		}
		var updateFailed = function(data){
			console.error("update failed");
		}
		
		if (currentGame.id != -1) {
			send_data = {game_id: currentGame.id, score: currentGame.getScore(), lastQuestion: currentGame.index};

			makePutRequestWithAuthorization("/api/game_instances/" + currentGame.id.toString(), send_data, getCookie("auth_token"), updateSuccess, updateFailed);
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
			currentGame.reset();
			setMainTitleScreen();
			//if done from HowToScreen this is all that needs to be done
			//but if done from Done Screen should anything be reset?
		});

		$(".btnNext").click(function() {
			//If question number is the question limit -> setDoneScreen(); else increment question number
			if (!currentGame.hasNextQuestion()) {
				setDoneScreen(currentGame.isWin());
			} else {
				setQuestionScreen();
			}
		});

		$(".btnGame").click(function() {
			// Goes to start a level of the bubble game. Depends on how we 
			// implement and merge the beginning of the game. Also depends on 
			// which game template was chosed for this game.
			// window.location.href="../public/scripts.testing.html";
			loadGame();
			$(".questionText").removeClass("questionZoomed");
		});

		$(".btnProgress").click(function(){
			setProgressScreen();

			//sets up the Progress Container - This is not yet set up to work if player resumes game from the middle
			$(".progress_container li").remove();
			$(".progress_container .fullbar").remove();

			for (i = 0; i < currentGame.responses.length; i++) {
				if (i != 0) {
					$(".progress_container").append("<div class='fullbar'></div>");
				}
				str = currentGame.responses[i] ? "Correct":"Incorrect"
				$(".progress_container").append("<li><div class='qInfo'>"+currentGame.questions[i].questionText+"</div><div class='result'>"+str+"</div></li>");
			}


		});

		$(".btnDone").click(function(){
			setDoneScreen(currentGame.isWin());
			

		});

		$(".btnQuitGame").click(function() {
			currentGame.reset();
			deleteCookie("game_id");
			window.location.href="dashboard.html";
		});
	};

	var start = function() {
		//probably initialized in a public method that is called by the screen that chooses the game from the student's game list
		checkIfLoggedIn();
		
		gameInstanceID = ""; 
		descr = "";
		tempID = "";

		gameID = getCookie("game_id");
		token = getCookie("auth_token");

		var gameLoadError = function(){
			console.error("game load failure");

			//TEMPORARY QUESTION INITIALIZATION CODE (pretend getRequest actually works)
			var questionList = [new Question("What is two plus two?", "4", ["1", "2", "3", "potato"]),
				new Question("The square root of 1600 is 40.", "true", ["false"]),
				new Question("Dog goes:", "woof", ["meow", "tweet", "squeak", "moo", "croak", "toot"]),
				new Question("Cat goes:", "meow", ["woof", "tweet", "squeak", "moo", "croak", "toot"]),
				new Question("Mouse goes:", "squeak", ["meow", "tweet", "woof", "moo", "croak", "toot"]),
				new Question("Bird goes:", "tweet", ["meow", "woof", "squeak", "moo", "croak", "toot"]),
				new Question("Which of these is not a color?", "cheese stick", ["red", "orange", "yellow", "green", "blue", "purple"])];

			currentGame = new Game(-1, questionList, "Assorted Questions", 2);
			setMainTitleScreen();
		};


		var createGame = function(data){ //data is the questionSet - make sure the correct api call has this method
			qList = [];
			for (var i = 0; i < data.game.question_set.questions.length; i++) {
				q = data.game.question_set.questions[i]

				wrongAnswers = [q.answerWrong1, q.answerWrong2, q.answerWrong3, q.answerWrong4, q.answerWrong5, q.answerWrong6, q.answerWrong7];
				
				//delete all of the nulls from the array
				for (var j = wrongAnswers.length - 1; j >= 0; j--) {
					if (wrongAnswers[j] == null) {
						wrongAnswers.pop();
					}
				};

				qList.push(new Question(q.question, q.answerCorrect, wrongAnswers));
			};

			//make the Game object
			currentGame = new Game(gameInstanceID, qList, descr, tempID);

			setMainTitleScreen();
		};

		var gameNotReached = function(data){
			console.error("game not acquired, problem with gameInstanceID");
			gameLoadError();
		}

		var gotGameInstanceID = function(data){ 
			gameInstanceID = data.game_instance_id;
			descr = data.game_description;
			tempID = data.template_id;
			
			//get /api/games/game_id
			makeGetRequestWithAuthorization("/api/games/" + gameID, token, createGame, gameNotReached);

			// makeGetRequestWithAuthorization("/api/game_instances/" + gameInstanceID, token, gotGame, gameNotReached);
		};
		var gameInstanceIDNotReached = function(data){ 
			console.error("get request failed, cant get gameInstanceID");
			gameLoadError();
		};

		// isTrainer = getCookie("trainer");


        makePostRequestWithAuthorization("/api/game_instances?game_id=" + gameID, {}, token, gotGameInstanceID, gameInstanceIDNotReached);

        attachHandlers();
        setLoadingScreen();

    };

    return {
        start: start
    };

})();
