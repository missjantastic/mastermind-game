let guesses = 10;

function onSubmit() {
    let slot1 = document.getElementById("slot1").value;
    let slot2 = document.getElementById("slot2").value;
    let slot3 = document.getElementById("slot3").value;
    let slot4 = document.getElementById("slot4").value;

    let isValidated = validateGuesses(slot1, slot2, slot3, slot4);
    
    if(!isValidated) {
        return;
    }

    countGuesses();
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
}