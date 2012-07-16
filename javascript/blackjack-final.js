// Global var for deck of cards.
var deck = new Deck();

// Helper functions.
var playAsDealer = function() {
    var hand = new Hand(deck.deal(), deck.deal());
    var newCard;
    while (hand.score() < 17) {            
        // Deal card from deck.
        newCard = deck.deal();
        // Add card to player's hand.
        hand.hitMe(newCard);
    }
    return hand;
};

var playAsUser = function() {
    var hand = new Hand(deck.deal(), deck.deal());
    var isHit = true;
    
    while (isHit) {
        isHit = confirm("Your current hand:\n\n" + hand.printHand() + "\n\nHit?");
        var newCard;
        if (isHit) {
            // Deal card from deck.
            newCard = deck.deal();
            // Add card to player's hand.
            hand.hitMe(newCard);
        }
    }
    return hand;
};

var declareWinner = function(userHand, dealerHand) {
    var userScore = userHand.score();
    var dealerScore = dealerHand.score();
    
    if (userScore == 21) {
        if (dealerScore == 21) {
            return "It's a tie!";
        }
        return "You win!";
    }
    if (dealerScore == 21) {
        return "You lose!";
    } // Neither person has achieved Blackjack at this point.    
    else if ((userScore < 21 && dealerScore < 21) || (userScore > 21 && dealerScore > 21)) {
        // If both scores are either below or above 21, 
        // the player who is closest to 21 wins.
        if ( Math.abs(21 - userScore) < Math.abs(21 - dealerScore)) {
            return "You win!";
        }
        else {
            return "You lose!";
        }
    }
    else if (userScore < 21 && dealerScore > 21) {
        // User stayed below 21.
        return "You win!";
    }
    else if (userScore > 21 && dealerScore < 21) {
        // Dealer stayed below 21.
        return "You lose!";
    }
    else {
        return "???";
    }

};

// Card Constructor
function Card(suit, card) {
    this.suit = suit;
    this.card = card;
    this.getNumber = function() {
        return card;
    };
    this.getSuit = function() {
        return suit;
    };
    this.getValue = function() {
        var value = this.card % 13;
        
        if (value > 10 || value == 0) { // Jack, Queen, King
            return 10;
        }
        else if (value == 1) { // Ace
            return 11;
        }
        return value; // All other cards.
    };
}

// Deck class
function Deck() {
    this.cards = new Array(52);
    
    // Takes in card number and suit,
    // Returns true if card has already been dealt, false if not.
    this.cardIsDealt = function(suit, card) {
        var iCard = (suit * card) - 1;
        if (this.cards[iCard] == true) return true;
        else return false;
    };    
    this.setCard = function(suit, card) {
      var iCard = (suit * card) - 1;
      this.cards[iCard] = true;
    };
    this.deal = function() {
        var suit = Math.floor((Math.random()*4)+1);
        var number = Math.floor((Math.random()*13)+1);
        
        // Select a card to deal and make sure it hasn't been dealt yet.
        while (deck.cardIsDealt(suit, number)) {
            suit = Math.floor((Math.random()*4)+1);
            number = Math.floor((Math.random()*13)+1);
        }

        // When an undealt card is selected, flag the card as dealt and return it.
        this.setCard(suit, number);
        return new Card(suit, number);
    };
}

function Hand(card1, card2) {
    this.cards = [card1, card2];
    
    this.getHand = function() {
        return this.cards;
    };
    this.score = function() {
        var total = 0;
        var numAces = 0;
        var temp = 0;
        
        for (var i = 0; i < this.cards.length; i++) {
          total += this.cards[i].getValue();
          if (this.cards[i].getValue() == 11) numAces++;
        }
        // 
        temp = total;
        while (numAces > 0 && temp > 21) {
            temp -= 10;
            numAces -= 1;
        }
        if (temp < total) return temp
        else return total;
    };
    this.printHand = function() {
        var hand = new Array();
        var suit = 0;
        var royal = "";
        
        for (var i = 0; i < this.cards.length; i++) {
            switch (this.cards[i].getSuit()) {
                case 1:
                    suit = "clubs";
                    break;
                case 2:
                    suit = "diamonds";
                    break;
                case 3:
                    suit = "hearts";
                    break;
                case 4:
                    suit = "spades";
                    break;
            }
            if (this.cards[i].getNumber() > 10 || this.cards[i].getNumber() == 1) {  
                switch (this.cards[i].getNumber()) {
                    case 1:
                        royal = "Ace";
                        break;
                    case 11:
                        royal = "Jack";
                        break;
                    case 12:
                        royal = "Queen";
                        break;
                    case 13:
                        royal = "King";
                        break;
                }
                //str += royal + " of " + suit + "\n";
                hand.push(royal + " of " + suit);
            }
            else {
                //str += this.cards[i].getNumber() + " of " + suit + "\n";
                hand.push(this.cards[i].getNumber() + " of " + suit);
            }
            
        }
        return hand;
    };
    this.hitMe = function(card) {
        this.cards.push(card);
    };
}

function displayPlayerData(hand, handEleId, scoreEleId) {
  var ulPlayerHand = document.getElementById(handEleId);
  var strHand = hand.printHand();
  var newLi;
  var newText = "";
  var currentCard = 0;
  
  /* ======== HAND ======== */
  // Li elements already exist.
  if (ulPlayerHand.childNodes.length > 0) {
    // Replace text of any existing li elements with the cards from the new hand.
    for (var i = 0; i < ulPlayerHand.childNodes.length; i++) {
      if (currentCard < strHand.length) {
        ulPlayerHand.childNodes[i].firstChild.nodeValue = strHand[currentCard];
        if (ulPlayerHand.childNodes[i].style.display == 'none') {
          ulPlayerHand.childNodes[i].style.display = 'list-item';
        }
      }
      else { // If there are no more cards, hide the remaining nodes.
        ulPlayerHand.childNodes[i].style.display = 'none';
      }
      currentCard++;
    } 
  }
  else { // If there are no li elements, create them.
    for (var i = 0; i < strHand.length; i++) {
      newLi = document.createElement("li");
      newText = document.createTextNode(strHand[i]);
      newLi.appendChild(newText);
      ulPlayerHand.appendChild(newLi);
    }
  }
  
  // Create additional li elements if there are more cards than existing li elements.
  if (strHand.length > ulPlayerHand.childNodes.length) {
    for (; currentCard < strHand.length; currentCard++) {
      newLi = document.createElement("li");
      newText = document.createTextNode(strHand[currentCard]);
      newLi.appendChild(newText);
      ulPlayerHand.appendChild(newLi);
    }     
  }  
  
  /* ======== SCORE ======== */
  if (document.getElementById(scoreEleId).hasChildNodes()) {
    document.getElementById(scoreEleId).firstChild.nodeValue = hand.score();
  }
  else {
    var scoreText = document.createTextNode(hand.score());
    document.getElementById(scoreEleId).appendChild(scoreText);
  }  
}

function displayResults(playerHand, dealerHand) {
  if (document.getElementById("results").hasChildNodes()) {
    document.getElementById("results").firstChild.nodeValue = declareWinner(playerHand, dealerHand);
  }
  else {
    var resultsNode = document.createTextNode(declareWinner(playerHand, dealerHand));
    document.getElementById("results").appendChild(resultsNode);
  }  
}

function main() {
    // Refresh the deck for each game.
    deck = new Deck();
    var playerHand = playAsUser();
    var dealerHand = playAsDealer();
    
    // Display player data for user and dealer.
    displayPlayerData(playerHand, "playerHand", "playerScore");
    displayPlayerData(dealerHand, "dealerHand", "dealerScore");
    
    // Display whether the user won or lost.
    displayResults(playerHand, dealerHand);
}; 