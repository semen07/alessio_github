posti = {
    "Fila 1": {'Numero di fila': 1, 'Numero di posti disponibili': 4, 'Piena': 0, 'Studenti': []},
    "Fila 2": {'Numero di fila': 2, 'Numero di posti disponibili': 4, 'Piena': 0, 'Studenti': []},
    "Fila 3": {'Numero di fila': 3, 'Numero di posti disponibili': 4, 'Piena': 0, 'Studenti': []},
    "Fila 4": {'Numero di fila': 4, 'Numero di posti disponibili': 4, 'Piena': 0, 'Studenti': []},
    "Fila 5": {'Numero di fila': 5, 'Numero di posti disponibili': 4, 'Piena': 0, 'Studenti': []},
}

// Definisci un oggetto vuoto per contenere i dati delle persone
var persone = {};

// Seleziona il modulo del modulo HTML
var form = document.querySelector('form');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Cicla attraverso gli elementi del modulo (gli input select)
    for (var i = 0; i < form.elements.length; i++) {
        var input = form.elements[i];
        if (input.tagName === 'SELECT') {
            var nomeStudente = input.name;
            var cognome = input.previousElementSibling.textContent;
            var fila = parseInt(input.value);

            // Crea un oggetto per rappresentare lo studente
            var studente = {
                "Cognome": cognome,
                "Fila": fila
            };

            // Aggiungi lo studente all'oggetto persone
            persone[nomeStudente] = studente;
        }
    }

    // Chiamare la funzione assegnaFilaConPreferenzeNumeriche per ottenere l'assegnazione delle file
    var assegnazioni = estraiStudenti(persone, posti);
    var percentualeSoddisfazione = calcolaPercentualeRichiesteSoddisfatte(persone, assegnazioni);
    console.log(assegnazioni);
    console.log(percentualeSoddisfazione);
    console.log(persone);
    console.log(posti);

    var risultatiDiv = document.createElement('div');
    risultatiDiv.innerHTML = '<h2>Risultati dell\'assegnazione delle file:</h2>';

    for (const fila in assegnazioni) {
        risultatiDiv.innerHTML += `<p>Fila ${fila}: ${assegnazioni[fila].join(', ')}</p>`;
    }

    // Aggiungere i risultati alla pagina
    document.body.appendChild(risultatiDiv);
});

function calcolaPercentualeRichiesteSoddisfatte(studenti, assegnazioni) {
    let totaleRichieste = 0;
    let richiesteSoddisfatte = 0;

    for (const studente in studenti) {
        totaleRichieste += 1;
        const preferenzaFila = studenti[studente]['Fila'];
        if (assegnazioni[`Fila ${preferenzaFila}`].includes(studenti[studente]['Cognome'])) {
            richiesteSoddisfatte += 1;
        }
    }

    const percentualeSoddisfatte = (richiesteSoddisfatte / totaleRichieste) * 100;
    return percentualeSoddisfatte;
}

function estraiStudenti(studenti, posti) {
    const studentiRandom = Object.keys(studenti).sort(() => Math.random() - 0.5);
  
    for (const studente of studentiRandom) {
      const preferenzaFila = studenti[studente]['Fila'];
      const filaInfo = posti['Fila ' + preferenzaFila];
  
      if (filaInfo['Numero di posti disponibili'] > 0) {
        filaInfo['Studenti'].push(studenti[studente]['Cognome']);
        filaInfo['Numero di posti disponibili'] -= 1;
      } else {
        for (const fila in posti) {
          if (posti[fila]['Numero di posti disponibili'] > 0) {
            posti[fila]['Studenti'].push(studente);
            posti[fila]['Numero di posti disponibili'] -= 1;
            break;
          }
        }
      }
    }
  
    const studentiPerFila = {};
    for (const fila in posti) {
      studentiPerFila[fila] = posti[fila]['Studenti'];
    }
  
    return studentiPerFila;
}