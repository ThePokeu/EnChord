const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export class Game {
  #score;
  #level;
  #numberOfQuestions;
  #correctAnswers;
  #userAnswers;
  #questionsToReview;

  constructor() {
    this.#score = 0;
    this.#level = 'Easy';
    this.#numberOfQuestions = 10;
    this.#correctAnswers = [];
    this.#userAnswers = [];
    this.#questionsToReview = [];
  }

  #getRandomIndex(notes) {
    return Math.floor(Math.random() * notes.length);
  }

  getNewQuiz() {
    // Create a new quiz and add the answer to the correct answer array.
    let index1 = this.#getRandomIndex(notes);
    let index2 = this.#getRandomIndex(notes);
    while (index1 == index2) {
      index2 = this.#getRandomIndex(notes);
    }

    const note1 = notes[index1];
    const note2 = notes[index2];
    const interval = this.#calculateInterval(index1, index2);
    const octave = this.#getOctave();

    const quizObject = {
      note1,
      note2,
      interval,
      octave,
    };

    this.#correctAnswers.push(quizObject);
  }

  #getOctave() {
    // Add octave to chosen notes.
    return Math.floor(Math.random() * 7 + 1);
  }

  #calculateInterval(index1, index2) {
    // Compare two notes' index and calculate the interval.
    return Math.abs(index1 - index2) + 1;
  }

  #compareAnswers() {
    // compare user answers and correct ones then update score.
    for (let i = 0; i < this.#numberOfQuestions; i++) {
      if (this.#correctAnswers[i].interval === this.#userAnswers[i]) {
        this.#score += 1;
      } else if (
        this.#correctAnswers[i].interval !== this.#userAnswers[i] ||
        this.#userAnswers[i] === 0
      ) {
        let wronglyAnsweredQuestionNumber = i + 1;
        this.#questionsToReview.push(wronglyAnsweredQuestionNumber);
      }
    }
  }

  saveUserAnswer(userInput) {
    this.#userAnswers.push(userInput);
  }
}
