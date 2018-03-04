//Full array of possible cards
var cards;

function getCards(){
	cards = [
		{ 
			"suit": "clubs",
			"name": "2",
			"src": "Clubs-2.png",
			"value": 2
		},
		{ 
			"suit": "clubs",
			"name": "3",
			"src": "Clubs-3.png",
			"value": 3
		},
		{ 
			"suit": "clubs",
			"name": "4",
			"src": "Clubs-4.png",
			"value": 4
		},
		{ 
			"suit": "clubs",
			"name": "5",
			"src": "Clubs-5.png",
			"value": 5
		},
		{ 
			"suit": "clubs",
			"name": "6",
			"src": "Clubs-6.png",
			"value": 6
		},
		{ 
			"suit": "clubs",
			"name": "7",
			"src": "Clubs-7.png",
			"value": 7
		},
		{ 
			"suit": "clubs",
			"name": "8",
			"src": "Clubs-8.png",
			"value": 8
		},
		{ 
			"suit": "clubs",
			"name": "9",
			"src": "Clubs-9.png",
			"value": 9
		},
		{ 
			"suit": "clubs",
			"name": "10",
			"src": "Clubs-10.png",
			"value": 10
		},
		{ 
			"suit": "clubs",
			"name": "ace",
			"src": "Clubs-Ace.png",
			"value": 11
		},
		{ 
			"suit": "clubs",
			"name": "jack",
			"src": "Clubs-Jack.png",
			"value": 10
		},
		{ 
			"suit": "clubs",
			"name": "king",
			"src": "Clubs-King.png",
			"value": 10
		},
		{ 
			"suit": "clubs",
			"name": "queen",
			"src": "Clubs-Queen.png",
			"value": 10
		},
		{ 
			"suit": "diamonds",
			"name": "2",
			"src": "Diamond-2.png",
			"value": 2
		},
		{ 
			"suit": "diamonds",
			"name": "3",
			"src": "Diamond-3.png",
			"value": 3
		},
		{ 
			"suit": "diamonds",
			"name": "4",
			"src": "Diamond-4.png",
			"value": 4
		},
		{ 
			"suit": "diamonds",
			"name": "5",
			"src": "Diamond-5.png",
			"value": 5
		},
		{ 
			"suit": "diamonds",
			"name": "6",
			"src": "Diamond-6.png",
			"value": 6
		},
		{ 
			"suit": "diamonds",
			"name": "7",
			"src": "Diamond-7.png",
			"value": 7
		},
		{ 
			"suit": "diamonds",
			"name": "8",
			"src": "Diamond-8.png",
			"value": 8
		},
		{ 
			"suit": "diamonds",
			"name": "9",
			"src": "Diamond-9.png",
			"value": 9
		},
		{ 
			"suit": "diamonds",
			"name": "10",
			"src": "Diamond-10.png",
			"value": 10
		},
		{ 
			"suit": "diamonds",
			"name": "ace",
			"src": "Diamond-Ace.png",
			"value": 11
		},
		{ 
			"suit": "diamonds",
			"name": "jack",
			"src": "Diamond-Jack.png",
			"value": 10
		},
		{ 
			"suit": "diamonds",
			"name": "king",
			"src": "Diamond-King.png",
			"value": 10
		},
		{ 
			"suit": "diamonds",
			"name": "queen",
			"src": "Diamond-Queen.png",
			"value": 10
		},
		{ 
			"suit": "hearts",
			"name": "2",
			"src": "Hearts-2.png",
			"value": 2
		},
		{ 
			"suit": "hearts",
			"name": "3",
			"src": "Hearts-3.png",
			"value": 3
		},
		{ 
			"suit": "hearts",
			"name": "4",
			"src": "Hearts-4.png",
			"value": 4
		},
		{ 
			"suit": "hearts",
			"name": "5",
			"src": "Hearts-5.png",
			"value": 5
		},
		{ 
			"suit": "hearts",
			"name": "6",
			"src": "Hearts-6.png",
			"value": 6
		},
		{ 
			"suit": "hearts",
			"name": "7",
			"src": "Hearts-7.png",
			"value": 7
		},
		{ 
			"suit": "hearts",
			"name": "8",
			"src": "Hearts-8.png",
			"value": 8
		},
		{ 
			"suit": "hearts",
			"name": "9",
			"src": "Hearts-9.png",
			"value": 9
		},
		{ 
			"suit": "hearts",
			"name": "10",
			"src": "Hearts-10.png",
			"value": 10
		},
		{ 
			"suit": "hearts",
			"name": "ace",
			"src": "Hearts-Ace.png",
			"value": 11
		},
		{ 
			"suit": "hearts",
			"name": "jack",
			"src": "Hearts-Jack.png",
			"value": 10
		},
		{ 
			"suit": "hearts",
			"name": "king",
			"src": "Hearts-King.png",
			"value": 10
		},
		{ 
			"suit": "hearts",
			"name": "queen",
			"src": "Hearts-Queen.png",
			"value": 10
		},
		{ 
			"suit": "spades",
			"name": "2",
			"src": "Spades-2.png",
			"value": 2
		},
		{ 
			"suit": "spades",
			"name": "3",
			"src": "Spades-3.png",
			"value": 3
		},
		{ 
			"suit": "spades",
			"name": "4",
			"src": "Spades-4.png",
			"value": 4
		},
		{ 
			"suit": "spades",
			"name": "5",
			"src": "Spades-5.png",
			"value": 5
		},
		{ 
			"suit": "spades",
			"name": "6",
			"src": "Spades-6.png",
			"value": 6
		},
		{ 
			"suit": "spades",
			"name": "7",
			"src": "Spades-7.png",
			"value": 7
		},
		{ 
			"suit": "spades",
			"name": "8",
			"src": "Spades-8.png",
			"value": 8
		},
		{ 
			"suit": "spades",
			"name": "9",
			"src": "Spades-9.png",
			"value": 9
		},
		{ 
			"suit": "spades",
			"name": "10",
			"src": "Spades-10.png",
			"value": 10
		},
		{ 
			"suit": "spades",
			"name": "ace",
			"src": "Spades-Ace.png",
			"value": 11
		},
		{ 
			"suit": "spades",
			"name": "jack",
			"src": "Spades-Jack.png",
			"value": 10
		},
		{ 
			"suit": "spades",
			"name": "king",
			"src": "Spades-King.png",
			"value": 10
		},
		{ 
			"suit": "spades",
			"name": "queen",
			"src": "Spades-Queen.png",
			"value": 10
		}
	]
}
