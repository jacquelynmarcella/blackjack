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
1. Stubbed out overall game board structure and integrated initial card data.
    * Plotted out rules, dealer/player decks, hand totals, and key action buttons.
    * Installed Materialize framework and created grid system, which I utilized throughout the whole project to routinely check for how the integrated content was scaling smaller screen sizes.
    * Created cards.js file to store full deck of cards including images, value, and name.
1. Generated start game functionality to get the cards on the board.
    * Randomly sort the array to "shuffle" the deck.
    * Loop through the original deck and push/pop cards into both the dealer and player hands.
    * Display these card images on the appropriate sections of the screen.
1. Developed initial player interaction fuctionality ("hit" and "stand").
1. Built out dealer logic.
    * Dealer's actions are based on standard blackjack rules (hit if under 17, stand if 17 or above).
1. Created win logic and detection for aces.
    * Aces can hold values of either 11 or 1.
    * Default value for aces is 11, however, if the user goes over 21 the aces will reduce to 1.
    * Got initial working win logic up, which was adjusted several times.
1. Added in chip betting functionality and ongoing chip balance total tracking.
   * Added in double down functionality once the betting process was up and running.
1. Added split card functionality (required a lot of reworking of win logic and player interactions since there are now 2 decks).
1. Worked through automated turn switching functionality to keeps the game moving if the player goes over 21 on their current deck (without them needing to press "stand").
1. Added toggling in/out of rules functionality using jQuery UI plugin.
1. Worked on an announce winner screen that shows who won, current chip balance, and final hand totals.
   * Implemented play again button to reset card deck values and start a new game.
1. Implemented CSS animations and transitions using keyframes to add more engaging animations to the game.
   * Dealer's second card appears to flip over when it is eventually displayed.
   * Cards move in on the screen and appear to be coming out of the deck.
   * Got cards to dynamically stack using offset properties as they are added in the JavaScript.
   * If the deck is split, the inactive deck scales down to both signify to the user what deck they are currently on, as well as make room on the page to fit both decks. When the user moves onto the second deck, the prior deck scales down and the new deck scales up.
   * Set timeouts regularly to give a chance for these animations to complete before moving on to the next move.
1. Added modal for the rare chance that a player draws 2 aces - they need to be able to choose to split or not before the game automatically reduces their aces to value 1.
1. Further adjusted and tested layout for responsiveness using the Materialize framework. Currently working decently on mobile, but tablet may be iffy.

## Next Steps
* Several areas where I would like code to be more dry.
* Further test the double ace drawing scenario to ensure it is working consistently.
* Occasional bug occurs where the cards.js deck doesn't load in, if this continues to happen at random intervals would like to get this fixed.
* Finish responsive scaling for tablet size devices, as the mobile preview works but tablet could use some work.

## Resources Used
* Card Deck Graphics: https://opengameart.org/content/cards-set
* Chip Icons: 
   * https://thenounproject.com/dorxela/
   * https://thenounproject.com/meisandra0583/
