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
		console.log("Current total for player is " + playerHandTotal);
		$("#hand-total").text(playerHandTotal);

	} else if (currentTurn === "dealer") {
		dealerHandTotal += hand[index].value;
		console.log("Current total for dealer is " + dealerHandTotal);
	}

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
	currentTurn = "player";
	dealCard(playerHand, playerGameBoard);
});

$("#stand-button").click(function(){
	console.log("Stand button clicked");
});

// Navigation button on mobile
// TO DO: Break out page transitional elements into separate JS file
$(".button-collapse").sideNav();


startGame();
