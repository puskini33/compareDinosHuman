/**
 * Get the Dino Data from dino.json file
* @return {Promise<json>} Promise that contains the json data with the dino information.
 */
async function getDinoData() {
    const response = await fetch('./dinos.json');
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();

}

// Dino Constructor
function Dinosaur (species, image_path, fact, facts, diet, height, weight) {
    this.species = species;
    this.image = ( function setImage() {
        let image = new Image();
        image.src = image_path;
        return image;
    })();
    /* The Constructor has fact and facts attributes. facts will be the list of facts for all dead dinosaurs.
    fact will contain the fact that is displayed to the user */
    this.fact = fact;
    this.facts = facts;
    this.diet = diet;
    this.height = height;
    this.weight = weight;
    }


let dinos = [];

/**
 * Generate the 8 Dinos when the user accesses the page I chose IIFE that the user does not wait for the dino objects
 * to be generated when she/he clicks the "Compare Me" button Dino objects will be pushed into the dinos array.
*/
(async function generateDinos () {
    const jsonData = await getDinoData();
    const dinosData = jsonData.Dinos;

    // Go through each Dino and generate Dino objects out of dinoData
    dinosData.forEach(function(dinoData) {

        let species = dinoData.species;
        const lowercaseSpecies = species.toLowerCase();
        let image_path = "images/" + lowercaseSpecies + ".png";

        let fact;
        let facts;

        // There is only 1 Pigeon Fact
        if (lowercaseSpecies === "pigeon") {
            fact = dinoData.fact;
            facts = [];
        }
        else {
            fact = "";
            facts = dinoData.facts;
        }

        // Generate Dinosaur object
        let dino = new Dinosaur(species, image_path, fact, facts, dinoData.diet, dinoData.height, dinoData.weight);
        dinos.push(dino);

    })
    // Enable "CompareMe" button only when the dino objects were successfully created
    if (dinos.length !== 0) {document.getElementById("btn").removeAttribute("disabled");}
})()


// Human Constructor
function Human () {
    this.image = (function setImage() {
        let image = new Image();
        image.src = "images/human.png";
        return image;
    })();

}

// Generate Human Object
let human = new Human();


/**
 * Get Human Data from the form, compare it with the Dino Data and set up the grid with both human and dino data.
 */
function onCompareMeButtonClick () {
    // Get human data from form
    human.name = document.getElementById("name").value;
    human.height = Math.round(parseInt(document.getElementById("feet").value) +
        (parseInt(document.getElementById("inches").value) / 12));
    human.weight = parseInt(document.getElementById("weight").value);
    human.diet = document.getElementById("diet").value;

    // Hide form
    document.getElementById("dino-compare").setAttribute("hidden", "true");

    // Display Grid
    let gridHTML = document.getElementById("grid");
    gridHTML.style.display = "flex";

    // Compare dino facts to human
    compareDinoHuman();

    setUpGrid();
}


/**
 * Based on a random number from 0 to 5, get the corresponding dino fact and set it on the dino.fact attribute of
 * the dino object.
 */
function compareDinoHuman () {

    for (let i=0; i<7; i++) {
        // Generate random number from 0 to 5
        let randomNumber = Math.round(Math.random() * 5);

        // Use switch method to get the correct dino fact based on the randomNumber
        switch (randomNumber) {
            case 0:
                dinos[i].fact = dinos[i].facts[0];
                break;
            case 1:
                dinos[i].fact = dinos[i].facts[1];
                break;
            case 2:
                dinos[i].fact = dinos[i].facts[2];
                break;
            case 3:
                compareWeight(human.weight, dinos[i]);
                break;
            case 4:
                compareHeight(human.height, dinos[i]);
                break;
            case 5:
                compareDiet(human.diet, dinos[i]);
                break;
        }
    }
}

/**
 * Compare human weight and dino weight and set the dino weight fact on the fact attribute of the dino object.
 * @param {number} humanWeight the human weight
 * @param {Object} dino Dino object to compare with
  */
function compareWeight(humanWeight, dino) {
    let heavierByThisMuch = dino.weight - humanWeight;
    dino.fact = dino.species + " weights more than you by " + heavierByThisMuch + " lbs!";
}
    
/**
 * Compare human height and dino height and set the dino height fact on the fact attribute of the dino object.
 * @param {number} humanHeight the human weight
 * @param {Object} dino Dino object to compare with
  */
function compareHeight(humanHeight, dino) {
    let tallerByThisMuch = dino.height - humanHeight;
    dino.fact = dino.species + " is taller than you by " + tallerByThisMuch + " inches!";
}

    
/**
 * Compare human diet and dino diet and set the dino diet fact on the fact attribute of the dino object.
 * @param {string} humanDiet the human weight
 * @param {Object} dino Dino object to compare with
  */
function compareDiet(humanDiet, dino) {
    if (humanDiet.toLowerCase() === dino.diet) {
        dino.fact = dino.species + " was a " + dino.diet + " as you!"
    }
    else {
        dino.fact = dino.species + " had a different diet than you. He was a " + dino.diet + "!"
    }
}


/**
 * Set up the grid with 9 tiles: 7 Dinosaurs, 1 Pigeon , and 1 Human
 */
function setUpGrid() {
    const gridItems = document.getElementsByClassName('grid-item');

    for (let i=0; i<=3; i++) {
        gridItems[i].textContent = dinos[i].species;
        gridItems[i].appendChild(dinos[i].image);
        gridItems[i].append(dinos[i].fact);

    }

    // Human Tile
    gridItems[4].textContent = human.name;
    gridItems[4].appendChild(human.image);

    for (let i=4; i<=7; i++) {
        gridItems[i+1].textContent = dinos[i].species;
        gridItems[i+1].appendChild(dinos[i].image);
        gridItems[i+1].append(dinos[i].fact);

    }

}
