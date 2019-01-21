
let icons = ["fa-diamond", "fa-diamond",
            "fa-paper-plane-o", "fa-paper-plane-o",
            "fa-anchor", "fa-anchor",
            "fa-bolt","fa-bolt",
            "fa-cube", "fa-cube",
            "fa-leaf", "fa-leaf",
            "fa-bicycle","fa-bicycle",
            "fa-bomb", "fa-bomb"
            ];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
//

const cardsContainer = document.querySelector(".deck");

const checkIfCardsMatch = (pairOfCards) => {
    const firstCard = pairOfCards[0].firstElementChild.className;
    const secondCard = pairOfCards[1].firstElementChild.className;
    return firstCard === secondCard;
};

const hideCards = (cards) => {
    cards.forEach(function(card) {
        card.classList.remove('open', 'show'); 
    });
};

const matchCards = (cards) => {
    cards.forEach(function(card) {
        card.classList.add('match');
    });
    gameOver();
};

const gameOver= () => {
    let matches= document.querySelectorAll('.match');
    if (matches.length === icons.length) { // the game has ended
        stopClock();
        showModal();
    }
}
//initialize clock when game starts

let clockOff = true;
let time = 0;
let clockId;

function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
        // console.log(time);
    }, 1000);
}

function stopClock() {
    clearInterval(clockId);
}

function displayTime() {
    const clock = document.querySelector('.clock');
    // console.log(clock);
    clock.innerHTML = time;
    
    //Clock Display Formatting
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }

}
//controlling moves 

let moves = 0

function addMove() {
    moves++
    const movesText = document.querySelector('.moves')
    movesText.innerHTML = moves;
}
// controlling the amount of stars shown

function hideStar() {
    const starList = document.querySelectorAll('.fa-star');
    console.log('starList: ', starList);

    for (let star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}


function checkScore() {
    if (moves === 15 || moves === 26) {
        hideStar();
    }
}

//the modal

function showModal () {
    document.querySelector('.modal_background').classList.remove('hide');
    writeModalStats();
}

function hideModal () {
    document.querySelector('.modal_background').classList.add('hide');
}

document.querySelector('.modal_cancel').addEventListener('click', () => {
    hideModal();
});

document.querySelector('.modal_replay').addEventListener('click', () => {
    console.log('replay');
    hideModal();
    resetGame();
});

function writeModalStats () {
    let timeStat = document.querySelector('.modal_time');
    let clockTime = document.querySelector('.clock').innerHTML;
    let movesStat = document.querySelector('.modal_moves');
    let starsStat = document.querySelector('.modal_stars');
    
    let stars = getStars();


    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
    
}


function getStars() {
    stars = document.querySelectorAll('.fa-star');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    console.log(starCount); 
    return starCount;
}

//resets the game

function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    resetMatches();
    clearDeck();
    init();
}

function clearDeck() {
    while (cardsContainer.hasChildNodes()) {
        cardsContainer.removeChild(cardsContainer.lastChild);
    }
}
function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

function resetMatches() {
    const allOpen = document.querySelectorAll('.open');

    for (let open of allOpen) {
        open.classList.remove('match');
        open.classList.remove('open');
        open.classList.remove('show');
        open.classList.add('close');
    }
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.fa-star');
    for (star of starList) {
        star.style.display = 'inline';
    }
}


document.querySelector('.restart').addEventListener('click', resetGame);
document.querySelector('.modal_replay').addEventListener('click', resetGame);

//initialize the game
function init () {
    shuffle(icons);

    for(let i=0; i < icons.length; i++) {
        const card = document.createElement("li");
        card.innerHTML = `<i class="fa ${icons[i]}"></i>`;
        card.classList.add("card");
        cardsContainer.appendChild(card);
    }
    
    var totalCards = document.querySelectorAll('.card');
    var openCards = [];
    let moves = 3;
    
        //adding listeners to the cards
        totalCards.forEach(function(card) {
            card.addEventListener('click', function(e) {
                moves--;

                if (clockOff) {
                    startClock();
                    clockOff = false;
                }
                
                if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match') )
                    openCards.push(card);
                    card.classList.add('open', 'show');
        
                    //if they do match
                    var firstCardType = openCards[0].dataset.card
                    console.log(firstCardType);
        
        
                    //allows cards to go away if they don't match up 
                    if (openCards.length == 2) {
                        setTimeout(function() {
                            console.log('openCards: ', openCards);
                            if (checkIfCardsMatch(openCards)) {
                                matchCards(openCards);
                            } else {
                                hideCards(openCards); 
                            }
                            openCards = [];
                            addMove();
                            checkScore();
                        }, 550);
                    } 
            });
        });
}
init();



