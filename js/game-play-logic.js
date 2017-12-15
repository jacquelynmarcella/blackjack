// This file contains the main logic utilized during active gameplay

// Can put player or dealer into function to make this action work for both
function dealCard(hand, location) {
	// Take the card out of the main array and add to the player or dealer's card deck array
	var cardDrawn = cardsInDeck.pop();
	hand.push(cardDrawn);

	// Sometimes it claims this is undefined, so needed to set more parameters
	// though they may seem redundant
	var index;
	if (hand.length === 1) {
		index = 0;
	} else if (hand.length > 1) {
		index = hand.length - 1;
	}

	console.log(hand);

	console.log("Card selected is " + hand[index].src + " " + hand[index].name + " " + hand[index].suit);

	// Create card image for card drawn and place in player/dealer's card section
	// Hide it initially so it doesn't show right away and we can control the transition
	var cardImage = $("<img>").attr("class", "card").attr("src", "img/" + hand[index].src).hide();

	// To create stacked card effect
	// May need to adjust sizing after new deck input
	if (index === 0) {
		cardImage.appendTo($(location));
	} else if (index > 0) {
		cardImage.appendTo($(location)).offset({left: -60}).css("margin-right", -60);	
	} 

	cardImage.show();
	
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
			if (splitGame === true) {
			}

		} else if (currentTurn === "playerSplit") {
			playerSplitHandTotal += hand[index].value;
			cardImage.attr("id", "player-split-card-" + index);
		}

	} else if (currentTurn === "dealer") {
		dealerHandTotal += hand[index].value;
		cardImage.attr("id", "dealer-card-" + index);
		
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
		disableButton(splitButton);
	}

	// First, if the player has gone over 21 check if they have aces and adjust to
	// from 11 to 1 if we need to
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

		} else if (hand.length > 2) {
			reduceAcesValue(hand);
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
