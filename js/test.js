// Recyclable win condition

// Would call this: checkForWin(player, playerHandTotal);
// Put in the currentTurn as the call function

// Parameters


var checkForWin = function(currentDeck, currentDeckTotal) {

	if (currentDeckTotal === 21) {

	// Whoever gets this definitely has 21, but more than1 can get this?

		
	// Only if the current deck is less than 21
	} else if (currentDeckTotal < 21) {

		if (currentTurn === "player" || currentTurn === "playerSplit") {
			// Still able to play here, choice to hit or stand
		}

		else if (currentTurn === "dealer") {

			// Need to check if 17 or less then respond accordingly
			// Maybe a dealer logic function split out separately here?

			// The below should get run if the dealer is in STAND status as we need to check for a winner

			// First, logic a little simpler with only one deck
			if (splitGame === false) {

				if (playerHandTotal < 21) {

					if (dealerHandTotal > playerHandTotal) {
						console.log("Dealer wins");
						//Since it's dealers turn, it ends and they win

					} else if (dealerHandTotal < playerHandTotal) {
						console.log("Player's first deck wins");
						// Since it's the final turn (dealer, game over and player wins)

					} else if (dealerHandTotal === playerHandTotal) {
						console.log("There was a draw");
						// Since it's the final turn, a draw happens						
					}

				} else if (playerHandTotal > 21) {
					console.log("Dealer wins since they were under 21 and player went over");
					// Will this be needed? not sure
				}

			} else if (splitGame === true) {

				if (playerHandTotal < 21 || playerSplitHandTotal < 21) {
					if (dealerHandTotal >  playerHandTotal || dealerHandTotal > playerSplitHandTotal) {
						console.log("Dealer wins");

					} else if (playerHandTotal > dealerHandTotal) {
						console.log("Player's first deck wins");

					} else if (playerSplitHandTotal > dealerHandTotal) {
						console.log("Player's second split deck wins");		

					} else if (playerSplitHandTotal === dealerHandTotal || playerHandTotal === dealerHandTotal) {
						console.log("There was a draw");
					}

					// Need to figure this out?
				} else if (playerSplitHandTotal > 21) {
					console
				}
	

		}

	} else if (currentDeckTotal > 21) {

		if (currentTurn === "player") {

		}


	}




}