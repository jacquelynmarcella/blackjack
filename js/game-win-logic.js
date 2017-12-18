// This file contains logic for what happens after the round is determined to be over

function gameOver() {

	isGameOver = true;

	// Flip hidden dealer card and update total if needed
	setTimeout(function(){
		flipHiddenCard();
	}, 750);

	// Make sure all key buttons disabled (may have already been depending on prior gameplay)
	disableButton(standButton);
	disableButton(hitButton);
	disableButton(splitButton);
	disableButton(doubleDownButton);

	// If dealer got 21 exactly
	if (dealerHandTotal === 21) {
		if (playerHandTotal === 21 || playerSplitHandTotal === 21) {
			gameWinner = "tie";
		} else {
			gameWinner = "dealer";
		}

	// If dealer got over 21
	} else if (dealerHandTotal > 21) {

		if (playerHandTotal <= 21 || playerSplitHandTotal <= 21) {
			gameWinner = "player";
		} else {
			gameWinner = "tie";
		}

	// If the dealer got less than 21
	} else if (dealerHandTotal < 21) {
	
		if (playerHandTotal === 21  || playerSplitHandTotal === 21) {
			gameWinner = "player";
		} else if (playerHandTotal < 21 && playerHandTotal > dealerHandTotal) {
			gameWinner = "player";
		} else if (playerSplitHandTotal < 21 && playerSplitHandTotal > dealerHandTotal) {
			gameWinner = "player";
		} else if (playerSplitHandTotal < 21 && playerSplitHandTotal === dealerHandTotal ||
			playerHandTotal < 21 && playerHandTotal === dealerHandTotal) {
			gameWinner = "tie";
		} else {
			gameWinner = "dealer";
		}
	}
	updateChipBalance();
	setTimeout(announceWinner, 2500); // Slight delay to give time to see the final cards play out
} 

function updateChipBalance() {

	if (gameWinner === "player") {

		// Blackjack is 3:2 payout (and cannot occur on a split deck):
		if (splitGame === false && playerHasAce === true && playerHandTotal === 21 && playerHand.length === 2) {
			currentChipBalance += currentWager*(3/2) + currentWager;
		// Otherwise it's a 1:1 payout:
		} else {
			currentChipBalance += currentWager*2;
		}

	// If you tie, get just original wager back (no win or loss)
	} else if (gameWinner === "tie") {
		currentChipBalance += currentWager;		
	}

	// Note: if dealer wins, nothing happens to player chip balance as their wager was already removed from it

	updateVisibleChipBalances();
}

function announceWinner() {

	updateVisibleHandTotals();

	currentWager = 0;
	updateVisibleChipBalances(); // Run this again since we want to show wager as back to 0 now for the next round

	$("#game-board").hide();

	// If game was split, will need to make sure everything is scaled back to normal size
	enlargeDeck(playerSplitGameBoard, playerSplitHandTotalDisplay);
	enlargeDeck(playerGameBoard, playerHandTotalDisplay);

	// Move betting options from welcome screen to game over screen to play again
	$("#wager-options").appendTo($("#game-over")); 
	$(playAgainButton).appendTo($("#wager-options")); // to move to bottom of container
	$(startButton).hide(); // This should only be visible at the very beginning of the game, as it wont clear the board
	$("#game-over").show("drop", 500);

	if (gameWinner === "player") {
		$("#game-outcome").text("You won");
	} else if (gameWinner === "dealer") {
		$("#game-outcome").text("Dealer won");
	} else if (gameWinner === "tie") {
		$("#game-outcome").text("You tied");
	}
}