function runTheQuiz(quiz) {

// set total possible answers here if quiz structure changes
	var totalAnswers = 4;


// variable that keeps track of the current state
	var state = {
			currentQuestionNum: 0,
			currentAnswer: '',
			guessedCorrect: false,
			borderColor: 'gray-border',
			totalCorrect: 0,
			response: ''
	}

	
// state modifier functions
	function resetState(state) {
		state.currentQuestionNum = 0;
		state.borderColor = 'gray-border';
		state.totalCorrect = 0;
	}

	function updateAnswer(state) {
		for (var i = 0; i < totalAnswers; i++) {
				if (quiz[state.currentQuestionNum].answers[i].correct) {
					state.currentAnswer = quiz[state.currentQuestionNum].answers[i].answer;
				}
			}
	}

	function updateAfterGuess(state, quizBox, theGuess) {

		state.guessedCorrect = $(theGuess).hasClass('true');
		if (state.guessedCorrect) {
			state.response = '<h2>CORRECT!</h2>';
			state.borderColor = 'green-border';
			state.totalCorrect++;
		}
		else {
			state.response = '<h2>WRONG!</h2><p>The correct answer is: "' + state.currentAnswer + '"</p>';
			state.borderColor = 'red-border';
		}
	}


// render functions
	function renderScore(state) {
		var scoreHTML = '<div class="current-score-box"><p>Score: ' +
						state.totalCorrect + ' out of ' + state.currentQuestionNum + 
						'</p></div>';

		return scoreHTML;
	}

	function renderAnswers(state) {
		var answersHTML = '';
		var isCorrect = false;
		for (var i = 0; i < totalAnswers; i++) {
			isCorrect = quiz[state.currentQuestionNum]['answers'][i]['correct'];
			answersHTML += '<button class="answer-box ' + isCorrect + '"><span class="answer">' +
							quiz[state.currentQuestionNum]['answers'][i]['answer'] +
							'</span></button>';
		}
		answersHTML = '<div class="answers">' + answersHTML + '</div>';

		return answersHTML;
	}

	function renderQuestion(state) {
		var num = state.currentQuestionNum + 1;
		var questionHTML = '<div class="question-box"><p class="question-counter">QUESTION ' +
							num + ' of ' + quiz.length + '</p>' +	'<h2 class="question">' + quiz[state.currentQuestionNum].question + '</h2></div>';
	
		return questionHTML;
	}

	function renderNewQuestion(state, quizBox) {
		var questionHTML = renderQuestion(state);
		var answersHTML = renderAnswers(state);
		var scoreHTML = '';
		if (state.currentQuestionNum > 0) {
			scoreHTML = renderScore(state);
		}
		$(quizBox).html(questionHTML + answersHTML + scoreHTML);
	}

	function renderMessage(state, quizBox, thisAnswer) {
		var	messageHTML = '<div class="message-box ' + state.borderColor +
						  '"><span class="message">' + state.response + 
						  '</span><button class="message-button">' +
						  '<span class="button-label">Continue</span></button></div>';

		$(quizBox).html(messageHTML);
	}

	function renderEnd(state, quizBox) {
		var endHTML = '<div class="message-box ' + state.borderColor + '"><span class="message">' +
						'<h2>DONE!</h2><p>Your final score is: ' + state.totalCorrect + ' out of ' + 
						quiz.length + '.</p><button class="message-button"><span class="button-label">' +
					'Play Again?</span></button></div>'; 

		$(quizBox).html(endHTML);
	}
	

// event handlers
	function handleMessageClicks(state, quizBox, messageElement, messageButton) {
		quizBox.on('click', messageButton, function(event) {
			event.stopPropagation();	
			if (state.currentQuestionNum < quiz.length) {
				updateAnswer(state);
				renderNewQuestion(state, quizBox);
				state.currentQuestionNum++;
			}
			else {
				console.log(state.currentQuestionNum);
				state.borderColor = 'gray-border';
				renderEnd(state, quizBox);
				resetState(state);				
			}
		});
	}

	function handleAnswerClicks(state, quizBox, answerButton) {
		quizBox.on('click', answerButton, function(event) {
			event.stopPropagation();
			updateAfterGuess(state, quizBox, this);
			renderMessage(state, quizBox, this);
		});
	}


	$(function() {
	   	var messageElement = $('.message-box');
	  	var messageButton = '.message-button';
	  	var answerButton = '.answer-box';			
	  	var quizBox = $('.js-quiz');
		handleMessageClicks(state, quizBox, messageElement, messageButton);
	  	handleAnswerClicks(state, quizBox, answerButton);
	 });
}

runTheQuiz(quiz);