// Starting game board values
var cardsInDeck = cards;	//Pulling from cards.js file of full list of possible cards
var currentTurn = "player";
var currentWager = 0;
var currentChipBalance = 500; //Subject to change based on local storage
var gameWinner; // To be declared at end of game
var isGameOver = false;

// Dealer hand and starting totals
var dealerHand = [];
var dealerHandTotal = 0;
var dealerGameBoard = $("#dealer");
var dealerStatus = "start"; // Possible statuses are start (initial gameplay), stand, hit

// Player hand and starting totals
var playerHand = [];
var playerHandTotal = 0;
var playerGameBoard = $("#user-hand");
var playerHandTotalDisplay = $(".hand-total");
var playerStatus = "start";  // Possible statuses are start (initial gameplay), stand, hit

// Because aces can equal 1 or 11, need to quickly know if player has aces so we can
// adjust value from 11 to 1 if they go over 21 (default value is 11)
var playerHasAce = false;  

// Player split game variables only used if the player splits their hand
var splitGame = false; // default value is false, must be turned true
var playerSplitHand = [];
var playerSplitHandTotal = 0;
var playerSplitGameBoard = $("#user-split-hand");
var playerSplitHandTotalDisplay = $(".split-hand-total");
var playerSplitStatus;

// Buttons pulled from DOM
var startButton = $("#start-game-button");
var doubleDownButton = $("#double-down-button");
var hitButton = $("#hit-button");
var standButton = $("#stand-button");
var splitButton = $(".split-button");
var playAgainButton = $(".new-game-button"); 

// Function to toggle a button off dependent on gameplay stage
function disableButton(buttonName) {
	$(buttonName).off();
	$(buttonName).addClass("disabled-button");
}

function enableButton(buttonName, event) {
	$(buttonName).click(event);
	$(buttonName).removeClass("disabled-button");
}

// To update chip and hand totals throughout the game
function updateVisibleChipBalances() {
	$(".current-wager").text(currentWager);
	$(".current-chip-balance").text(currentChipBalance);
}

function updateVisibleHandTotals() {
	$(playerHandTotalDisplay).text(playerHandTotal);
	$(playerSplitHandTotalDisplay).text(playerSplitHandTotal);

	// If the dealer has not played yet or game is not over, only show value of 1st card
	// as the player is still making their initial moves
	if (dealerHand.length === 2) {
		if (isGameOver === false && dealerStatus === "start") {
			$(".dealer-hand-total").text(dealerHandTotal - dealerHand[1].value);
		} else {
			$(".dealer-hand-total").text(dealerHandTotal);
		}
	} else {
		$(".dealer-hand-total").text(dealerHandTotal);
	}

}

function selectWager(amount){
	currentWager = amount;
	updateVisibleChipBalances();
}


// 	ANIMATIONS/INTERACTIVITY:
function flipHiddenCard() {
	// If it's just the initial round, first we need to flip/reveal the hidden dealer card when this is called
	if (dealerHand.length === 2) {
		$("#dealer-card-1").addClass("flipped");
		setTimeout(function(){
			$("#dealer-card-1").attr("src", "img/" + dealerHand[1].src);
		}, 250);	
	} 
}

// Used in split game mode, shrinks the inactive deck and totals
function scaleDownDeck(deck, totalDisplay) {
	$(totalDisplay).addClass("splithand-scaledown");
	$(deck).addClass("splithand-scaledown");
}

// Used in split game mode, enlarges the deck and totals when turn active or when
// dome with gameplay
function enlargeDeck(deck, totalDisplay) {
	$(totalDisplay).removeClass("splithand-scaledown");
	$(deck).removeClass("splithand-scaledown");
}

$(".button-collapse").sideNav();	// Materialize functionality

$(".rules-nav").click(function(){
	$("#rules").toggle("blind", 500);
	$('.button-collapse').sideNav('hide');
});

$("#rules-close").click(function(){
	$("#rules").hide("blind", 500);
});

$(".modal").modal({ //Materialize modal
      dismissible: false, 
      opacity: .40, 
      inDuration: 300, 
      outDuration: 200, 
      startingTop: "10%", // Starting top style attribute
      endingTop: "10%", // Ending top style attribute
    }
  );

// EVENT LISTENERS:
// Adjust wager based on chip clicked
$("#chip-10").click(function(){selectWager(10)});
$("#chip-25").click(function(){selectWager(25)});
$("#chip-50").click(function(){selectWager(50)});
$("#chip-100").click(function(){selectWager(100)});

// Button activation
$(startButton).click(startGame);
$(doubleDownButton).click(doubleDown);  //may not want to call this right away?
$(hitButton).click(hit);
$(standButton).click(stand);
$(playAgainButton).click(newGame);
$(".reduce-aces-button").click(   // Can only see this if player draws 2 aces, would only be reducing in 1st deck
	function(){
		reduceAcesValue(playerHand);
}); 


// Not calling split button at beginning since it should only be activated in certain situations

// TO DO:
// Finish ace modal
// Icons for bank, chips
// Local storage detects first time visit, displays more robust rules/welcome message?
// Local storage for chip balance
// Prompt user for name?
// Way to turn off split button if they dont split
// Switch statement for win?
