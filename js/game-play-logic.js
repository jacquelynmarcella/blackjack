// This file contains the main logic utilized during active gameplay, before the game is declared over

function dealCard(hand, location) {

	// Take the card out of the main array and add to the player or dealer's card deck array
	var cardDrawn = cardsInDeck.pop();
	hand.push(cardDrawn);
	var index = hand.length - 1;

	// Create card image for card, hide initially so it doesn't impact transition
	var cardImage = $("<img>").attr("class", "card").attr("src", "img/" + hand[index].src).hide();
	cardImage.attr("id", currentTurn + "-card-" + index);

	// To create stacked card effect
	if (index === 0) {
		cardImage.appendTo($(location)).show();
	} else if (index > 0) {
		cardImage.appendTo($(location)).offset({left: -60}).css("margin-right", -60).show();	
	} 

	// Make note of if there's aces or not in the active deck
	if (hand[index].name === "ace" && currentTurn != "dealer") {
		playerHasAce = true;
	}

	// Put into the correct player's hand deck dependent on if deck was split
	// Note: tried to dry this out by putting totals as a param but couldn't get it working yet
	if (currentTurn === "player") {
		playerHandTotal += hand[index].value;
	} else if (currentTurn === "playerSplit") {
		playerSplitHandTotal += hand[index].value;
	} else if (currentTurn === "dealer") {
		dealerHandTotal += hand[index].value;
	}
		
	// Second card only for dealer should show face down
	if (dealerHand.length === 2 && currentTurn === "dealer") {
		cardImage.attr("src", "img/card_back.png");
	}

	updateVisibleHandTotals();
	evaluateGameStatus();
}

function evaluateGameStatus() {

	// Player can only split or double down after first 2 cards drawn
	if (playerHand.length === 3 || dealerStatus === "hit") {
		disableButton(doubleDownButton);
		disableButton(splitButton);
	}

	
	if (currentTurn != "dealer") {
		if (playerHasAce === true) {
			if (currentTurn === "player") {  // Dry out by having params in here
				reviewAcesValue(playerHand, playerHandTotal);
			} else if (currentTurn === "playerSplit") {
				reviewAcesValue(playerSplitHand, playerSplitHandTotal);
			}	
		} else {
			isPlayerDone();
		}
	}	
	
	if (currentTurn === "dealer" && dealerStatus === "hit") {
		dealerPlay();
	}
}


// The purpose of this function is to detect when a turn should be shifted without the player
// needing to click "stand". This is also an important step for determining what the next move
// is if there is a split deck. 
function isPlayerDone() {

	// Dry this out???
	// if (playerHandTotal === 21 || playerSplitHandTotal === 21 || splitGame === false && playerHandTotal > 21)

	if (splitGame === false && playerHandTotal >= 21) {
		gameOver();

	} else if (splitGame === true) {

		if (currentTurn === "player") {
			if (playerHandTotal === 21) {
				gameOver();

			// If it's a split game, we can't just game over on the first hand if the player goes over
			} else if (playerHandTotal > 21)
				changeHand(playerStatus); 

		} else if (currentTurn === "playerSplit") {

			if (playerSplitHandTotal === 21) {
				gameOver();

			} else if (playerSplitHandTotal > 21) {
				// If the player was under 21 in their first game, the dealer should play before gameover
				if (playerHandTotal < 21) { 
					changeHand(playerSplitStatus);
				} else {
					gameOver();
				}
			}
		}
	}
}

// This function will change the active player when called
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
		}

	} else if (currentTurn === "playerSplit") {
		currentTurn = "dealer";
		dealerStatus = "hit";
	}
	evaluateGameStatus(); 
}

function reviewAcesValue(hand, total) {

	
	if (total > 21) {
		// If they have exactly 2 aces in the first draw, prompt them to choose to split or not
		if (hand.length === 2) {  
			enableButton(splitButton, split);
			$("#two-aces-prompt").modal("open");

		// Otherwise, just reduce the aces value so they are no longer over 21
		} else if (hand.length > 2) {
			reduceAcesValue(hand);
			isPlayerDone();
		}

	} else {
		isPlayerDone();
	}
}

// If the player has gone over 21, this will be called to reduce the value of their aces
function reduceAcesValue(deck) {

	for (var i = 0; i < deck.length; i++) {  
		if (deck[i].name === "ace" && deck[i].value === 11) { // Only focusing on aces that haven't been changed from 11 to 1 already
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

	// Flip hidden dealer card if applicable
	flipHiddenCard();

	// Deactivate gameplay buttons as dealer plays their final move(s)
	disableButton(standButton);
	disableButton(hitButton);
	disableButton(splitButton);

	// The below logic is based on standard blackjack rules
	// Dealer always keeps drawing if under 17
	if (dealerHandTotal < 17) {
		setTimeout(function(){
			dealCard(dealerHand, dealerGameBoard);
		}, 1000);

	} else if (dealerHandTotal >= 21) {
		setTimeout(function(){
			gameOver();
		}, 1100);

	// If dealer's cards are 17 or above, dealer must stand and then will check final scores
	} else if (dealerHandTotal >= 17) {
		setTimeout(function(){
			dealerStatus = "stand";
			gameOver();
		}, 1100);
	}
}