let guessesLeft;
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
    guesses = 10;

    //retrieve randPattern of four random numbers from API and store them into an array
    httpGetAsync('https://www.random.org/integers/?num=4&min=0&max=7&col=1&base=10&format=plain&rnd=new', function(result){
        randPattern = result.split("\n");
        randPattern.pop();
        console.log(randPattern);
    });
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
    let validator = document.getElementById("validator");

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
        validator.style.display = "none";
        return true;
    }
}

function countGuesses(){
    let guessesLeftText = document.getElementById("guessesLeft");
    guessesLeft -= 1;
    guessesLeftText.innerHTML= `You have ${guesses} guesses remaining!`;
    return guessesLeft;
}

function submitGuess(playerGuesses){
    let pattern = randPattern.map((x) => x);
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

        //this removes any location matches so they are no longer considered
        for (let i = 0; i < differences.length; i++) {
            if (differences[i] == 0){
                pattern.splice(i, 1);
            }
        }
        //this checks for matches that are not in the right location
        for (let i = 0; i < playerGuesses.length; i++) {
            if (pattern.includes(playerGuesses[i])){
                existingNums += 1;
            }
        }
    }

    sendResponse(allCorrect, locMatches, existingNums);
    return;
}

function sendResponse(allCorrect, locMatches, existingNums){
    let feedback = document.createElement("p");
    let message = "";
    let element = document.getElementById("feedback_log");

    //run this code if the entire guess is correct
    if (allCorrect) {
        message = "Wow! You guessed the randPattern! You're a master codebreaker! The game will restart now";
        location.reload();
    }
    //else run this code if any part of their guess is correct in some way
    else if (locMatches > 0 || existingNums > 0){
        message = `You have ${locMatches} of your guesses in the correct location. You have also guessed ${existingNums} matching numbers that are in the wrong location. The rest are incorrect.`;
    } 
    //else run this code is their guess is completely incorrect
    else {
        message = "None of these numbers are correct.";
    }

    let feedbackText = document.createTextNode(message);
    feedback.appendChild(feedbackText);
    element.appendChild(feedback);

    return;
}