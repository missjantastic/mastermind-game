let guesses;
let comboArray;
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
    httpGetAsync('https://www.random.org/integers/?num=4&min=0&max=7&col=1&base=10&format=plain&rnd=new', function(result){
        comboArray = result.split("\n");
        comboArray.pop();
        console.log(comboArray);
    });
}

function checkSubmit(e) {
    if(e && e.keyCode == 13) {
        onSubmit();
     }
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
        alert("You lose! Game will now restart");
        location.reload();
    }

    if(compareAnswers(guessArray))
    {
        alert("You won! Game will now restart");
        location.reload();
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
    let CorrectLoc = 0;
    let CorrectNum = 0;
    let feedback = document.createElement("p");
    let message = "";
    let element = document.getElementById("feedback_log");
    let compareArray = comboArray.map((slot, i) => slot - guessArray[i]);
    console.log(compareArray);

    let matches = compareArray.filter(match => match == 0);
    console.log(matches);

    
    if (matches.length == 4){
        allCorrect = true;
        return allCorrect;
    } else {

        CorrectLoc = matches.length;
        for (let i = 0; i < compareArray.length; i++) {
            if (compareArray[i] == 0){
                comboArray.splice(i, 1);
            }
        }
        for (let i = 0; i < guessArray.length; i++) {
            if (comboArray.includes(guessArray[i])){
                CorrectNum += 1;
            }
        }
    }

    if (allCorrect) {
        message = "Wow! You guessed the combination! You're a master codebreaker!";
    }
    else if (CorrectLoc > 0 || CorrectNum > 0){
        message = `You have ${CorrectLoc} of your guesses in the correct location. You have also guessed ${CorrectNum} matching numbers that are in the wrong location. The rest are incorrect.`;
    } else {
        message = "None of these numbers are correct.";
    }

    let feedbackText = document.createTextNode(message);
    feedback.appendChild(feedbackText);
    element.appendChild(feedback);
    return allCorrect;
}