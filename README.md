# Description
mastermind-game is a web browser game created as part of my application to LinkedIn's REACH Apprenticeship program (UI Engineer)

## Game Rules
- You have 10 chances to guess the correct code
- Your guess must consists of 4 numbers between 0 and 7 (0 and 7 included)
- You will receive feedback at the end of each guess. The feedback will tell you how many digits you guessed in the correct location, and how many that are in the code but not in the correct location.
- You can view your entire feedback history by clicking the "View message history" under the feedback dialogue box.
- Click on the question mark at the top of the page to review these instructions at any time.

# How to Run the Game
Navigate to [https://missjantastic.github.io/mastermind-game](https://missjantastic.github.io/mastermind-game)

## Developer Tools
You can test the game using Developer tools on your browser (right click -> Inspect)
The generated random array is displayed on the console for ease of testing. This way, you can easily be aware of the random pattern when testing inputs.

*Note: The game has only been tested on Google Chrome and Microsoft Edge. Additionally, while the website was built with responsiveness in mind, it is not optimized for mobile (though mobile gameplay is still possible).*

# Project Details
## File Structure
The game is made on a single web page
- index.html contains the page structure
- styles.css contains all of the css associated with the game
- scripts.js contains all of the functions associated with the game's UI
- resources directy contains all of the image files used in the game

## Process
1. Planning: taking notes on the project requirements, planning things out, breaking down the problem, writing pseudocode
2. Designing: designed the visual prototype using Adobe XD (it is easier for me to code with a visual end product in mind)
3. Code skeleton: created a barebones HTML interface, coded basic game functionality with JavaScript
4. Add styling: added styling to make the actual website match my design prototype
5. Add improvements and extras
- *(and of course, lots of debugging and refactoring along the way)*

## Challenges
- Lots of improvements and debugs had to be made to the game logic, specifically related to comparing the user guesses to the actual random pattern
- Some challenges with the feedback logic, specifically with deciding how to display the feedback/toggle its display
- Making the visual elements responsive
- This was my first time implementing an API
- This program is coded purely in HTML/CSS/JS; the code would likely be more clean, efficient, and expandable if I had implemented jQuery and React
- Lots of ideas that I wanted to implement, but could not in the original time frame. As I am still learning, I am not as fast as I would like to be. (may try to implement them on my own later, for fun; they're listed in the "future goals" section)

## Extensions Implemented/Attempted
- I took a lot of creative liberty with the visual elements/UI of the game. I wanted it to be a fun "detective style" game. I wanted the user interface to be simple, clean, and aesthetically pleasing
- Also added a bit of a story/fun dialogue to give the game a little bit more personality

# Future Goals
- Refactor the code, this time using jQuery and React. I did not feel comfortable enough with the libraries/frameworks to code with them for this project. But I know they are widely used and necessary to know, and will definitely learn to use them proficiently
- Expand the story, add more fun options and details like levels, hints, extended dialogue, and game modes (e.g. pictures instead of numbers)
- Make some improvements to user experience (e.g. easier input navigation like auto-tab and traversing with arrow keys)
- Optimize for mobile

# Reflection
I had a lot of fun with this project! And it honestly forced me to learn a lot of new things, as projects do. Regardless of the outcome of my application, I can definitely say this project has taugh me some valuable skills, strengthened my current ones, and inspired me to continue learning and improving!

# Credits
This project uses random.org's [Number Generator API](https://www.random.org/clients/http/api/)
