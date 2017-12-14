// This file contains the main logic utilized during active gameplay

// Can put player or dealer into function to make this action work for both
function dealCard(hand, location) {
	// Take the card out of the main array and add to the player or dealer's card deck array
	var cardDrawn = cardsInDeck.pop();
	hand.push(cardDrawn);
	var index = hand.length - 1;

	// Create card image for card drawn and place in player/dealer's card section
	var cardImage = $("<img/>").hide(); //So it doesnt show abruptly
	cardImage.attr("class", "card");
	cardImage.attr("src", "img/" + hand[index].src);

	cardImage.appendTo($(location));
	cardImage.show("fade", 2000);

	// Update total count of cards in hand based on who is playing
	if (currentTurn === "player" || currentTurn === "playerSplit") {

		// Make note of if there's aces or not in the active deck
		if (hand[index].name === "ace") {
			playerHasAce = true;
		}

		// Put into the correct player's hand deck dependent on if deck was split
		if (currentTurn === "player") {
			playerHandTotal += hand[index].value;
			cardImage.attr("id", "player-card-" + index);

		} else if (currentTurn === "playerSplit") {
			playerSplitHandTotal += hand[index].value;
			cardImage.attr("id", "player-split-card-" + index);
		}

	} else if (currentTurn === "dealer") {
		dealerHandTotal += hand[index].value;
		cardImage.attr("id", "dealer-card-" + index);

		// Mobile view has an abbreviated display for dealer only, so update that text
		// but only for the first card as that's all the player can see initially
		if (index === 0) {
			$("#dealer-condensed").text(hand[0].suit + " " + hand[0].name);
		}
		
		// Second card only for dealer should show face down, so need to do just this one as the card back
		if (dealerHand.length === 2) {
			cardImage.attr("src", "img/card_back.png");
		}
	}
	updateVisibleHandTotals();
	evaluateGameStatus();
}


//POSSIBLE LAYOUT FOR FUNCTION

function evaluateGameStatus() {

	console.log("Dealer: " + dealerHandTotal + " | Player : " + playerHandTotal + " | Split Player: " + playerSplitHandTotal);
	// Player can only do double down after first 2 cards drawn
	// But in a split game, want to give them a chance after the deck is split right?
	if (splitGame === true && playerHand.length === 3) {
		disableButton(doubleDownButton);
	} else if (splitGame === false && playerHand.length === 3 || dealerStatus === "hit") {
		disableButton(doubleDownButton);
	}

	// First, if the player has gone over 21 check if they have aces and adjust to
	// from 11 to 1 if we need to
	if (playerHasAce === true && currentTurn === "player" || currentTurn === "playerSplit") {
		reviewAcesValue();
	}

	if (currentTurn === "player" || "playerSplit") {
		isPlayerDone();
	}

	if (currentTurn === "dealer" && dealerStatus === "hit") {
		dealerPlay();
	}
}

function isPlayerDone() {

	if (splitGame === false && playerHandTotal >= 21) {
		gameOver();

	} else if (splitGame === true) {

		if (currentTurn === "player") {

			if (playerHandTotal === 21) {
				gameOver();
			} else if (playerHandTotal > 21)
				changeHand(playerStatus); //Not an immediate loss, need to play second hand

		} else if (currentTurn === "playerSplit") {

			if (playerSplitHandTotal === 21) {
				gameOver();

			} else if (playerSplitHandTotal > 21) {
				if (playerHandTotal < 21) { //Since there may be a chance of not losing just yet
					changeHand(playerSplitStatus);
				} else {
					gameOver();
				}
			}
		}
	}
}

// This is only used when we need to advance turns and there hasn't been
// a clear game over/game ending scenario just yet
function changeHand(currentDeckStatus) {

	currentDeckStatus = "stand";

	if (currentTurn === "player") {

		if (splitGame === true) {
			currentTurn = "playerSplit";

		} else if (splitGame === false) {
			currentTurn = "dealer";
			dealerStatus = "hit";
			evaluateGameStatus(); 
		}

	} else if (currentTurn === "playerSplit") {
		currentTurn = "dealer";
		dealerStatus = "hit";
		evaluateGameStatus();
	}
}

function reviewAcesValue() {

	if (playerHandTotal > 21 || playerSplitHandTotal > 21) {
		if (currentTurn === "playerSplit") {
			reduceAcesValue(playerSplitHand);
		} else if (currentTurn === "player") {
			reduceAcesValue(playerHand);
		}
	}
}

// The purpose of this function is to review the active deck being
// played (split or default player deck) and change aces value from 11 to 1.
// This is only called when the player has gone over 21 in their current deck.
function reduceAcesValue(deck) {

	for (var i = 0; i < deck.length; i++) {
	// Only focusing on aces that haven't been changed from 11 to 1 already
		if (deck[i].name === "ace" && deck[i].value === 11) {
			deck[i].value = 1;

			if (currentTurn === "player") {
				playerHandTotal -= 10;

			} else if (currentTurn === "playerSplit") {
				playerSplitHandTotal -= 10;
			}

			updateVisibleHandTotals();
			Materialize.toast("Your ace value changed from 11 to 1", 4000);
		}
	}
}

function dealerPlay() {

	// Flip hidden dealer card if applicable (function checks for this)
	flipHiddenCard();

	// Deactivate gameplay buttons as dealer plays their final move(s)
	disableButton(standButton);
	disableButton(hitButton);
	disableButton(splitButton);

	// Now, run through what the dealer should do next based on standard blackjack house rules
	if (dealerHandTotal < 17) {
		dealCard(dealerHand, dealerGameBoard);

	} else if (dealerHandTotal === 21) {
		gameOver();

	} else if (dealerHandTotal > 21) {
		gameOver();

	// If dealer's cards are 17 or above, dealer must stand and then we will check final scores
	} else if (dealerHandTotal >= 17) {
		dealerStatus = "stand";
		gameOver();
	}
} 
