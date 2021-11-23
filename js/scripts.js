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

    let helpButton = document.getElementById("helpButton");
    let helpContainer = document.getElementById("helpContainer");
    let closeButton = document.getElementById("closeButton");
    let welcomeContainer = document.getElementById("welcomeContainer");
    let startButton = document.getElementById("startButton");
    welcomeContainer.classList.add("show");

    helpButton.addEventListener("click", () => {
        helpContainer.classList.add("show");
    });
    closeButton.addEventListener("click", () => {
        helpContainer.classList.remove("show");
    });
    startButton.addEventListener("click", () => {
        welcomeContainer.classList.remove("show");
    });
    helpContainer.addEventListener("click", () => {
        helpContainer.classList.remove("show");
    });
    welcomeContainer.addEventListener("click", () => {
        welcomeContainer.classList.remove("show");
    });
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
    let isValidated = validateInput(playerGuesses);
    
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

function validateInput(playerGuesses) {
    let validator = document.getElementById("guessesLeftText");

    //if any of the input fiels are empty
    if(playerGuesses.includes(undefined || "")) {
        validator.innerHTML= "Make sure you have a guess for each slot!";
        validator.style.display="block";
        return false;
    } else if(playerGuesses.find(slot => slot < 0 || slot > 7)){
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
    guessesLeftText.innerHTML= `${guessesLeft} GUESSES REMAINING`;
    return guessesLeft;
}

function submitGuess(playerGuesses){
    //copy pattern and guess arrays to local scope
    let pattern = randPattern.map((x) => x);
    let guesses = playerGuesses.map((x) => x);
    let allCorrect = false;
    let locMatches = 0;
    let existingNums = 0;

    //an array containing the differences of the random pattern - player's guesses
    //an index with zero would indicate a location match
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
    } else {
        //for every number in guesses, check if there is a match in pattern
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

    sendResponse(allCorrect, locMatches, existingNums, playerGuesses);
    return;
}

function sendResponse(allCorrect, locMatches, existingNums, playerGuesses){
    let guessMessage = "Your guess: " + playerGuesses.join(' ');
    let responseMessage;

    //run this code if the entire guess is correct
    if (allCorrect) {
        responseMessage = "Wow! You guessed the randPattern! You're a master codebreaker! Refresh to restart.";
    }
    //else run this code if any part of their guess is correct in some way
    else if (locMatches > 0 || existingNums > 0){
        responseMessage = `You have ${locMatches} of your guesses in the correct location. You have also guessed ${existingNums} matching numbers that are in the wrong location. The rest are incorrect.`;
    } 
    //else run this code is their guess is completely incorrect
    else {
        responseMessage = "None of these numbers are correct.";
    }

    document.getElementById("recentFeedbackText").innerHTML = guessMessage + "<br/>" + responseMessage;

    createFeedbackElements(guessMessage, responseMessage);

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
    
    //default state to hidden if toggle history off
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