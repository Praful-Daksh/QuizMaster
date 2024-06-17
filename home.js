var button = document.querySelector('#submit');

button.addEventListener('click', getFormDetails);

let category, difficulty, quesAmount;

// Get user preferences 
function getFormDetails(e) {
  e.preventDefault();
  category = document.getElementById('category').value;
  difficulty = document.getElementById('difficulty').value;
  quesAmount = document.getElementById('amount').value;
  if (category && difficulty && quesAmount && quesAmount > 0 && quesAmount <= 50) {
    localStorage.setItem('category', category);
    localStorage.setItem('difficulty',difficulty);
    localStorage.setItem('quesAmount',quesAmount);
    window.location.href = 'quiz.html';
  }
  else{
    alert('Fill your preferences.\nQuestions should belongs to  1 ~ 50 ');
  }
}


