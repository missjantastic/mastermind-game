/*
TABLE OF CONTENTS:
- MAIN FUNCTIONS (setUpPage, onSubmit, submitGuess, sendResponse, endGame)
- HELPER FUNCTIONS (getPattern, hideOnClick, countGuesses, validateInput, createFeedbackElements)
- OTHER FUNCTIONS (checkSubmit, toggleHistory)
*/

let guessesLeft;
let randPattern;
setUpPage();

/*-------MAIN FUNCTIONS-------*/

/**
 * Sets up random pattern, guesses left, and modals
 **/
function setUpPage(){
    //retrieve the random 4 digit code
    getPattern('https://www.random.org/integers/?num=4&min=0&max=7&col=1&base=10&format=plain&rnd=new');

    //initialize guesses
    guessesLeft = 10;

    //initialize feedback log
    document.getElementById("recentFeedbackText").innerHTML = "I'll send your feedback here, Detective.";
    document.getElementById("toggleButton").style.display = "none";

    //setting up buttons and modals
    let helpButton = document.getElementById("helpButton");
    let closeButton = document.getElementById("closeButton");
    let startButton = document.getElementById("startButton");
    let toggleButton = document.getElementById("toggleButton");
    let helpContainer = document.getElementById("helpContainer");
    let welcomeContainer = document.getElementById("welcomeContainer");
    toggleButton.addEventListener("click", () =>{
        toggleHistory();
    })
    helpButton.addEventListener("click", () => {
        helpContainer.classList.add("show");
    });

    //show welcome modal at start
    welcomeContainer.classList.add("show");

    //set up for closing modals
    hideOnClick(closeButton);
    hideOnClick(startButton);
    hideOnClick(helpContainer);
    hideOnClick(welcomeContainer);
}

/**
 * store player guess into array, validate it, and submit
 * if they did not run out of guesses
 * 
 * @return function exits if input is not validated
 */
function onSubmit() {
    //load player guesses into an array
    let slot1 = document.getElementById("slot1").value;
    let slot2 = document.getElementById("slot2").value;
    let slot3 = document.getElementById("slot3").value;
    let slot4 = document.getElementById("slot4").value;
    let playerGuesses = [slot1, slot2, slot3, slot4];

    //validate that input meets requiremets
    let isValidated = validateInput(playerGuesses);
    
    //exit function if input is not valid
    if(!isValidated) {
        return;
    }

    guessesLeft = countGuesses();
    //if they run out of guesses, end game
    if(guessesLeft==0){
        let isWon = false;
        endGame(isWon);
    } else if (guessesLeft < 9){ //display feedback toggle if there is more than one guess
        document.getElementById("toggleButton").style.display = "";
    }

    //submit player Guess
    submitGuess(playerGuesses);
}


/**
 * compares guess to actual pattern and sends appropriate response
 *
 * @param {array} playerGuesses
 **/
function submitGuess(playerGuesses){
    //copy randPattern and playerGuesses arrays to local scope
    let pattern = randPattern.map((x) => x);
    let guesses = playerGuesses.map((x) => x);
    //initialize tracking variables
    let allCorrect = false;
    let locMatches = 0;
    let existingNums = 0;

    //an array containing the differences of the random pattern - player's guesses
    //an index containing zero would indicate a location match
    let differences = pattern.map((slot, i) => slot - playerGuesses[i]);

    //counts location matches, and removes them so they are no longer considered
    for (let i = 0; i < differences.length; i++) {
        if (differences[i] == 0){
            locMatches++;
            pattern[i] = -1;
            guesses[i] = -2;
        }
    }

    //move on if all matches found
    if(locMatches==4){
        allCorrect = true;
        endGame(allCorrect);
    } else {
        //for each number in guesses, check if there is a match in pattern
        for (let i = 0; i < guesses.length; i++) {
            //returns index of first number match
            let foundIndex = pattern.findIndex(slot => slot == guesses[i]);
            if (foundIndex >= 0){ //if number match is found, count it and remove from consideration
                existingNums++;
                pattern[foundIndex] = -1;
                guesses[i] = -2;
            }
        }
    }

    sendResponse(locMatches, existingNums, playerGuesses);
}

/**
 * sends feedback to page
 *
 * @param {Number} locMatches number of guesses in the right location
 * @param {Number} existingNums number of guesses not in the right location
 * @param {Array} playerGuesses array containing
 * @return {bool} true if input is valid, false if not
 **/
function sendResponse(locMatches, existingNums, playerGuesses){
    let guessMessage = "Your guess: " + playerGuesses.join(' ');
    let responseMessage;

    //else run this code if any part of their guess is correct in some way
    if (locMatches > 0 || existingNums > 0){
        responseMessage = `${locMatches} of your guesses are in the correct location. ${existingNums} of your guesses are in the code, but not in the right location.`;
    } 
    //else run this code is their guess is completely incorrect
    else {
        responseMessage = "None of these numbers are correct.";
    }

    //adds most recent feedback to top of the feedback history (default hidden)
    let feedback = createFeedbackElements(guessMessage, responseMessage);
    let element = document.getElementById("feedbackLog");
    element.insertBefore(feedback, element.firstChild);

    //displays the most recent feedback
    document.getElementById("recentFeedbackText").innerHTML = guessMessage + "<br/>" + responseMessage;
}

/**
 * sends popup and option to restart
 *
 * @param {bool} isWon true if player's guess is correct
 **/
function endGame(isWon){
    let winLoseTitle = document.getElementById("winLoseTitle");
    let winLoseText = document.getElementById("winLoseText");
    let restartButton = document.getElementById("restartButton");

    if (isWon) {
        winLoseTitle.innerHTML = "You Won!";
        winLoseText.innerHTML = "Wow, you guessed the code! You're a master codebreaker! Press the button to play again."
    }
    else {
        winLoseTitle.innerHTML = "You Lost!";
        winLoseText.innerHTML = "Aw man, you ran out of guesses! Do you want to try again?"
    }

    document.getElementById("winLoseContainer").classList.add("show");
    restartButton.addEventListener("click", () =>{
        location.reload();
    });
}

/*--------HELPER FUNCTIONS--------*/
/**
 * gets random four numbers from random.org API and stores them in a global array
 * used by setUpPage function
 *
 * @param {string} url The URL of the API being requested
 **/
 async function getPattern(url){
    const response = await fetch(url);
    result = await response.text();
    randPattern = result.split("\n");
    randPattern.pop();
    console.log(randPattern);
}

/**
 * on click, hides element and focuses on input
 * used by setUpPage function
 * 
 * @param {HTMLElement} element
 **/
 function hideOnClick(element){
    element.addEventListener("click", () => {
        element.classList.remove("show");
        document.getElementById("slot1").focus();
    });
}

/**
 * counts guesses remaining
 * used by onSubmit function
 * 
 * @return {Number} indicating how many guesses left
 **/
 function countGuesses(){
    let guessesLeftText = document.getElementById("guessesLeftText");
    guessesLeft -= 1;
    guessesLeftText.innerHTML= `${guessesLeft} GUESSES REMAINING`;
    return guessesLeft;
}

/**
 * validates that the player guesses meet requirements
 * used by onSubmit function
 * 
 * @param {array} playerGuesses
 * @return {bool} true if input is valid, false if not
 **/
 function validateInput(playerGuesses) {
    let validator = document.getElementById("guessesLeftText");

    //if any of the input fields are empty
    if(playerGuesses.includes(undefined || "")) {
        validator.innerHTML= "Make sure you have a guess for each slot!";
        validator.style.display="block";
        return false;
    } 
    //if any of the input fiels are out of range
    else if (playerGuesses.find(slot => slot < 0 || slot > 7)){
        validator.innerHTML= "Make sure your guesses are between 0 and 7!";
        validator.style.display="block";
        return false;
    } else {
        return true;
    }
}

/**
 * creates all the HTML elements related to the guess feedback
 * used by sendResponse function
 * 
 * @param {String} guess
 * @param {String} response
 * @return {HTMLDivElement} div containing all the feedback
 **/
function createFeedbackElements(guess, response){
    //identify div to prepend elements to
    
    //create new feedbackholder div
    let feedbackHolder = document.createElement("div");
    feedbackHolder.setAttribute("class","feedbackHolder");

    //create icon
    let icon = document.createElement("div");
    icon.setAttribute("class","detective pic");

    //create feedback message element
    let feedback = document.createElement("p");
    feedback.setAttribute("class", "feedback");

    //add all text to the feedback message
    let guessText = document.createTextNode(guess)
    let feedbackText = document.createTextNode(response);
    feedback.appendChild(guessText);
    feedback.appendChild(document.createElement('br'));
    feedback.appendChild(feedbackText);

    //add icon and feedback text to feedbackHolder
    feedbackHolder.appendChild(icon);
    feedbackHolder.appendChild(feedback);
    
    //default state to hidden if toggle history is off
    if (document.getElementById("recentFeedback").style.display != "none"){
        feedbackHolder.setAttribute("style", "display: none;");
    }

    //add everything to the top of feedback
    return feedbackHolder;
}

/*-------OTHER FUNCTIONS-------*/
/**
 * checks if the guess has been entered
 *
 * @param {keyof} e keystroke
 **/
 function checkSubmit(e) {
    //if player clicks enter key, register a submitted guess
    if(e && e.keyCode == 13) {
        onSubmit();
    }
}

/**
 * Toggles feedback history when player clicks
 **/
function toggleHistory(){
    if (document.getElementById("recentFeedback").style.display != "none"){
        let history = document.getElementsByClassName("feedbackHolder");
            for (let i = 0; i < history.length; i++){
                history[i].style.display = "";
            }
        document.getElementById("recentFeedback").style.display = "none";
    } else {
        let history = document.getElementsByClassName("feedbackHolder");
            for (let i = 0; i < history.length; i++){
                history[i].style.display = "none";
            }
        document.getElementById("recentFeedback").style.display = "";
    }
}