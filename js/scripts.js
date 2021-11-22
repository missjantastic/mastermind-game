let guessesLeft = 10;
let randPattern;
newGame();

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function newGame(){

    //retrieve randPattern of four random numbers from API and store them into an array
    httpGetAsync('https://www.random.org/integers/?num=4&min=0&max=7&col=1&base=10&format=plain&rnd=new', function(result){
        randPattern = result.split("\n");
        randPattern.pop();
        console.log(randPattern);
    });
    document.getElementById("recentFeedbackText").innerHTML = "I'll send your feedback here, Detective.";
}

function helpOnClick(){
    alert("HALP!");
}

function checkSubmit(e) {
    //if player clicks enter key, register a submitted guess
    if(e && e.keyCode == 13) {
        onSubmit();
     }
}


function onSubmit() {
    //load player guesses into an array
    let slot1 = document.getElementById("slot1").value;
    let slot2 = document.getElementById("slot2").value;
    let slot3 = document.getElementById("slot3").value;
    let slot4 = document.getElementById("slot4").value;
    let playerGuesses = [slot1, slot2, slot3, slot4];

    //validate that input meets requiremets
    let isValidated = validateInput(slot1, slot2, slot3, slot4);
    
    //if the input is not valid, exit function/don't submit input
    if(!isValidated) {
        return;
    }

    //if they run out of guesses, end game
    if(countGuesses()==0){
        alert("You lose! Game will now restart");
        location.reload();
    }

    submitGuess(playerGuesses);
}

function validateInput(slot1, slot2, slot3, slot4) {
    let validator = document.getElementById("guessesLeftText");

    //if any of the input fiels are empty
    if(slot1 == "" || slot2 == "" || slot3 == "" || slot4 == "") {
        validator.innerHTML= "Make sure you have a guess for each slot!";
        validator.style.display="block";
        return false;
    } else if(slot1 > 7 || slot1 < 0 || slot2 > 7 || slot2 < 0 || slot3 > 7 || slot3 < 0 || slot4 > 7 || slot4 < 0) { //if any of the inputs are not between 0 and 7
        validator.innerHTML= "Make sure your guesses are between 0 and 7!";
        validator.style.display="block";
        return false;
    } else {
        return true;
    }
}

function countGuesses(){
    let guessesLeftText = document.getElementById("guessesLeftText");
    guessesLeft -= 1;
    guessesLeftText.innerHTML= `You have ${guessesLeft} guesses remaining!`;
    return guessesLeft;
}

function submitGuess(playerGuesses){
    let pattern = randPattern.map((x) => x);
    let guesses = playerGuesses.map((x) => x);
    let allCorrect = false;
    let locMatches = 0;
    let existingNums = 0;

    //an array containing the differences of the random pattern - player's guesses
    //an index with zero would indicate the index of a location match
    let differences = pattern.map((slot, i) => slot - playerGuesses[i]);

    //an array of zeros, used to count the matches (sourced from differences)
    let matches = differences.filter(match => match == 0);
    
    if (matches.length == 4){ //if all four guesses are correct
        allCorrect = true;
    } else {
        locMatches = matches.length;

        //this marks any location matches with a -1 so they are no longer considered
        for (let i = 0; i < differences.length; i++) {
            if (differences[i] == 0){
                pattern[i] = -1;
                guesses[i] = -2;
            }
        }
        //this checks for matches that are not in the right location
        for (let i = 0; i < guesses.length; i++) {
            if (pattern.includes(guesses[i])){
                existingNums += 1;
            }
        }
    }

    sendResponse(allCorrect, locMatches, existingNums, playerGuesses);
    return;
}

function sendResponse(allCorrect, locMatches, existingNums, playerGuesses){
    let guessMessage = "Your guess: " + playerGuesses.join(' ');
    let message;

    //run this code if the entire guess is correct
    if (allCorrect) {
        message = "Wow! You guessed the randPattern! You're a master codebreaker! Refresh to restart.";
    }
    //else run this code if any part of their guess is correct in some way
    else if (locMatches > 0 || existingNums > 0){
        message = `You have ${locMatches} of your guesses in the correct location. You have also guessed ${existingNums} matching numbers that are in the wrong location. The rest are incorrect.`;
    } 
    //else run this code is their guess is completely incorrect
    else {
        message = "None of these numbers are correct.";
    }

    document.getElementById("recentFeedbackText").innerHTML = guessMessage + "<br/>" + message;

    createFeedbackElements(guessMessage, message);

    return;
}

function createFeedbackElements(guess, response){
    //div to prepend elements to
    let element = document.getElementById("feedbackLog");
    
    //create new feedbackholder div
    let feedbackHolder = document.createElement("div");
    feedbackHolder.setAttribute("class","feedbackHolder");

    //create icon
    let icon = document.createElement("div");
    icon.setAttribute("class","detective pic");

    //create text message
    let feedback = document.createElement("p");
    feedback.setAttribute("class", "feedback");

    //add everything to feedbackHolder div
    let guessText = document.createTextNode(guess)
    let feedbackText = document.createTextNode(response);
    feedback.appendChild(guessText);
    feedback.appendChild(document.createElement('br'));
    feedback.appendChild(feedbackText);

    feedbackHolder.appendChild(icon);
    feedbackHolder.appendChild(feedback);
    
    if (document.getElementById("recentFeedback").style.display != "none"){
        feedbackHolder.setAttribute("style", "display: none;");
    }

    //element.appendChild(feedbackHolder);
    element.insertBefore(feedbackHolder, element.firstChild);
}

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