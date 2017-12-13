// This file contains the key actions that happen once it has been determined
// that the game has ended

function gameOver() {

	console.log("Game over");

	// Flip hidden dealer card if applicable (function checks for this)
	flipHiddenCard();

	// Make sure all key buttons disabled (may have already been depending on prior gameplay)
	disableButton(standButton);
	disableButton(hitButton);
	disableButton(splitButton);
	disableButton(doubleDownButton);

	// If dealer got 21 exactly
	if (dealerHandTotal === 21) {
		if (playerHandTotal === 21 || playerSplitHandTotal === 21) {
			console.log("There was a draw");
			gameWinner = "tie";
		} else {
			console.log("Dealer wins");
			gameWinner = "dealer";
		}

	// If dealer got over 21
	} else if (dealerHandTotal > 21) {

		if (playerHandTotal <= 21 || playerSplitHandTotal <= 21) {
			console.log("Player wins");
			gameWinner = "player";
		}

	// If the dealer got less than 21
	} else if (dealerHandTotal < 21) {
	
		if (playerHandTotal === 21  || playerSplitHandTotal === 21) {
			console.log("Player wins");
			gameWinner = "player";
		} else if (playerHandTotal < 21 && playerHandTotal > dealerHandTotal) {
			console.log("Player wins with hand 1");
			gameWinner = "player";
		} else if (playerSplitHandTotal < 21 && playerSplitHandTotal > dealerHandTotal) {
			console.log("Player wins with hand 2");
			gameWinner = "player";
		} else if (playerSplitHandTotal < 21 && playerSplitHandTotal === dealerHandTotal ||
			playerHandTotal < 21 && playerHandTotal === dealerHandTotal) {
			gameWinner = "tie";
			console.log("There was a draw");
		} else {
			gameWinner = "dealer";
			console.log("Dealer wins");
		}
	}
	updateChipBalance();
	announceWinner();
} 

function updateChipBalance() {

	if (gameWinner === "player") {

		// Check for blackjack scenario for 3:2 payout (requires 1 ace, 1 10pt card)
		// Noting that typical rules do not give bonuses if the hand has been split,
		// it would be normal payout
		if (splitGame === false && playerHasAce === true && playerHandTotal === 21 && playerHand.length === 2) {
			currentChipBalance += currentWager * (3/2);
		// Otherwise it's a 1:1 payout
		} else {
			currentChipBalance += currentWager;
		}

	} else if (gameWinner === "dealer") {
		console.log("No action needed here, dealer gets yo money");

	// Net neutral, you get your money back (I think?)
	} else if (gameWinner === "tie") {
		currentChipBalance += currentWager;		
	}
	console.log("New chip balance is " + currentChipBalance);

	// To update on the screen
	updateVisibleChipBalances();
}

function announceWinner() {

	updateVisibleHandTotals();
	$("#game-board").addClass("inactive"); //May want to delay this so they can see gameplay a bit more
	$("#game-over").removeClass("inactive");

	if (gameWinner === "player") {
		$("#game-outcome").text("You won");
	} else if (gameWinner === "dealer") {
		$("#game-outcome").text("Dealer won");
	} else if (gameWinner === "tie") {
		$("#game-outcome").text("There was a tie");
	}

}