var startGame = function() {

	// Captures current wager
	if (currentWager === 0) {
		Materialize.toast("You must select a bet to play", 1000);
	} else {
		currentChipBalance -= currentWager;
		updateVisibleChipBalances();
	
		// Hide wager section
		$("#welcome").hide();
		$("#game-over").hide("drop", 500);
		$("#game-board").show("fade", 1000);

		// Then shuffles the card deck array
		cardsInDeck.sort(function() 
			{return 0.5 - Math.random()});

		// Deals two cards to start, so loops through this twice (should alternate who is 
		// being shuffled to (player, dealer, player, dealer)
		for (var i=0; i < 2; i++) {
			currentTurn = "player";
			dealCard(playerHand, playerGameBoard);
			currentTurn = "dealer";
			dealCard(dealerHand, dealerGameBoard);
		}

		// Player starts game
		currentTurn = "player";
	}

	// In only certain circumstances (equal value pairs), enable split hand button
	if (playerHand.length === 2 && playerHand[0].name === playerHand[1].name) {
		enableButton(splitButton, split);
	}
}

var hit = function() {
	console.log(currentTurn + " is requesting another card");

	if (currentTurn === "player") {
		playerStatus = "hit";
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
	// As well as activate the viewing for the split deck
	playerHandTotal = playerHandTotal - playerHand[1].value;
	playerSplitHandTotal = playerHand[1].value;
	$(playerSplitGameBoard).show();
	$(".split-hand-total").show();
	updateVisibleHandTotals();

	// Now, move the item out of the array and into the split array
	var splitCard = playerHand.pop();
	playerSplitHand.push(splitCard);

	// And move the image on the game board
	// Reset original offset for positoning
	// Showing then hiding prevents some weird animations from happening during this
	var cardImage = $("#player-card-1").attr("id", "player-split-card-0");
	cardImage.hide();
	cardImage.appendTo($(playerSplitGameBoard)).offset({left: 50}).css("margin-right", "auto");
	cardImage.show();

	// Double original wager when they split
	// How to address double down here?
	currentChipBalance -= currentWager;
	currentWager = currentWager * 2;
	updateVisibleChipBalances();

	// Then, deal 1 new card for each split deck
	currentTurn = "player";
	dealCard(playerHand, playerGameBoard);
	currentTurn = "playerSplit";
	dealCard(playerSplitHand, playerSplitGameBoard);

	console.log("Split game. Dealer: " + dealerHandTotal + " | Player : " + playerHandTotal + " | Split Player: " + playerSplitHandTotal);

	// Make split button no longer clickable as in this game you can only split once
	disableButton(splitButton);

	//May need to reconfigure this depending on how second drawn hands go?
	currentTurn = "player"; 

	// TO DO: Double down the bets/adjust bets accordingly when this is selected
}

function doubleDown() {
	console.log("Player has doubled their bet");
	currentChipBalance -= currentWager; //subtracts the same value again from current balance
	currentWager = currentWager * 2;
	updateVisibleChipBalances();
	disableButton(doubleDownButton);
}

function newGame() {
	// when playAgainButton clicked
	// Clears the board, but doesn't reset chip "bank" balance

	cardsInDeck = cards;	
	currentTurn = "player";
	gameWinner; 

	dealerHand = [];
	dealerHandTotal = 0;
	dealerStatus = "start";

	playerHand = [];
	playerHandTotal = 0;
	playerStatus = "start";  

	playerHasAce = false;  
	splitGame = false; 

	playerSplitHand = [];
	playerSplitHandTotal = 0;
	playerSplitStatus;

	// Cleared initial data, but need to make sure a wager is selected before
	// we leave this screen and update any further values
	if (currentWager === 0) { 
		Materialize.toast("You must select a bet to play", 1000);
	} else {
		updateVisibleHandTotals();

		// Hiding any prior split game data 
		$(playerSplitGameBoard).hide();
		$(".split-hand-total").hide();
			
		// Return buttons to active
		enableButton(standButton, stand);
		enableButton(hitButton, hit);
		enableButton(doubleDownButton, doubleDown);

		// Clear out game board images
		dealerGameBoard.empty();
		playerGameBoard.empty();
		playerSplitGameBoard.empty();

		startGame(); 
	}
}


