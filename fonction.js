let dernierIndexIcremente;

function distribution(valeurs, iBoutonClique) {
    const n = valeurs[iBoutonClique];
    valeurs[iBoutonClique] = 0;
    let iActuel = iBoutonClique;
    for (let i = 1; i <= n; i++) {
        iActuel++;
        if (iActuel >= valeurs.length) {
            iActuel = 0;
        }
        valeurs[iActuel]++;
    }
    return iActuel;
}

function prise(valeurs, dernierIndexIcremente, j) { // j ici est l'indice des boutons cliques
    const gain1 = document.querySelector('.gain1');
    const gain2 = document.querySelector('.gain2');
    if (j >= 7 && j <= 13) {
        if (dernierIndexIcremente >= 0 && dernierIndexIcremente <= 6) {
            if (valeurs[dernierIndexIcremente] === 2 || valeurs[dernierIndexIcremente] === 3 || valeurs[dernierIndexIcremente] === 4) {
                while (dernierIndexIcremente != -1) {
                    if (valeurs[dernierIndexIcremente] === 2 || valeurs[dernierIndexIcremente] === 3 || valeurs[dernierIndexIcremente] === 4) {
                        gain1.textContent = parseInt(gain1.textContent) + valeurs[dernierIndexIcremente];
                        changemenT();
                        valeurs[dernierIndexIcremente] = 0;
                    }
                    dernierIndexIcremente--;
                }
            }
        }
    } else if (j >= 0 && j < 7) {
        if (valeurs[dernierIndexIcremente] === 2 || valeurs[dernierIndexIcremente] === 3 || valeurs[dernierIndexIcremente] === 4) {
            if (dernierIndexIcremente >= 7 && dernierIndexIcremente <= 13) {
                while (dernierIndexIcremente != 6) {
                    if (valeurs[dernierIndexIcremente] === 2 || valeurs[dernierIndexIcremente] === 3 || valeurs[dernierIndexIcremente] === 4) {
                        gain2.textContent = parseInt(gain2.textContent) + valeurs[dernierIndexIcremente];
                        changemenT();
                        valeurs[dernierIndexIcremente] = 0;
                    }
                    dernierIndexIcremente--;
                }
            }
        }
    }
}
function somme1() {
    let somme = 0;
    for (let i = 1; i <= 7; i++) {
        const bouton = document.querySelector(`.bouton${i}`);
        somme += parseInt(bouton.textContent);
    }
    return somme;
}
function somme2() {
    let somme = 0;
    for (let i = 8; i <= 14; i++) {
        const bouton = document.querySelector(`.bouton${i}`);
        somme += parseInt(bouton.textContent);
    }
    return somme;
}
function verifierGagnant() {
    const gain1 = parseInt(document.querySelector('.gain1').textContent);
    const gain2 = parseInt(document.querySelector('.gain2').textContent);
    if (gain1 > 35) {
        // Le joueur  a gagné
        alert("vous avez gagne");
        localStorage.setItem("gain1", gain1);
    } else if (gain2 > 35) {
        // L'ordinateur a gagné
        alert("vous avez perdu");
        localStorage.setItem("gain2", gain2);
    } else if (somme1 === 0) {
        alert("vous avez perdu");
        localStorage.setItem("gain2", somme1);
    } else if (somme2 === 0) {
        alert("vous avez gagnez");
        localStorage.setItem("gain1", somme2);
    }
    else if (somme1() + somme2() < 10) {
        if (gain1 + somme1() > 35) {
            // Le joueur a gagné
            alert("vous avez gagne");
            localStorage.setItem("gain1", gain1);
        } else if (gain2 + somme2() > 35) {
            // L'ordinateur a gagné
            alert("vous avez perdu");
            localStorage.setItem("gain2", gain2);
        }
    }
}
function jouerOrdinateur() {
    const buttons = Array.from({ length: 14 }, (_, i) => document.querySelector(`.bouton${i + 1}`));
    const index = Math.floor(Math.random() * 7);
    const valeurs = buttons.map(button => parseInt(button.textContent));
    if (valeurs[index] === 0) {
        jouerOrdinateur();
    } else if (index === 6 && (valeurs[index] === 1 || (valeurs[index] === 2 && (valeurs[7] > 3 && (valeurs[8] > 3 || valeurs[8] === 0))))) {

        jouerOrdinateur();
    }
    else {

        dernierIndexIcremente = distribution(valeurs, index);
        prise(valeurs, dernierIndexIcremente, index);
        buttons.forEach((button, i) => {
            button.textContent = valeurs[i];
        });
    }
    //direction();
    direction1();
}
function jouerjoueur() {
    const buttons = Array.from({ length: 14 }, (_, i) => document.querySelector(`.bouton${i + 1}`));
    buttons.forEach((button, index) => {
        button.addEventListener('click', event => {
            var gameSound = document.getElementById('gameSound');
            for (let i = 1; i <= 14; i++) {
                document.querySelector(`.bouton${i}`).addEventListener('click', playButtonSound);

                function playButtonSound() {
                    gameSound.currentTime = 0; // Réinitialise la lecture à partir du début
                    gameSound.play(); // Joue le son
                }
            }
            if (index >= 7 && index <= 13) {
                const valeurs = buttons.map(button => parseInt(button.textContent));// if indefini
                if (valeurs[index] === 0) {
                    event.preventDefault();
                } else if (index === 13 && (valeurs[index] === 1 || (valeurs[index] === 2 && (valeurs[0] > 3 && (valeurs[1] > 3 || valeurs[1] === 0))))) {
                    event.preventDefault();
                }
                else if (valeurs[index] != 0 && valeurs[index] != 2) {
                    dernierIndexIcremente = distribution(valeurs, index);
                    prise(valeurs, dernierIndexIcremente, index);
                    buttons.forEach((button, i) => {
                        button.textContent = valeurs[i];
                    });
                    verifierGagnant();
                    setTimeout(() => {
                        jouerOrdinateur();
                        verifierGagnant();
                    }, 2000);
                }
            }
        });
    });
    direction1();
}

// <!-- ################################               indicateur de direction #################################### -->
// <!-- ################################           indicateur de direction #################################### -->

function direction1() {

    // Sélectionnez les éléments HTML des flèches et des joueurs
    const arrowPlayer1 = document.querySelector('.arrow-player1');
    const arrowPlayer2 = document.querySelector('.arrow-player2');
    const player2 = document.querySelector('.player1');
    const player1 = document.querySelector('.player2');

    // Fonction pour afficher la flèche du joueur actif
    function showArrowForPlayer() {

        arrowPlayer1.style.opacity = 1;
        arrowPlayer2.style.opacity = 0;
        player1.classList.add('active');
        player2.classList.remove('active');

    }
    function showArrowForPlayer1() {

        arrowPlayer1.style.opacity = 0;
        arrowPlayer2.style.opacity = 1;
        player2.classList.add('active');
        player1.classList.remove('active');

    }

    // Fonction de gestionnaire d'événement pour changer le joueur actif lors d'un clic
    function handleClick() {
        player2.classList.contains('active');
        showArrowForPlayer();
    }
    function handleClick1() {
        player1.classList.contains('active');
        showArrowForPlayer1();
    }

    // Ajouter l'écouteur d'événement de clic sur l'élément souhaité
    //const gameContainer = document.querySelector('.sous_cadr');
    const gameContainer1 = document.querySelector('#sous_cad');
    //gameContainer.addEventListener('click', handleClick);
    gameContainer1.addEventListener('click', handleClick);
    handleClick1();

}
////////////////////////// pause //////////////////////////
function pAUs() {
    var pauseButton = document.getElementById('pauseButton');
    function pause(event) {
        event.preventDefault();
    }
    pauseButton.addEventListener('click', pause);
}

//////////////////// observateur de changement de contenu ////////////////

function changemenT() {
    // Sélectionnez l'élément bouton
    for (let i = 1; i <= 2; i++) {
        const buttonElement = document.querySelector(`.gain${i}`);

        var son = document.getElementById('gameSoundd');

        // Créez une instance de MutationObserver
        const observer = new MutationObserver(function (mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.target === buttonElement) {
                    console.log('Le contenu du bouton a été modifié');
                    playSound();
                }
            }
        });

        // Configurez l'observateur pour surveiller les modifications du contenu du bouton
        const config = { childList: true };
        observer.observe(buttonElement, config);

        // Fonction pour jouer le son
        function playSound() {
            gameSound.currentTime = 0;
            son.play();
            
        }
    }

}

document.addEventListener('DOMContentLoaded', jouerjoueur, () => { });



