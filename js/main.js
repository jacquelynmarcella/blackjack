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
// Can this just be one for split and regular and it loops through both arra
var playerAces = 0;

var dealerGameBoard = $("#dealer");
var playerGameBoard = $("#user-hand");

// Possible statuses are start (initial gameplay), stand, hit
var dealerStatus = "start";
var playerStatus = "start";

// If the user splits the game:
var splitGame = false; // default value
var playerSplitStatus;
var playerSplitHand = [];
var playerSplitHandTotal = 0;
var playerSplitGameBoard = $("#user-split-hand");

// Starts game as players turn
var currentTurn = "player";


var gameOver = function() {
	console.log("Game over");

	// Checking final scores

	if (dealerStatus === "stand" && playerStatus =="stand") {

		// Need to check if above or over 21 here and do more robust logic

		if (playerHandTotal > dealerHandTotal) {
			console.log("Player wins with deck 1");

		} else if (playerHandTotal < dealerHandTotal) {
			console.log("Dealer wins");

		// This needs to factor in if both are over 21, both lose.
		} else if (playerHandTotal === dealerHandTotal) {
			console.log("There was a draw");
		}
	}


//TO DO: If there's a win remove event listeners and show some kind of game over screen

}


// Deck should be playerHand or playerSplitHand
// Total should be playerHandTotal or playerSplitHandTotal
var reduceAcesValue = function(deck, total) {

	for (var i = 0; i < deck.length; i++) {
	// Only focusing on aces that haven't been changed from 11 to 1 already
		if (deck[i].name === "ace" && deck[i].value === 11) {
			deck[i].value = 1;
			total -= 10;
				       
			$("#hand-total").text(total);  // Need to adjust this to work w/ both
			console.log("New player score is " + total);
			Materialize.toast("Your ace value changed from 11 to 1", 4000);
		}
	}
}

// Possibly rename this - more of a next move analysis type of thing
// Really need to clean this up
var checkForWin = function() {

console.log("Dealer: " + dealerHandTotal + " | Player : " + playerHandTotal + " | Split Player: " + playerSplitHandTotal);

	// Checking for win while player is going
	if (currentTurn === "player" || currentTurn === "playerSplit") {

		// First, see if exactly 21
		if (playerHandTotal === 21 || playerSplitHandTotal === 21) {
			
			// If it's a splitgame, we need to move onto the next player deck before fully game over
			if (currentTurn === "player" && splitGame === true) {
				playerStatus = "stand";
				currentTurn = "playerSplit";

			} else if (currentTurn === "playerSplit" && splitGame === true) {
				gameOver();
				// If we get 21, should finish up and see if a draw with dealer or if player wins
				// on either one of their decks

			} else if (currentTurn === "player" && splitGame === false) {
				gameOver();
				// If we get 21, should finish up and see if a draw with dealer or if player wins
			}

		// If they have greater than 21, first check if they have an ace
		} else if (playerHandTotal > 21 || playerSplitHandTotal > 21) {
		
			if (playerAces > 0) {

				if (currentTurn === "playerSplit") {
					reduceAcesValue(playerSplitHand, playerSplitHandTotal);

				} else if (currentTurn ==="player") {
					reduceAcesValue(playerHand, playerHandTotal);
				}

				// Now with the new total, see what their standing is
				// because it could be less than 21, or exactly 21 now

				if (playerHandTotal === 21) {

					if (currentTurn === "player" && splitGame === true) {
						playerStatus = "stand";
						currentTurn = "playerSplit";
						// Maybe turn this string into a switch player function since I repeat it
					}

				} else if (playerHandTotal < 21) {
					console.log ("Keep on playing");

				} else if (playerHandTotal > 21) {

					if (currentTurn === "player" && splitGame === true) {
						playerStatus = "stand";
						currentTurn = "playerSplit";
						// Turn this into switch to split deck function (used 3x now)
					} else if (currentTurn === "playerSplit" && splitGame === true) {
						// Shift to dealer's turn now before full game over to see
						// this is because it would only be 1 of 2 decks that is over
					} else if (currentTurn === "player" && splitGame === false) {
						gameOver();
					}
				}

			} else if (playerAces === 0) {
				if (currentTurn === "player" && splitGame === true) {
					playerStatus = "stand";
					currentTurn = "playerSplit";
					// The switch player function again (used 4x now)
				} else if (currentTurn === "splitPlayer" && splitGame === true) {
					// Shift to dealer's turn now before full game over to see
					// this is because it would only be 1 of 2 decks that is over					
				} else if (currentTurn === "player" && splitGame === false) {
					gameOver();
				}
			}
		}	

	// If it's before we have seen the hidden dealer card (ie still player's turn), we don't want the below to run
	} else if (currentTurn === "dealer" && dealerStatus === "hit") {

		// If it's just the initial round, first we need to flip the hidden card
		// Turn this into a flipcard function
		if (dealerHand.length === 2) {
			$("#dealer-card-1").attr("src", "img/" + dealerHand[1].src);
		} 

		// Now, run through what the dealer should do next based on standard rules
		if (dealerHandTotal < 17) {
			dealCard(dealerHand, dealerGameBoard);

		} else if (dealerHandTotal === 21) {
			gameOver();

		} else if (dealerHandTotal > 21) {
			gameOver();

		// If dealer's cards are 17 or above, must stand and then we will check final scores
		} else if (dealerHandTotal >= 17) {
			dealerStatus = "stand";
			gameOver();
		}

	} 

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

		// First, we need to make note of if there's aces or not in the active deck
		if (hand[index].name === "ace") {
			playerAces++;
		}

		// Update scores and totals
		playerHandTotal += hand[index].value;
		cardImage.attr("id", "player-card-" + index);
		$("#hand-total").text(playerHandTotal);

	} else if (currentTurn === "playerSplit") {

		// Check for aces
		if (hand[index].name === "ace") {
			playerAces++;
		}

		// Update scores and totals
		playerSplitHandTotal += hand[index].value;
		cardImage.attr("id", "player-split-card-" + index);
		$("#split-hand-total").text(playerSplitHandTotal);

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
}

var startGame = function() {
	// Shuffles the card deck array
	cardsInDeck.sort(function() 
		{return 0.5 - Math.random()});

	// Deals two cards to start, so loops through this twice
	// In blackjack, 
	for (var i=0; i < 2; i++) {
		currentTurn = "player";
		dealCard(playerHand, playerGameBoard);
		currentTurn = "dealer";
		dealCard(dealerHand, dealerGameBoard);
	}

	// Player starts game
	currentTurn = "player";

	// TO DO: Activate functionality to split game based on matching criteria of card
}

// Event listeners
$("#hit-button").click(function(){
	console.log("Player is requesting another card");

	if (splitGame === true) {
		if (currentTurn === "player") {
			playerStatus = "hit";
			dealCard(playerHand, playerGameBoard);
		} else if (currentTurn === "playerSplit") {
			playerSplitStatus = "hit";
			dealCard(playerSplitHand, playerSplitGameBoard);
		} 
	} else if (splitGame === false) {
		playerStatus = "hit";
		dealCard(playerHand, playerGameBoard);
	}
});

$("#stand-button").click(function(){
	console.log("Player is standing");

	if (splitGame === true) {
		if (currentTurn === "player") {
			currentTurn = "playerSplit";
			playerStatus = "stand";
		} else if (currentTurn === "playerSplit") {
			playerSplitStatus = "stand";
			currentTurn = "dealer";
			dealerStatus = "hit";
			checkForWin();
		}
	} else {
		playerStatus = "stand";
		currentTurn = "dealer";
		dealerStatus = "hit";
		checkForWin();
	}

});


// If a certain criteria is reached, then we need to activate this button (it should not be
// active at the start); only activates after initial dealing if applicable
$("#split-button").click(function(){
	splitGame = true; 

	// Need to adjust scores and totals for each deck
	playerHandTotal = playerHandTotal - playerHand[1].value;
	$("#hand-total").text(playerHandTotal);

	playerSplitHandTotal = playerHand[1].value;
	$("#split-hand-total").text(playerSplitHandTotal);

	// Now, move the item out of the array
	var splitCard = playerHand.pop();
	playerSplitHand.push(splitCard);

	// And move the image on the game board
	var cardImage = $("#player-card-1").attr("id", "player-split-card-0");
	cardImage.appendTo($(playerSplitGameBoard));

	console.log("Split game. Dealer: " + dealerHandTotal + " | Player : " + playerHandTotal + " | Split Player: " + playerSplitHandTotal);

	// TO DO: This button should de-activate after being clicked
	// TO DO: Double down the bets/adjust bets accordingly when this is selected

});

// Navigation button on mobile
// TO DO: Break out page transitional elements into separate JS file
$(".button-collapse").sideNav();


startGame();
