# :spades:  blackjack
A JavaScript based Blackjack game. Beat the dealer by getting as close to 21 without going over.

## :diamonds: Requirements
* Game is playable    
* Game is two-player (or AI)
* Game is winnable    
* Winner is displayed 
* Has directions on how to play    
* Appropriate Use of GitHub   
* Deployed on Github Pages    
* Long files appropriately split up   
* Appropriate use of functions
* DRY Code    
* Draw detected (if applicable)
* Good ease of triggering events

## :diamonds: Technologies Used
* jQuery + jQuery UI
* Materialize CSS Framework

## :diamonds: Process
1. Stub out overall game board structure and integrated initial card data.
    * Plotted out rules, dealer/player decks, hand totals, and key action buttons.
    * Install Materialize framework and created grid system to scale for smaller screen sizes as I went.
    * Created cards.js file to store full deck of cards including images, value, and name.
1. Generated start game functionality to get the cards on the board.
    * Randomly sort the array to "shuffle" the deck.
    * Loop through the original deck and push/pop cards into both the dealer and player hands.
    * Display these card images on the appropriate sections of the screen.
1. Developed initial player interaction fuctionality ("hit" and "stand").
    * Hitting will draw another card for the player, standing will move on to dealer's turn.
1. Built out dealer logic.
    * Dealer's actions are based on standard blackjack rules (hit if under 17, stand if 17 or above).
1. Created win logic and detection for aces.
    * Aces can hold values of either 11 or 1.
    * Default value for aces is 11, however, if the user goes over 21 the aces will reduce to 1.
    * Went through several rounds over the course of the game on tweaking the player win logic.
1. Added in chip betting functionality and ongoing chip balance total tracking.
1. Added split card functionality (required a lot of reworking of win logic and player interactions since there are now 2 decks).
1. Worked through automated turn switching functionality to keeps the game moving if the player goes over 21 on their current deck (without them needing to press "stand").
1. Added toggling in/out of rules functionality.
1. Worked on an announce winner screen that shows who won, current chip balance, and final hand totals.
1. Implemented CSS animations and transitions using keyframes to make the cards appear to move in and stack ontop of one another.
1. Added modal for the rare chance that a player draws 2 aces - they need to be able to choose to split or not before the game automatically reduces their aces to value 1.
1. Further adjusted and tested layout for responsiveness using the Materialize framework. Currently working decently on mobile, but tablet may be iffy.
