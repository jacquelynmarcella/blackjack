// This file contains key interactions that will occur after the player has clicked a button

var startGame = function() {

	// Requires user to select a wager before proceeding
	if (currentWager === 0) {
		Materialize.toast("You must select a bet to play", 1000);

	} else {
		// Adjust wager based on what was clicked
		currentChipBalance -= currentWager;
		updateVisibleChipBalances();
	
		// Hide any pre/post game sections, then open up game board
		$("#welcome").hide();
		$("#game-over").hide();
		$(".brand-logo").text("blackjack"); //Adds title to nav once off welcome screen
		$("#game-board").show("fade", 1000);

		// Pull in cards, then shuffles the card deck array
		cardsInDeck = cards;
		cardsInDeck.sort(function() 
			{return 0.5 - Math.random()});

		// Deals two cards to start, so loops through this twice (should alternate who is 
		// being shuffled to (player, dealer, player, dealer)	
		for (let i = 0; i <= 1; i++) {

			setTimeout(function(){
				currentTurn = "player";
				dealCard(playerHand, playerGameBoard, playerHandTotal);
				currentTurn = "dealer";
				dealCard(dealerHand, dealerGameBoard, dealerHandTotal);
			}, i*1500);
		}

		// Player starts game, timeout to wait until initial card dealing is complete
		setTimeout(function(){
			currentTurn = "player";
			// In only certain circumstances (equal value pairs), enable split hand button
			if (playerHand.length === 2 && playerHand[0].name === playerHand[1].name) {
				enableButton(splitButton, split);
			}
		}, 2100);
	}
}

var hit = function() {

	if (currentTurn === "player") {
		playerStatus = "hit";
		dealCard(playerHand, playerGameBoard);

	} else if (currentTurn === "playerSplit") {
		playerSplitStatus = "hit";
		dealCard(playerSplitHand, playerSplitGameBoard);
	}

}

var stand = function() {

	if (currentTurn === "player") {
		changeHand(playerStatus);

	} else if (currentTurn === "playerSplit") {
		changeHand(playerSplitStatus);
	}

}

var split = function() {

	splitGame = true; 

	// Need to adjust scores and totals for each deck
	playerHandTotal = playerHandTotal - playerHand[1].value;
	playerSplitHandTotal = playerHand[1].value;
	updateVisibleHandTotals();

	// Need to show the split deck section and update the new totals
	$(".split-hand-total").removeClass("inactive").show(); 
	$(playerSplitGameBoard).removeClass("inactive").show();
	
	// Now, move the item out of the array and into the split array
	var splitCard = playerHand.pop();
	playerSplitHand.push(splitCard);

	// And move the image on the game board
	var cardImage = $("#player-card-1").attr("id", "player-split-card-0");
	cardImage.hide(); // Hide it at first to allow for the transition to occur
	// This is the first card in the deck, so want to cancel out the previous offset/stacking
	cardImage.appendTo($(playerSplitGameBoard)).offset({left: 60}).css("margin-right", "auto").show();

	// Double the original wager when they split
	currentChipBalance -= currentWager; 
	currentWager = currentWager * 2;
	updateVisibleChipBalances();

	// Then, deal 1 new card for each newly split deck
	currentTurn = "player";
	dealCard(playerHand, playerGameBoard);
	currentTurn = "playerSplit";
	dealCard(playerSplitHand, playerSplitGameBoard);
	currentTurn = "player"; 

	// Make split button no longer clickable as in this game you can only split once
	disableButton(splitButton);

	// Shrink the inactive deck to both signal what deck they are playing and to make room on the board
	setTimeout(function(){
		scaleDownDeck(playerSplitGameBoard, playerSplitHandTotalDisplay);
	}, 1000);

}

function doubleDown() {
	currentChipBalance -= currentWager; //subtracts the same value again from current balance
	currentWager = currentWager * 2;
	updateVisibleChipBalances();
	disableButton(doubleDownButton);
}

function newGame() {
	// when playAgainButton clicked, we need to clear out all the prior game data	
	gameWinner = "none";

	dealerHand = [];
	dealerHandTotal = 0;
	dealerStatus = "start";

	playerHand = [];
	playerHandTotal = 0;
	playerStatus = "start";  

	playerHasAce = false;  
	splitGame = false; 
	isGameOver = false;

	playerSplitHand = [];
	playerSplitHandTotal = 0;
	playerSplitStatus = "start";

	// Don't proceed unless the user has selected a new wager for this round
	if (currentWager === 0) { 
		Materialize.toast("You must select a bet to play", 1000);
	} else {
		updateVisibleHandTotals();

		// Hiding any prior split game sections
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