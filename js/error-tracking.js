// Making note of errors I have gotten in win logic

// Dealer: 15 | Player : 21 | Split Player: 0
// Won on first round, did not immediately update this

// Dealer: 15 | Player : 24 | Split Player: 0
// button-actions.js:32 player is requesting another card
// player turn, no split, and they are letting them take another

// Dealer: 20 | Player : 30 | Split Player: 21
// On second deck and not detecting a win for the player?

// Ace changed value but still lost!
// Dealer: 20 | Player : 28 | Split Player: 0
// game-win-logic.js:6 Game over
// game-win-logic.js:62 Dealer wins
// Break out aces into further functionality vs next steps