let instructions = {};
let sequenceLettres = [];
let sequenceExercices = [];
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
let page=1;

// Charger le fichier CSV
function preload() {
    loadTable('instructions.csv', 'csv', 'header', (table) => {
        for (let row of table.rows) {
            instructions[row.get('lettre')] = row.get('instruction');
        }
    });
}

function setup() {
    // mimics the autoplay policy
    getAudioContext().suspend();
    // Create a canvas that's hidden by default
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    
    // Ensure the canvas is behind other elements
    canvas.parent(document.body);
    
    // Initialize oscillator
    userStartAudio(); // Demande explicitement l'autorisation audio
    osc = new p5.Oscillator('sine');
    osc.amp(0.1);  // Set volume
    osc.freq(440); // Standard A4 note frequency
    osc.start();
    osc.stop();
}



//pour des bips sans passer par le mp3
let osc;
function playBeep() {
    // Increase volume (0.1 to 0.5)
    osc.amp(0.5);
    osc.freq(880);
    osc.start();
    setTimeout(() => {
        osc.stop();
    }, 150);  // Slightly longer beep duration
    
}

function page2() {
    page=2;
    let lettresInput = document.getElementById('lettres').value.toUpperCase();
    
    // Récupérer les options sonores
    optionsBips = document.getElementById('avecBips').checked;
    optionsCloche = document.getElementById('avecCloche').checked;
    optionsMusique = document.getElementById('avecMusique').checked;
    optionOrdreExercicesAleatoire = document.getElementById('avecOrdreAleatoire').checked;

    // Réinitialiser la séquence de lettres
    sequenceLettres = lettresInput.split('');
    
    
    // Créer la séquence d'exercices
    sequenceExercices = [];
    for(lettre of sequenceLettres) {
        let instructionCorrespondante = instructions[lettre];
        if(instructionCorrespondante.startsWith('*')) {
            sequenceExercices.push(instructionCorrespondante+' gauche');
            sequenceExercices.push(instructionCorrespondante+' droite');
        } else {
            sequenceExercices.push(instructionCorrespondante);
        }
    }

    if(optionOrdreExercicesAleatoire) {
        shuffle(sequenceExercices, true);
    }


    const container = document.getElementById('sequence-container');
    container.innerHTML = '';
    sequenceExercices.forEach((instruction, index) => {
        const div = document.createElement('div');
        div.className = 'sequence-item';
        div.textContent = `${index + 1}. ${instruction}`;
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
    page=3;
    afficherPage(3);

    // Afficher la liste complète des exercices
    const listeContainer = document.getElementById('liste-instructions');
    listeContainer.innerHTML = '';
    sequenceExercices.forEach((instruction, index) => {
        const div = document.createElement('div');
        div.className = 'instruction-item';
        div.id = `instruction-${index}`;
        div.textContent = `${index + 1}. ${instruction}`;
        listeContainer.appendChild(div);
    });

    exerciceDansListe(-1); // au départ, aucun exercice actif

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
        const timerElement = document.getElementById('timer');

        // Jouer les sons et mettre en rouge le timer        
        if (optionsBips && ( (timer === 3 || timer === 2 || timer === 1) || (!estPause && timer === Math.floor(dureeExercice / 2)))) {
            playBeep();
            timerElement.style.color = 'red';
        } else if (optionsCloche && timer === 0) {
            document.getElementById('cloche').currentTime = 0;
            document.getElementById('cloche').play();
        } else {
            timerElement.style.color = 'black';
        }
            
        
        if (timer <= 0) {
            if (estPause) {
                estPause = false;
                exerciceDansListe(exerciceActuel);
                timer = dureeExercice;
                // afficher l'instruction courante
                const instruction = sequenceExercices[exerciceActuel];
                document.getElementById('instruction-courante').textContent = instruction;
                
                
            } else {
                estPause = true;
                timer = tempsPauseEntreExercices; // Durée de la pause
                document.getElementById('instruction-courante').textContent = "PAUSE";
                exerciceActuel++;
                exerciceDansListe(exerciceActuel, true)
                //si on a terminé
                if (exerciceActuel >= sequenceExercices.length) {
                    arreterTimer();
                    afficherPage(4);
                    page=4;
                    return;
                }

            }
            timerElement.style.color = 'black';
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

function mousePressed() {
    userStartAudio();
  }