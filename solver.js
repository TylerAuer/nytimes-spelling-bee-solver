(async () => {
  console.log('Solving NYTimes Spelling Bee');

  const submitBtn = document.getElementsByClassName('hive-action__submit')[0];
  const chars = collectChars();
  const solutions = await getListOfSolutions(chars);

  for (let i = 0; i < solutions.length; i++) {
    enterWord(solutions[i], chars, submitBtn);
  }
})();

async function getListOfSolutions(chars) {
  console.log('Loading word list from file');

  const file = await loadWordList();
  const words = file.split(/\r?\n/);
  const solutions = [];

  console.log('Checking word list for solutions');
  words.forEach((word) => {
    if (checkIfWordIsValid(word, chars)) {
      solutions.push(word);
    }
  });

  console.log('Found all solutions');
  return solutions;
}

function checkIfWordIsValid(word, chars) {
  if (word.length < 4) return false;
  let hasCenterChar = false;

  for (char of word) {
    if (!chars[char]) return false;
    if (chars[char].center) hasCenterChar = true;
  }

  return hasCenterChar;
}

function loadWordList() {
  const wordList = fetch(
    'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
  )
    .then((res) => res.text())
    .catch((err) => console.log(err));

  return wordList;
}

function collectChars() {
  const cells = document.getElementsByClassName('hive-cell');
  const chars = {};

  for (let i = 0; i < cells.length; i++) {
    const char = cells[i].children[1].innerHTML;
    const el = cells[i];

    chars[char] = {
      char: char,
      center: i === 0,
      ref: cells[i].children[0],
    };
  }

  return chars;
}

function simulateMouseClick(element) {
  const mouseClickEvents = ['mousedown', 'click', 'mouseup'];

  mouseClickEvents.forEach((mouseEventType) =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      })
    )
  );
}

function enterWord(word, chars, submitBtn) {
  for (letter of word) {
    simulateMouseClick(chars[letter].ref);
  }

  simulateMouseClick(submitBtn);
}
