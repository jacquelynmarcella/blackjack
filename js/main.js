// Setting up an array of cards in the current deck so that way we can pop
// cards out of it as the came progresses without impacting the original array
// that holds all possible card values
var cardsInDeck = cards;
var dealerHand = [];
var playerHand = [];

var playerHandTotal = 0;
var dealerHandTotal = 0;

// This will increment if the player draws an ace
// Aces are important as if the player goes over 21, they will want their ace to equal
// 1 not 11 per blackjack rules
var playerAces = 0;

var dealerGameBoard = $("#dealer");
var playerGameBoard = $("#user-hand");

// Possible statuses are start (initial gameplay), stand, hit
var dealerStatus = "start";
var playerStatus = "start";

// Starts game as players turn
var currentTurn = "player";



var gameOver = function() {

}


var checkForWin = function() {

console.log("Current total for dealer is " + dealerHandTotal + ". Current total for player is " + playerHandTotal);

	// Checking for win while player is going
	if (currentTurn === "player") {

		// First, see if exactly 21
		if (playerHandTotal === 21) {
			console.log("You win");

		// If they have greater than 21, first check if they have an ace
		} else if (playerHandTotal > 21) {
		
			if (playerAces > 0) {
				console.log("Player has an ace");

				//Update total to turn ace into value of 1 instead of 11
				// To do: May need to update value in index instead? This may be buggy if they get a second ace
				playerHandTotal = playerHandTotal - (playerAces * 10);
				$("#hand-total").text(playerHandTotal);
				console.log("Player's new score is " + playerHandTotal);
				Materialize.toast("Your ace value changed from 11 to 1", 4000);
				
				// Now with the new total, see if they won
				if (playerHandTotal === 21) {
					console.log("Thanks to that ace, you win");
				} else if (playerHandTotal < 21) {
					console.log("Thanks to that ace, keep on playing");
				} else if (playerHandTotal > 21) {
					console.log("The ace couldn't save you, you lose.")
				}

			} else if (playerAces === 0) {
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
			console.log("Player wins");

		// If dealer's cards are 17 or above, must stand
		} else if (dealerHandTotal >= 17) {
			dealerStatus = "stand";
			console.log("Dealer is now standing");
			checkForWin();
		} 

	// Now, we need to compare scores if both are under 21 and standing
	} else if (dealerStatus === "stand" && playerStatus =="stand") {
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

	// To Do: work on animations as they go from pile to appropriate location
	cardImage.appendTo($(location));

	// Update total count of cards in hand based on who is playing
	if (currentTurn === "player") {

		// Check for aces
		if (hand[index].name === "ace") {
			playerAces++;
		}

		// Update scores and totals
		playerHandTotal += hand[index].value;
		cardImage.attr("id", "player-card-" + index);
		$("#hand-total").text(playerHandTotal);

	} else if (currentTurn === "dealer") {
		dealerHandTotal += hand[index].value;
		cardImage.attr("id", "dealer-card-" + index);

		// Shows only the first card to mobile viewers in an abbreviated form
		// To do: once or if dealer stands, then expand out full card view for the dealer
		// as they make their next plays
		if (index === 0) {
			$("#dealer-condensed").text(hand[0].suit + " " + hand[0].name);
		}
		
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
	console.log("Player is requesting another card");
	currentTurn = "player"; //Just to make sure this is the case, for now..
	playerStatus = "hit";
	dealCard(playerHand, playerGameBoard);
});

$("#stand-button").click(function(){
	console.log("Player is standing");
	currentTurn = "dealer";
	playerStatus = "stand";
	dealerStatus = "hit";
	checkForWin(); //We need to see the dealer's card before they just draw again
});

// Navigation button on mobile
// TO DO: Break out page transitional elements into separate JS file
$(".button-collapse").sideNav();


startGame();
