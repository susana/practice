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
        if (value > 10) {
            return 10;
        }
        else if (value == 1) {
            return 11;
        }
        return value;
    };
}

var deal = function() {
    var suit = Math.floor((Math.random()*4)+1);
    var number = Math.floor((Math.random()*13)+1);
    return new Card(suit, number);
};

function Hand() {
    var card1 = deal();
    var card2 = deal();
    var cards = [card1, card2];
    this.getHand = function() {
        return cards;
    };
    this.score = function() {
        var total = 0;
        var numAces = 0;
        var temp = 0;
        
        for (var i = 0; i < cards.length; i++) {
          total += cards[i].getValue();
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
        
        for (var i = 0; i < cards.length; i++) {
            switch (cards[i].getSuit()) {
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
            if (cards[i].getNumber() > 10 || cards[i].getNumber() == 1) {  
                switch (cards[i].getNumber()) {
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
                str += cards[i].getNumber() + " of " + suit + "\n";
            }
            
        }
        return str;
    };
    this.hitMe = function() {
        cards.push(deal());
    };
}

var playAsDealer = function() {
    var hand = new Hand();
    if (hand.score() < 17) {
        hand.hitMe();
    }
    return hand;
};

var playAsUser = function() {
    var hand = new Hand();
    var isHit = true;
    
    while (isHit) {
        isHit = confirm("Your current hand:\n\n" + hand.printHand() + "\n\nHit?");
        if (isHit) {
            hand.hitMe();
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
    }
    else {
        return "You lose!";
    }
};

var playGame = function() {
    var playerHand = playAsUser();
    var dealerHand = playAsDealer();
    
    console.log("\nYour hand:\n" + playerHand.printHand());
    console.log("Score: " + playerHand.score());
    console.log("\nDealer's hand:\n" + dealerHand.printHand());
    console.log("Score: " + dealerHand.score());
    console.log("\nResult:\n" + declareWinner(playerHand, dealerHand));
};

window.onload = function() {  
  playGame(); 
};  