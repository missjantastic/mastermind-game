let guesses;
let comboArray;
newGame();

function newGame(){
    guesses = 10;
    httpGetAsync('https://www.random.org/integers/?num=4&min=0&max=7&col=1&base=10&format=plain&rnd=new', function(result){
        comboArray = result.split("\n");
        comboArray.pop();
        console.log(comboArray);
    });
}


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

function onSubmit() {
    let slot1 = document.getElementById("slot1").value;
    let slot2 = document.getElementById("slot2").value;
    let slot3 = document.getElementById("slot3").value;
    let slot4 = document.getElementById("slot4").value;
    let guessArray = [slot1, slot2, slot3, slot4];

    let isValidated = validateGuesses(slot1, slot2, slot3, slot4);
    
    if(!isValidated) {
        return;
    }

    if(countGuesses()==0){
        alert("Game over!");
        return;
    }

    if(compareAnswers(guessArray))
    {
        alert("You won! Game will now restart");
        reload();
    }
}

function validateGuesses(slot1, slot2, slot3, slot4) {
    let validator = document.getElementById("validator");

    if(slot1 == "" || slot2 == "" || slot3 == "" || slot4 == "") {
        validator.innerHTML= "Make sure you have a guess for each slot!";
        validator.style.display="block";
        return false;
    } else if(slot1 > 7 || slot1 < 0 || slot2 > 7 || slot2 < 0 || slot3 > 7 || slot3 < 0 || slot4 > 7 || slot4 < 0) {
        validator.innerHTML= "Make sure your guesses are between 0 and 7!";
        validator.style.display="block";
        return false;
    } else {
        validator.style.display = "none";
        return true;
    }
}

function countGuesses(){
    let guessesLeft = document.getElementById("guessesLeft");
    guesses = guesses - 1;
    guessesLeft.innerHTML= `You have ${guesses} guesses remaining!`;
    if (guesses == 0) {
        return 0;
    }
}

function compareAnswers(guessArray){
    let allCorrect = false;
    let isCorrectLoc = false;
    let isCorrectNum = false;
    let feedback = document.createElement("p");
    let message = "";
    let element = document.getElementById("feedback_log");
    
    if (guessArray==comboArray){
        allCorrect = true;
    } else if(slot1 == comboArray[0] || slot2 == comboArray[1] || slot3 == comboArray[2] || slot4 == comboArray[4]) {
        isCorrectLoc = true;
    } else {
    for (let i = 0; i < comboArray.length; i++) {
        if(slot1 == comboArray[i] || slot2 == comboArray[i] || slot3 == comboArray[i] || slot4 == comboArray[i]){
            isCorrectNum = true;
            break;
        }
    }}

    if (allCorrect){
        message = "Wow! You guessed the combination! You're a master codebreaker!";
    } else if (isCorrectLoc){
        message = "You have at least one guess in the correct location.";
    } else if (isCorrectNum) {
        message = "You have guessed at least one number correctly.";
    } else {
        message = "None of these numbers are correct. ";
    }

    let feedbackText = document.createTextNode(message);
    feedback.appendChild(feedbackText);
    element.appendChild(feedback);
    return allCorrect;
}