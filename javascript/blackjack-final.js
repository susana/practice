// Global var for deck of cards.
var deck = new Deck();

// Helper functions.
var playAsDealer = function() {
    var hand = new Hand(deck.deal(), deck.deal());
    var newCard;
    if (hand.score() < 17) {            
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
        if (value > 10 || value == 0) {
            return 10;
        }
        else if (value == 1) {
            return 11;
        }
        return value;
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
          numAces++;
        }
        // 
        temp = total;
        while (numAces > 0 && temp > 21) {
            temp -= 10;
            numAces -= 1;
        }
        return total;
    };
    this.printHand = function() {
        var str = "";
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
              str += royal + " of " + suit + "\n";
            }
            else {
                str += this.cards[i].getNumber() + " of " + suit + "\n";
            }
            
        }
        return str;
    };
    this.hitMe = function(card) {
        this.cards.push(card);
    };
}

function main() {
    var playerHand = playAsUser();
    var dealerHand = playAsDealer();
    
    console.log("\nYour hand:\n" + playerHand.printHand());
    console.log("Score: " + playerHand.score());
    console.log("\nDealer's hand:\n" + dealerHand.printHand());
    console.log("Score: " + dealerHand.score());
    console.log("\nResult:\n" + declareWinner(playerHand, dealerHand));
}; 