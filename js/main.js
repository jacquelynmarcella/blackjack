// Starting game board values
var cardsInDeck = cards;	//Pulling from cards.js file of full list of possible cards
var currentTurn = "player";
var currentWager = 0;
var currentChipBalance = 500; //Subject to change based on local storage
var gameWinner; // To be declared at end of game

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
var playerHasAce = false;  

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
var playAgainButton = $("#play-again-button");
var displayWagerOptionsButton = $("#display-wager-options-button");
var resumeGameButton = $("#resume-game-button");

// Function to toggle a button off dependent on gameplay stage
function disableButton(buttonName) {
	$(buttonName).off();
	$(buttonName).addClass("disabled-button");
}

function enableButton(buttonName, event) {
	$(buttonName).click(event);
	$(buttonName).removeClass("disabled-button");
}

function flipHiddenCard() {
	// If it's just the initial round, first we need to flip/reveal the hidden dealer card when this is called
	if (dealerHand.length === 2) {
		$("#dealer-card-1").attr("src", "img/" + dealerHand[1].src);
	} 
}

function updateVisibleChipBalances() {
	$("#current-wager").text(currentWager);
	$(".current-chip-balance").text(currentChipBalance);
}

// PAGE/NON GAME INTERACTIONS:
// Possible to do: Break out page transitional elements into separate JS file
$(".button-collapse").sideNav();	// Materialize functionality

// EVENT LISTENERS:
// Adjust wager based on chip clicked
$("#chip-10").click(function(){currentWager = 10;});
$("#chip-25").click(function(){currentWager = 25;});
$("#chip-50").click(function(){currentWager = 50;});
$("#chip-100").click(function(){currentWager = 100;});

// Button activation
$(startButton).click(startGame);
$(doubleDownButton).click(doubleDown);  //may not want to call this right away?
$(hitButton).click(hit);
$(standButton).click(stand);
// Not calling split button at beginning since it should only be activated in certain situations

// TO DO:
// Animate flipcard function
// Local storage for chip balance
// Prompt user for name?
// Reset game
// Animation toggling off and on rules and start game 
// Set winner then run function for popup that inputs values and impacts numbering based on winner
// Switch statement for win?
// Toggle mobile view of full dealer cards once it is dealer's turn
// Maybe have condensed/expandable view of this -- or show total and let them expand?
// New round/play again button that starts game