// This file contains the main logic utilized during active gameplay, before the game is declared over
// Can put player or dealer into function to make this action work for both
function dealCard(hand, location, handTotal) {
	// Take the card out of the main array and add to the player or dealer's card deck array
	var cardDrawn = cardsInDeck.pop();
	hand.push(cardDrawn);
	var index = hand.length - 1;

	// Create card image for card drawn and place in player/dealer's card section
	// Hide it initially so it doesn't show right away and we can control the transition
	var cardImage = $("<img>").attr("class", "card").attr("src", "img/" + hand[index].src).hide();
	cardImage.attr("id", currentTurn + "-card-" + index);
	console.log(cardImage);

	// To create stacked card effect
	if (index === 0) {
		cardImage.appendTo($(location));
	} else if (index > 0) {
		cardImage.appendTo($(location)).offset({left: -60}).css("margin-right", -60);	
	} 
	cardImage.show();

	// For only the dealer's second card, we want it to show as the card back until it's flipped
	if (currentTurn === "dealer" && hand.length === 2) {
		cardImage.attr("src", "img/card_back.png");
	}

	// Make note of if there's aces or not in the active deck
	if (hand[index].name === "ace" && currentTurn != "dealer") {
		playerHasAce = true;
	}
	

	// Put into the correct player's hand deck dependent on if deck was split
	if (currentTurn === "player") {
		playerHandTotal += hand[index].value;

	} else if (currentTurn === "playerSplit") {
		playerSplitHandTotal += hand[index].value;

	} else if (currentTurn === "dealer") {
		dealerHandTotal += hand[index].value;
	}

	// Update the totals 
	var cardValue = hand[index].value; // (we need to be able to return this, so it's a separate function)
	updateTotal(handTotal, cardValue);
	updateVisibleHandTotals();
	evaluateGameStatus();
}

function updateTotal(handTotal, cardValue) {
	handTotal += cardValue;
	return handTotal;
}

//POSSIBLE LAYOUT FOR FUNCTION

function evaluateGameStatus() {

	// Player can only do double down after first 2 cards drawn
	// But in a split game, want to give them a chance after the deck is split right?
	// Can this move up to deal card??
	if (playerHand.length === 3 || dealerStatus === "hit") {
		disableButton(doubleDownButton);
		disableButton(splitButton);
	}

	// First, if the player has gone over 21 check if they have aces and adjust to
	// from 11 to 1 if we need to

	// NEW CODE IDEA:
	// // pass in playerhand, playerhandtotal values, playerstatus?
	// if (currentTurn != "dealer" && playerHasAce === true && hand.total > 21) {

		// if (hand.length === 2) {

		// 	enableButton(splitButton, split);
		// 	$("#two-aces-prompt").modal("open");

		// } else if (hand.length > 2) {
		// 	reduceAcesValue(playerhand, playerhandtotal);
		// }

	// 	return;
	// } else if (currentTurn != "dealer" && playerhasAce === false) {
	// 	isPlayerDone();
	// } else if (currentTurn === "dealer" && dealerStatus === "hit") {
	// 	dealerPlay();
	// }



	if (playerHasAce === true && currentTurn === "player" || currentTurn === "playerSplit") {
		if (currentTurn === "player") {
			reviewAcesValue(playerHand, playerHandTotal);
		} else if (currentTurn === "playerSplit") {
			reviewAcesValue(playerSplitHand, playerSplitHandTotal);
		}	
	}

	if (currentTurn === "player" || "playerSplit") {
		isPlayerDone();
	}

	if (currentTurn === "dealer" && dealerStatus === "hit") {
		dealerPlay();
	}
}

function isPlayerDone() {


	// NEW CODE:
	// pass in playerhand, playerhandtotal values, playerstatus...
	// if (hand.total >= 21) {
	// 	if (splitGame === false) {
	// 		gameOver();
	// 	} else if (splitgame === true) {

	// 	}
	// }


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

			// Scale down the player deck as we change turns, but only on split hand
			scaleDownDeck(playerGameBoard, playerHandTotalDisplay);
			enlargeDeck(playerSplitGameBoard, playerSplitHandTotalDisplay);

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

function reviewAcesValue(hand, total) {
// Hand should be playerHand or playerSplitHand

	// If they have exactly 2 aces in the first draw, prompt them to choose
	// Otherwise, default action is to reset value to 1
	if (total > 21) {
		if (hand.length === 2) {
			// If the hand length is exactly 2, then they have 2 aces
			// Prompt them if they want to split or not before automatically reducing value
			enableButton(splitButton, split);
			$("#two-aces-prompt").modal("open");

			// Can I pass total through here to simplify reduce aces further??
		} else if (hand.length > 2) {
			reduceAcesValue(hand);
			//evaluateGameStatus(pluginvalues);
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
			//evaluategameStatus again
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
		setTimeout(function(){
			dealCard(dealerHand, dealerGameBoard);
		}, 1000);

	} else if (dealerHandTotal === 21) {
		setTimeout(function(){
			gameOver();
		}, 1100);

	} else if (dealerHandTotal > 21) {
		setTimeout(function(){
			gameOver();
		}, 1100);	

	// If dealer's cards are 17 or above, dealer must stand and then we will check final scores
	} else if (dealerHandTotal >= 17) {
		setTimeout(function(){
			dealerStatus = "stand";
			gameOver();
		}, 1100);
	}
} 
