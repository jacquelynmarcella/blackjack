var startGame = function() {

	// Captures current wager
	if (currentWager === 0) {
		console.log("User must select a wager before beginning");

	} else {
		$("#current-wager").text(currentWager);
		currentChipBalance -= currentWager;
		$("#current-chip-balance").text(currentChipBalance);
	
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
	}
	// TO DO: Activate functionality to split game based on matching criteria of card
}

var hit = function() {

	console.log(currentTurn + " is requesting another card");

	if (currentTurn === "player") {
		dealCard(playerHand, playerGameBoard);

	} else if (currentTurn === "playerSplit") {
		playerSplitStatus = "hit";
		dealCard(playerSplitHand, playerSplitGameBoard);
	}

}

var stand = function() {
	console.log("Player is standing");

	if (currentTurn === "player") {
		changeHand(playerStatus);

	} else if (currentTurn === "playerSplit") {
		changeHand(playerSplitStatus);
	}

}

// If a certain criteria is reached, then we need to activate this button (it should not be
// active at the start); only activates after initial dealing if applicable
var split = function() {

	splitGame = true; 

	// Need to adjust scores and totals for each deck
	playerHandTotal = playerHandTotal - playerHand[1].value;
	$("#hand-total").text(playerHandTotal);

	playerSplitHandTotal = playerHand[1].value;
	$("#split-hand-total").text(playerSplitHandTotal);

	// Now, move the item out of the array and into the split array
	var splitCard = playerHand.pop();
	playerSplitHand.push(splitCard);

	// And move the image on the game board
	var cardImage = $("#player-card-1").attr("id", "player-split-card-0");
	cardImage.appendTo($(playerSplitGameBoard));

	console.log("Split game. Dealer: " + dealerHandTotal + " | Player : " + playerHandTotal + " | Split Player: " + playerSplitHandTotal);

	disableButton(splitButton);

	// TO DO: This button should de-activate after being clicked
	// TO DO: Double down the bets/adjust bets accordingly when this is selected
}

var doubleDown = function() {
	console.log("Player has doubled their bet");
	currentChipBalance -= currentWager; //subtracts the same value again from current balance
	currentWager = currentWager * 2;
	$("#current-wager").text(currentWager);
	$("#current-chip-balance").text(currentChipBalance);
	disableButton(doubleDownButton);
}
