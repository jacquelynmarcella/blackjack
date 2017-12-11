// Setting up an array of cards in the current deck so that way we can pop
// cards out of it as the came progresses without impacting the original array
// that holds all possible card values
var cardsInDeck = cards;
var dealerHand = [];
var playerHand = [];

var playerHandTotal = 0;
var dealerHandTotal = 0;

var currentTurn = "player";

var dealerGameBoard = $("#dealer");
var playerGameBoard = $("#user-hand");

// Pobbile statuses are start (initial gameplay), stand, hit
var dealerStatus = "start";
var playerStatus = "start";


var checkForWin = function() {

	if (currentTurn === "player") {
		if (playerHandTotal > 21) {
		console.log("You lose, Dealer wins");
		}

	// If the dealer is standing, or if it's before we have seen the hidden dealer card, we don't want the below to run
	} else if (currentTurn === "dealer" && dealerStatus === "hit") {

		if (dealerHand.length === 2) {
			$("#dealer-card-1").attr("src", "img/" + dealerHand[1].src);
			console.log("Changing second dealer card to " + dealerHand[1].src);
		} 

		if (dealerHandTotal < 17) {
			dealCard(dealerHand, dealerGameBoard);

		} else if (dealerHandTotal === 21) {
			console.log("Dealer wins");

		} else if (dealerHandTotal > 21) {
			console.log("You win");

		// If dealer's cards are 17 or above, must stand
		} else if (dealerHandTotal >= 17) {
			dealerStatus = "stand";
			currentTurn = "player";
			console.log("Dealer is now standing");
		} 
	}
	//TO DO: If there's a win remove event listeners and show some kind of game over screen
}


// Can put player or dealer into function to make this action work for both
var dealCard = function(hand, location) {
	var cardDrawn = cardsInDeck.pop();
	hand.push(cardDrawn);
	var index = hand.length - 1;

	// Change images
	var cardImage = $("<img/>");
	cardImage.attr("class", "card");
	cardImage.attr("src", "img/" + hand[index].src);
	cardImage.appendTo($(location));

	// Update total count of cards in hand based on who is playing
	if (currentTurn === "player") {
		playerHandTotal += hand[index].value;
		cardImage.attr("id", "player-card-" + index);
		console.log("Current total for player is " + playerHandTotal);
		// Update score and total area
		$("#hand-total").text(playerHandTotal);

	} else if (currentTurn === "dealer") {
		dealerHandTotal += hand[index].value;
		cardImage.attr("id", "dealer-card-" + index);
		console.log("Current total for dealer is " + dealerHandTotal);
	}

	checkForWin();

	//TO DO: Second card should be face down for dealer only
}

var startGame = function() {
	// Shuffles the card deck array
	cardsInDeck.sort(function() 
		{return 0.5 - Math.random()});

	// Deals two cards to start
	for (var i=0; i < 2; i++) {

		currentTurn = "player";
		dealCard(playerHand, playerGameBoard);

		currentTurn = "dealer";
		dealCard(dealerHand, dealerGameBoard);
	}
}

// Event listeners
$("#hit-button").click(function(){
	currentTurn = "player"; //Just to make sure this is the case, for now..
	playerStatus = "hit";
	dealCard(playerHand, playerGameBoard);
});

$("#stand-button").click(function(){
	console.log("Stand button clicked");
	currentTurn = "dealer";
	playerStatus = "stand";
	dealerStatus = "hit";
	checkForWin(); //We need to see the dealer's card before they just draw again
});

// Navigation button on mobile
// TO DO: Break out page transitional elements into separate JS file
$(".button-collapse").sideNav();


startGame();
