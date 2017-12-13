// This file contains the main logic utilized during active gameplay

// Can put player or dealer into function to make this action work for both
function dealCard(hand, location) {

	// Take the card out of the main array and add to the player or dealer's card deck array
	var cardDrawn = cardsInDeck.pop();
	hand.push(cardDrawn);
	var index = hand.length - 1;

	// Create card image for card drawn and place in player/dealer's card section
	var cardImage = $("<img/>");
	cardImage.attr("class", "card");
	cardImage.attr("src", "img/" + hand[index].src);
	cardImage.appendTo($(location));

	// Update total count of cards in hand based on who is playing
	if (currentTurn === "player" || currentTurn === "playerSplit") {

		// Make note of if there's aces or not in the active deck
		if (hand[index].name === "ace") {
			playerHasAce = true;
		}

		// TO DO: Can this be more dry?
		if (currentTurn === "player") {
			playerHandTotal += hand[index].value;
			cardImage.attr("id", "player-card-" + index);
			$("#hand-total").text(playerHandTotal);

		} else if (currentTurn === "playerSplit") {
			playerSplitHandTotal += hand[index].value;
			cardImage.attr("id", "player-split-card-" + index);
			$("#split-hand-total").text(playerSplitHandTotal);
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
	checkForWin();
}


//POSSIBLE LAYOUT FOR FUNCTION

// function evaluateGameStatus() {

// 	// Player can only do double down after first 2 cards drawn
// 	if (playerHand.length === 3 || dealerStatus === "hit" || currentTurn === "playerSplit") {
// 		disableButton(doubleDownButton);
// 	}

// 	checkAcesValue();  // update any aces that need updating, checks if over 21 then adjusts score

// If current turn is player or playerSplit:
// 	isPlayerDone();
	// These might change hand or go to game over, or do nothing..
// 		isPlayerDone(currentTurn, playerHandTotal, playerStatus);  --status may not work..
// 		isPlayerDone(currentTurn, playerSplitHandTotal, playerSplitStatus);

// 	Or might need to:
// 	isPlayerSplitDone();

// If current turn is dealer:
// 	beginDealerTurn(); // wont start if player current turn based on criteria

// }


// The purpose of this function is not to declare a winner right away, but to determine
// When a player has hit or gone over 21 so that the game knows to move
// on to the appropriate next step (dealer playing, second deck, etc)
function checkForWin() {

	// Four possible functions here, maybe order the logic then call the functions to clean this up?
	// 1. Check for aces and adjust
	// 2. Determine if player moves onto next hand (split)
	// 3. Determine if player moves onto dealer
	// 4. Or, if player moves onto gameover

	console.log("Dealer: " + dealerHandTotal + " | Player : " + playerHandTotal + " | Split Player: " + playerSplitHandTotal);

	// Player can only do double down after first 2 cards drawn
	if (playerHand.length === 3 || dealerStatus === "hit" || currentTurn === "playerSplit") {
		disableButton(doubleDownButton);
	}

	if (currentTurn === "player" || currentTurn === "playerSplit") {

		// When the player goes over 21, a few different scenarios could occur:
		if (playerHandTotal > 21 || playerSplitHandTotal > 21) {

			// First, check if they have an ace and if they do, change it to value 1
			if (playerHasAce === true) {
				if (currentTurn === "playerSplit") {
					reduceAcesValue(playerSplitHand);
				} else if (currentTurn ==="player") {
					reduceAcesValue(playerHand);
				}
			}

			// If they have a split deck and were on the first deck, go to the second deck
			if (currentTurn === "player" && splitGame === true) {
				console.log("Player 2 should now be playing...");
				changeHand(playerStatus);

			// If they have a split deck and were on the second deck, and if the first deck was
			// under or at 21, then the dealer should go since this round isn't an immediate loss
			// and there is still a chance for the player to win/draw
			} else if (currentTurn === "playerSplit" && playerSplitHandTotal > 21) {
				if (playerHandTotal <= 21) {
					changeHand(playerSplitStatus); 
				} else {
					gameOver();
				}
					
			// If there is no split deck and player is over 21, game is over
			} else if (currentTurn === "player" && splitGame === false) {
				gameOver();
			}

		// When player gets exactly 21 on one of their hands, a few scenarios could occur:
		} else if (playerHandTotal === 21 || playerSplitHandTotal === 21) {

			//DOES IT REALLY NEED TO GO TO 2ND DECK IF FIRST IS 21? Maybe can consoliate..
			
			// If it's a split game, we need to move onto the next player deck before fully game over
			if (currentTurn === "player" && splitGame === true) {
				changeHand(playerStatus);

			// If it's a split game and player was on second hand, game should end
			} else if (currentTurn === "playerSplit") {
				if (playerSplitHandTotal === 21) {
					gameOver();
				}

			// If it was not a split game, game should end
			} else if (currentTurn === "player" && splitGame === false) {
				gameOver();
			}
		}
	// What about if player is under 21?
	// The above steps are designed to move game play along if the player gets 21 or above so that
	// they can't just keep playing the same hand when that happens. The player must choose to stand in order 
	// to progress turns if they haven't gotten at or above 21.

	// We don't want to start checking if the dealer has won if the player is still playing,
	// so the dealer status needs to be at "hit" in order to run the below checks
	} else if (currentTurn === "dealer" && dealerStatus === "hit") {

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
}

function changeHand(currentDeckStatus) {

	// Changes whatever deck was at play to now being in "stand" status
	currentDeckStatus = "stand";

	// Then, changes current turn based on gameplay status
	if (currentTurn === "player") {

		if (splitGame === true) {
			currentTurn = "playerSplit";

		} else if (splitGame === false) {
			currentTurn = "dealer";
			dealerStatus = "hit";
			checkForWin(); 
		}

	} else if (currentTurn === "playerSplit") {
		currentTurn = "dealer";
		dealerStatus = "hit";
		checkForWin();
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
				$("#hand-total").text(playerHandTotal);

			} else if (currentTurn === "playerSplit") {
				playerSplitHandTotal -= 10;
				$("#split-hand-total").text(playerSplitHandTotal);
			}

			Materialize.toast("Your ace value changed from 11 to 1", 4000);
		}
	}
}
