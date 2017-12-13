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

		} else if (playerHandTotal > 21) {
			if (splitGame === true && playerSplitHandTotal > 21) {
				console.log("There was a draw");
				gameWinner = "bust";
			} else if (splitGame === false) {
				console.log("There was a draw");
				gameWinner = "bust";
			}	
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
	adjustChipBalance();
} 

//New section to do chips etc
function adjustChipBalance() {

	if (gameWinner === "player") {

		// Check for blackjack scenario for 3:2 payout (1 ace, 1 10pt card)
		if (playerHasAce === true && playerHandTotal === 21 && playerHand.length === 2) {
			currentChipBalance = currentWager * (3/2);
		} else if (playerHasAce === true && playerSplitHandTotal === 21 && playerSplitHand.length === 2) {
			currentChipBalance = currentWager * (3/2);
		// Otherwise it's a 1:1 payout
		} else {
			currentChipBalance += currentWager;
		}

	} else if (gameWinner === "dealer") {
		console.log("No action needed here, dealer gets yo money");

	// Net neutral, you get your money back (I think?)
	} else if (gameWinner === "tie") {
		currentChipBalance += currentWager;		

	} else if (gameWinner === "bust") {  //if both dealer and player go over 21
		console.log("No action needed here, dealer gets yo money");	
	}
	console.log("New chip balance is " + currentChipBalance);
	$("#current-chip-balance").text(currentChipBalance);
}

function announceWinner() {
	console.log("Modal to popup with relevant info");
}