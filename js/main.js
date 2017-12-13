// Starting game board values
var cardsInDeck = cards;	//Pulling from cards.js file of full list of possible cards
var currentTurn = "player";
var currentWager = 0;
var currentChipBalance = 500; //Subject to change based on local storage

// Dealer hand and starting totals
var dealerHand = [];
var dealerHandTotal = 0;
var dealerGameBoard = $("#dealer");
var dealerStatus = "start"; // Possible statuses are start (initial gameplay), stand, hit

// Player hand and starting totals
var playerHand = [];
var playerHandTotal = 0;
var playerGameBoard = $("#user-hand");
var playerStatus = "start";  // Possible statuses are start (initial gameplay), stand, hit

// Because aces can equal 1 or 11, need to quickly know if player has aces so we can
// adjust value from 11 to 1 if they go over 21 (default value is 11)
var playerHasAces = false;  

// Player split game variables only used if the player splits their hand
var splitGame = false; // default value is false, must be turned true
var playerSplitHand = [];
var playerSplitHandTotal = 0;
var playerSplitGameBoard = $("#user-split-hand");
var playerSplitStatus;

// Buttons pulled from DOM
var startButton = $("#start-game-button");
var doubleDownButton = $("#double-down-button");
var hitButton = $("#hit-button");
var standButton = $("#stand-button");
var splitButton = $("#split-button");

// Function to toggle a button off dependent on gameplay stage
var disableButton = function(buttonName) {
	$(buttonName).off();
	$(buttonName).addClass("disabled-button");
}

// PAGE/NON GAME INTERACTIONS:
// Possible to do: Break out page transitional elements into separate JS file
$(".button-collapse").sideNav();	// Materialize functionality

// EVENT LISTENERS:
// Adjust wager based on chip clicked
$("#chip-5").click(function(){currentWager = 5;});
$("#chip-25").click(function(){currentWager = 25;});
$("#chip-50").click(function(){currentWager = 50;});
$("#chip-100").click(function(){currentWager = 100;});

// Button activation
$(startButton).click(startGame);
$(doubleDownButton).click(doubleDown);  //may not want to call this right away?
$(hitButton).click(hit);
$(standButton).click(stand);
$(splitButton).click(split);  //may not want to call this right away?


// TO DO:
// Add logic for WHEN they can split the game, should only appear on certain circumstances
// Flip over card on gameover if it is not flipped yet
// Animate flipcard function
// Local storage for chip balance
// Prompt user for name?
// Reset game
// Win logic impacts where the chips go
// Animation toggling off and on rules and start game 
// Set winner then run function for popup that inputs values and impacts numbering based on winner
// Switch statement for win?
// Toggle mobile view of full dealer cards once it is dealer's turn
// Maybe have condensed/expandable view of this -- or show total and let them expand?