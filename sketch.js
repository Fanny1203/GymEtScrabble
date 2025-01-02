let instructions = {};
let sequence = [];
let dureeExercice = 0;
let exerciceActuel = 0;
let timer = 0;
let estPause = true; // on commence par une pause
let timerInterval;
let optionsBips = true;
let optionsCloche = true;
let optionsMusique = false;
let optionOrdreExercicesAleatoire = false;
let tempsPauseDepart = 15;
let tempsPauseEntreExercices = 10;

// Charger le fichier CSV
function preload() {
    loadTable('instructions.csv', 'csv', 'header', (table) => {
        for (let row of table.rows) {
            instructions[row.get('lettre')] = row.get('instruction');
        }
    });
}

function setup() {
    noCanvas();
}

function page2() {
    console.log('Valider et passer à la page 2');
    let lettresInput = document.getElementById('lettres').value.toUpperCase();
    

    /*if (!/^[A-Z*]+$/.test(lettresInput) || !dureeExercice) {
        alert('Veuillez entrer des lettres valides (A-J) et une durée.');
        return;
    }*/

    // Sauvegarder les options sonores
    optionsBips = document.getElementById('avecBips').checked;
    optionsCloche = document.getElementById('avecCloche').checked;
    optionsMusique = document.getElementById('avecMusique').checked;
    optionOrdreExercicesAleatoire = document.getElementById('avecOrdreAleatoire').checked;

    // Créer la séquence aléatoire si demandé
    sequence = lettresInput.split('');
    if(optionOrdreExercicesAleatoire) {
        shuffle(sequence, true);
    }
    
    // Afficher la séquence
    const container = document.getElementById('sequence-container');
    container.innerHTML = '';
    sequence.forEach((lettre, index) => {
        const div = document.createElement('div');
        div.className = 'sequence-item';
        div.textContent = `${index + 1}. ${instructions[lettre]}`;
        container.appendChild(div);
    });
    
    //gérer les temps
    dureeExercice = parseInt(document.getElementById('duree').value);
    tempsPauseDepart = parseInt(document.getElementById('tempsPauseDepart').value);
    tempsPauseEntreExercices = parseInt(document.getElementById('tempsPauseEntreExercices').value);
    timer = tempsPauseDepart;  

    

    // Afficher la page 2   
    afficherPage(2);
}

function page3() {
    afficherPage(3);

    // Afficher la liste complète des exercices
    const listeContainer = document.getElementById('liste-instructions');
    listeContainer.innerHTML = '';
    sequence.forEach((lettre, index) => {
        const div = document.createElement('div');
        div.className = 'instruction-item';
        div.id = `instruction-${index}`;
        div.textContent = `${index + 1}. ${instructions[lettre]}`;
        listeContainer.appendChild(div);
    });

    exerciceDansListe(-1);

    document.getElementById('instruction-courante').textContent = "Préparez-vous !  ";
    demarrerTimer();
}

function exerciceDansListe(index, enPause = false) {
    // Mettre à jour l'élément actif dans la liste
    document.querySelectorAll('.instruction-item').forEach((item, i) => {
        item.classList.remove('active', 'done');
        if (i < index) {
            item.classList.add('done');
        }
    });
    
    if (index !== -1 && !enPause) {
        document.getElementById(`instruction-${index}`).classList.add('active');
    }
}


function demarrerTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        // Jouer les sons
        if (optionsBips && (timer === 3 || timer === 2 || timer === 1)) {
            document.getElementById('bip').currentTime = 0;
            document.getElementById('bip').play();
        } else if (optionsCloche && timer === 0) {
            document.getElementById('cloche').currentTime = 0;
            document.getElementById('cloche').play();
        }
        
        if (timer <= 0) {
            if (estPause) {
                estPause = false;
                exerciceDansListe(exerciceActuel);
                timer = dureeExercice;
                // afficher l'instruction courante
                const instruction = instructions[sequence[exerciceActuel]];
                document.getElementById('instruction-courante').textContent = instruction;
                
                
            } else {
                estPause = true;
                timer = tempsPauseEntreExercices; // Durée de la pause
                document.getElementById('instruction-courante').textContent = "PAUSE";
                exerciceActuel++;
                exerciceDansListe(exerciceActuel, true)
                //si on a terminé
                if (exerciceActuel >= sequence.length) {
                    console.log('Termine');
                    arreterTimer();
                    afficherPage(4);
                    return;
                }

            }
        }
        
        document.getElementById('timer').textContent = timer;
        timer--;
    }, 1000);
}

function arreterTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function afficherPage(numero) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`page${numero}`).classList.add('active');
}

function retourParametrage() {
    afficherPage(1);
}

// Fonction utilitaire pour mélanger un tableau
function shuffle(array, copy) {
    if (copy) {
        array = array.slice();
    }
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
