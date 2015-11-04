var Screens = (function() {

	//Prototypes

	function question(questionText, answer, incorrectAnswers) {
		this.questionText = questionText;
		this.answerText = answer;
		this.incorrectAnswerTexts = incorrectAnswers;
	}

	function game(questionList, w, h) {
		this.questions = questionList;
		this.width = w;
		this.height = h;
		this.score = 0;
		this.setScore = function(newScore) {
			score = newScore;
		}
	}

	//Ajax methods to communicate with backend

	var getRequest = function(data, suceeded, failed) {
		$.ajax({
			data: JSON.stringify(data),
			dataType: "json",
			url: "https://gatol.herokuapp.com/" + "get_game",
			type: "GET",
			success: suceeded,
			error: failed
		});
	};

	var postRequest = function(data, suceeded, failed) {
		$.ajax({
			data: JSON.stringify(data),
			contentType: "application/json",
            dataType: "json",
			url: "https://gatol.herokuapp.com/" + "update_score",
			type: "POST",
			success: suceeded,
			error: failed
		});
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

		
		$(".screenTitle").text("How to Play");
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
		

		$(".screenTitle").text("Question #");
		$(".answer").text("Choose between the following:");
	};

	var setCorrectScreen = function(){
		$(".all").hide();

		$(".screenTitle").show();
		$(".currQuestion").show();
		$(".answer").show();
		$(".btnNext").show();
		
		$(".screenTitle").text("Correct!");
		$(".answer").text("Good job! You got the correct answer: ");
	};

	var setIncorrectScreen = function() {
		$(".all").hide();

		$(".screenTitle").show();
		$(".currQuestion").show();
		$(".answer").show();
		$(".btnNext").show();
		$(".bottomBtns .btnQuitGame").show();
		
		$(".screenTitle").text("Incorrect");
		$(".answer").text("You chose: " + ". The correct answer is ");
	};

	var setDoneScreen = function() {
		$(".all").hide();

		$(".screenTitle").show();
		$(".centerText").show();
		$(".centerBtns .btnQuitGame").show();
		$(".btnSummary").show();
		$(".centerBtns .btnMain").show();
		
		$(".screenTitle").text("Completed");	
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

		$(".btnPlay").click(function() {
			// Goes to start a level of the bubble game. Depends on how we 
			// implement and merge the beginning of the game. Also depends on 
			// which game template was chosed for this game.
			// window.location.href="../public/scripts.testing.html"; 
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


		// postRequest(...) //here to update the score of the current player
	};

	var nextQuestion = function() {

		var update = function() {

		}
		var updateFailed = function() {
			console.error('update score failed');
		}
		send_data = {student: studentID, gameName: gName, score: currScore, questionIndex: index};
		postRequest(send_data, update, updateFailed);
	}

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

		send_data = {student: studentID, gameName: gName};
		getRequest(send_data, setGame, gameNotReached);

        attachHandlers();
        setMainTitleScreen();
        
    };

    return {
        start: start
    };

})();
