  var category = localStorage.getItem('category');
  var difficulty = localStorage.getItem('difficulty');
  var quesAmount = localStorage.getItem('quesAmount');
  var loader = document.querySelector('.loading');
  var quizArea = document.querySelector('.quiz-area');
  var quizValues = null;
  let selectedCorrectAnswers = 0;
  questionCounter = 0;




  loader.style.display = 'flex';

  quiz(category, difficulty, quesAmount);


  /// starts quiz

  function quiz(quizCategory, quizDifficulty, quizAmount) {
    console.log('fetching');
    fetchQuiz(quizCategory, quizDifficulty, quizAmount);
  }


  // fetch questions and options from api

  function fetchQuiz(c, d, a) {
    fetch(`https://opentdb.com/api.php?amount=${a}&category=${c}&difficulty=${d}&type=multiple`)
      .then(response => response.json())
      .then(data => {
        quizValues = data.results;
        if (quizValues) {
          displayQuestion(quizValues);
          console.log(quizValues)
        }
        else {
          fetchQuiz(c, d, a);
        }
      })
      .catch(error => console.error(error));
  }


  // display questions and options on web

  let correctAnswer;

  function displayQuestion(quizValues) {
    if (questionCounter < quizValues.length) {
      let options = [quizValues[questionCounter].correct_answer, quizValues[questionCounter].incorrect_answers[0], quizValues[questionCounter].incorrect_answers[1], quizValues[questionCounter].incorrect_answers[2]];

      correctAnswer = quizValues[questionCounter].correct_answer;

      let shuffledOptions = shuffle(options);
      var element = document.createElement('div');
      element.className = 'question';
      element.innerHTML = `<p id="question">${questionCounter+1}. ${quizValues[questionCounter].question}</p>
      <ul>
        <button>${shuffledOptions[0]}</button>
        <button>${shuffledOptions[1]}</button>
        <button>${shuffledOptions[2]}</button>
        <button>${shuffledOptions[3]}</button>
      </ul>
      <p id="msg"></p>
      <div class="next">
      <input id="next" type="button" value="Next" disabled>
      </div>
      `;
      quizArea.innerHTML = '';
      quizArea.append(element);
      loader.style.display = 'none';
      var buttonOptions = document.querySelectorAll('button');
      checkCorrectButton(buttonOptions);
    }

    else {
      var result = calculateResult();
      showResult(result);
    }

  }


  // shuffle index of options

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  // checking user clicked correct option or not

  function checkCorrectButton(buttonOptions) {
    buttonOptions.forEach(buttonOption => {
      buttonOption.addEventListener('click', (e) => {
        e.preventDefault();
        disable(buttonOptions);
        if (decodeHtmlEntities(e.target.textContent) == decodeHtmlEntities(correctAnswer)) {
          buttonOption.style.backgroundColor = '#9AE265';
          buttonOptions.disabled = true;
          selectedCorrectAnswers++;
        }
        else {
          document.querySelector('#msg').textContent = `Correct Answer: ${decodeHtmlEntities(correctAnswer)}`;
          buttonOption.style.backgroundColor = 'rgba(255, 62, 62, 0.81)';
          buttonOptions.disabled = true;
        }
      })
    })
  }

  // disable after clicking buttons

  function disable(buttonOptions) {
    buttonOptions.forEach(buttonOption => {
      buttonOption.disabled = true;
    });
    var nextBtn = document.querySelector('#next');
    nextBtn.style.border = '1px solid #3384DE';
    nextBtn.disabled = false;
    nextBtn.addEventListener('click', () => {
      questionCounter++;
      displayQuestion(quizValues);
    })
  }

  // it uses to decode '&supc7' this kind of stuff

  function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;;
  }

  // calculate result

  function calculateResult() {
    var total = quesAmount;
    var correct = selectedCorrectAnswers;
    score = (correct / total) * 100;
    return score;
  }

  // show result

  function showResult(result) {
    quizArea.style.display = 'none';
    loader.style.display = 'flex';

    setTimeout(() => {
      loader.style.display = 'none';

      document.getElementById('results').style.display = 'flex';

      document.getElementById('percentage').textContent = `${result}%`;

      document.getElementById('out-of').textContent = `${selectedCorrectAnswers} out of ${quesAmount}`;
      getGrades(result);
    }, 1500);
  }
  
  
  // get grades 
  
  function getGrades(result){
    var grade = document.getElementById('result-category');
      if (result >= 50 ) { 
        grade.textContent = 'Not Bad'; 
      }
      if (result > 70){
        grade.textContent = 'Appreciate It';
      }
      if(result < 50 ){
        grade.textContent = 'Well Tried';
      }
      if(result > 85){
        grade.textContent = 'Insane';
      }
  }