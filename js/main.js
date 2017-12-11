// Setting up an array of cards in the current deck so that way we can pop
// cards out of it as the came progresses without impacting the original array
// that holds all possible card values
var cardsInDeck = cards;
var dealerHand = [];
var playerHand = [];


var dealerGameBoard = $("#dealer");
var playerGameBoard = $("#user-hand");


// Can put player or dealer into function to make this action work for both

var dealCard = function(hand, location) {

	var cardDrawn = cardsInDeck.pop();
	hand.push(cardDrawn);
	var index = hand.length - 1;
	var cardImage = $("<img/>");

	cardImage.attr("class", "card");
	cardImage.attr("src", "img/" + hand[index].src);
	cardImage.appendTo($(location));

	//TO DO: Second card should be face down for dealer only
}

var startGame = function() {

	console.log("New game!");
	console.log(cardsInDeck);

	// Shuffles the card deck array
	cardsInDeck.sort(function() 
		{return 0.5 - Math.random()});

	dealCard(playerHand, playerGameBoard);
	dealCard(dealerHand, dealerGameBoard);
	dealCard(playerHand, playerGameBoard);
	dealCard(dealerHand, dealerGameBoard);
}

startGame();

// Navigation button on mobile
$(".button-collapse").sideNav();

// Event listeners
$("#hit-button").click(dealCard(playerHand,playerGameBoard));
