// Setting up an array of cards in the current deck so that way we can pop
// cards out of it as the came progresses without impacting the original array
// that holds all possible card values
var cardsInDeck = cards;
var dealerHand = [];
var playerHand = [];

var playerHandTotal = 0;
var dealerHandTotal = 0;

// Since aces get treated differently, it's good to know if players have them!
// These will get shifted to true if they get an ace but start out default as false
var playerHasAce = false;
var dealerHasAce = false;

var dealerGameBoard = $("#dealer");
var playerGameBoard = $("#user-hand");

// Possible statuses are start (initial gameplay), stand, hit
var dealerStatus = "start";
var playerStatus = "start";

// Starts game as players turn
var currentTurn = "player";


var checkForWin = function() {

console.log("Current total for dealer is " + dealerHandTotal + ". Current total for player is " + playerHandTotal);

	if (currentTurn === "player") {
		if (playerHandTotal === 21) {
			console.log("You win");

		} else if (playerHandTotal > 21) {

			// First, see if they have an ace since this will adjust their score
			if (playerHasAce === true) {
				console.log("Player has an ace");

				//Update total to turn ace into value of 1 instead of 11
				playerHandTotal -= 10;
				$("#hand-total").text(playerHandTotal);
				console.log("Player's new score is " + playerHandTotal);
				
				// Now with the new total, see if they won
				if (playerHandTotal === 21) {
					console.log("Thanks to that ace, you win");
				} else if (playerHandTotal < 21) {
					console.log("Thanks to that ace, keep on playing");
				} else if (playerHandTotal > 21) {
					console.log("The ace couldn't save you, you lose.")
				}

			} else if (playerHasAce === false) {
				console.log("You have lost this game.");
			}
		}	

	// If it's before we have seen the hidden dealer card (ie still player's turn), we don't want the below to run
	} else if (currentTurn === "dealer" && dealerStatus === "hit") {

		// If it's just the initial round, first we need to flip the hidden card
		if (dealerHand.length === 2) {
			$("#dealer-card-1").attr("src", "img/" + dealerHand[1].src);
		} 

		// Now, run through what the dealer should do next based on standard rules
		if (dealerHandTotal < 17) {
			dealCard(dealerHand, dealerGameBoard);

		} else if (dealerHandTotal === 21) {
			console.log("Dealer wins");

		} else if (dealerHandTotal > 21) {
			console.log("You win");

		// If dealer's cards are 17 or above, must stand
		} else if (dealerHandTotal >= 17) {
			dealerStatus = "stand";
			console.log("Dealer is now standing");
		} 
	}

	// Now, we need to compare scores if both are under 21 and standing
	if (dealerStatus === "stand" && playerStatus =="stand") {
		if (playerHandTotal > dealerHandTotal) {
			console.log("Player wins");
		} else if (playerHandTotal < dealerHandTotal) {
			console.log("Dealer wins");
		} else if (playerHandTotal === dealerHandTotal) {
			console.log("There was a draw");
		}
	}

	//TO DO: If there's a win remove event listeners and show some kind of game over screen
}

// Can put player or dealer into function to make this action work for both
var dealCard = function(hand, location) {
	var cardDrawn = cardsInDeck.pop();
	hand.push(cardDrawn);
	var index = hand.length - 1;

	// Change images
	var cardImage = $("<img/>");
	cardImage.attr("class", "card");
	cardImage.attr("src", "img/" + hand[index].src);
	cardImage.appendTo($(location));

	// Update total count of cards in hand based on who is playing
	if (currentTurn === "player") {

		// Check for aces
		if (hand[index].name === "ace") {
			playerHasAce = true;
		}

		// Update scores and totals
		playerHandTotal += hand[index].value;
		cardImage.attr("id", "player-card-" + index);
		$("#hand-total").text(playerHandTotal);

	} else if (currentTurn === "dealer") {
		dealerHandTotal += hand[index].value;
		cardImage.attr("id", "dealer-card-" + index);

		// Second card only for dealer should show face down
		if (dealerHand.length === 2) {
			cardImage.attr("src", "img/card_back.png");
		}
	}

	checkForWin();

	//TO DO: Second card should be face down for dealer only
}

var startGame = function() {
	// Shuffles the card deck array
	cardsInDeck.sort(function() 
		{return 0.5 - Math.random()});

	// Deals two cards to start, so loops through ths twice
	for (var i=0; i < 2; i++) {

		currentTurn = "player";
		dealCard(playerHand, playerGameBoard);

		currentTurn = "dealer";
		dealCard(dealerHand, dealerGameBoard);
	}
}

// Event listeners
$("#hit-button").click(function(){
	currentTurn = "player"; //Just to make sure this is the case, for now..
	playerStatus = "hit";
	dealCard(playerHand, playerGameBoard);
});

$("#stand-button").click(function(){
	console.log("Stand button clicked");
	currentTurn = "dealer";
	playerStatus = "stand";
	dealerStatus = "hit";
	checkForWin(); //We need to see the dealer's card before they just draw again
});

// Navigation button on mobile
// TO DO: Break out page transitional elements into separate JS file
$(".button-collapse").sideNav();


startGame();
