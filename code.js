const cardObjectDefinitions = [
    {id:1, imagePath:'/images/plains.jpg'},
    {id:2, imagePath:'/images/island.jpg'},
    {id:3, imagePath:'/images/swamp.jpg'},
    {id:4, imagePath:'/images/mountain.jpg'},
    {id:5, imagePath:'/images/forest.jpg'}
]
const cardBackImgPath = './images/card_back.jpg'

const cardContainerElem = document.querySelector('.card-container')

function createCard(gridPos, isPlayer=true) {
    const randomIndex = Math.floor(Math.random() * cardObjectDefinitions.length);
    const cardItem = cardObjectDefinitions[randomIndex];

    // Crear divs per fer una carta
    const cardElem = createElement('div');
    const cardInnerElem = createElement('div');
    const cardFrontElem = createElement('div');
    const cardBackElem = createElement('div');

    // Crear les imatges de la cara de davant i darrere
    const cardFrontImg = createElement('img');
    const cardBackImg = createElement('img');

    // Afegir classes i id
    addClassToElement(cardElem, 'card');
    addClassToElement(cardElem, cardItem.id); // Ha de ser classe perquè es pot repetir una mateixa carta

    addClassToElement(cardInnerElem, 'card-inner');
    addClassToElement(cardFrontElem, 'card-front');
    addClassToElement(cardBackElem, 'card-back');

    // Afegir rutes a les imatges i classes
    addSrcToImageElem(cardBackImg, cardBackImgPath);
    addSrcToImageElem(cardFrontImg, cardItem.imagePath);
    addClassToElement(cardBackImg, 'card-img');
    addClassToElement(cardFrontImg, 'card-img');



  
    // Afegir com a fills les imatges als contenidors que toca
    addChildElement(cardBackElem, cardBackImg);
    addChildElement(cardFrontElem, cardFrontImg);
    addChildElement(cardInnerElem, cardFrontElem);
    addChildElement(cardInnerElem, cardBackElem);
    addChildElement(cardElem, cardInnerElem);

    if(isPlayer) {
    // Definir la funció del listener
    const onClickListener = () => {
        moveToField(cardElem, true);
        cardFrontImg.removeEventListener('click', onClickListener); // Eliminar el listener després de moure la carta
        let gridPosNumber = getGridPosNumber(gridPos); // Obtenir el número de la posició de la carta
        createCard(gridPosNumber, true); // Crear una nova carta a la mà inicial per substituir la que s'ha mogut
        //cardElem.style.zIndex = -1; // Moure la carta perquè estigui darrere de la de la mà, no cal si nomes hi ha 5 cartes
        WinCheck(); // Comprovar si s'ha guanyat
        tornPC(); // Juga la màquina després de moure la carta del jugador

    };
    // Afegir un onclick listener a la imatge de la cara frontal
    cardFrontImg.addEventListener('click', onClickListener);

    // Afegir la carta a la seva zona corresponent
    gridPos = document.querySelector('.hand .card-pos-' + gridPos);
    addChildElement(gridPos, cardElem);
    }
    else {
        // Afegir la carta a la seva zona corresponent
        gridPos = document.querySelector('.handPC .card-pos-' + gridPos);
        addChildElement(gridPos, cardElem);
        cardElem.style.transform= 'rotateY(0deg)'; /* La cara de davant està visible */
        cardInnerElem.style.transform = 'rotateY(180deg)'; /* La cara de darrere està visible */
    }
}

function createElement(elemType){
    return document.createElement(elemType)
}

function addClassToElement(elem, className){
    elem.classList.add(className)
}

function addIdToElement(elem, Id){
    elem.id =Id
}

function addSrcToImageElem (imgElem, src){
    imgElem.src=src
}

function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem)
}

function gameStart(){
    // afegir les 4 cartes de la mà inicial
    for (let i = 1; i <= 4; i++){
        createCard(i, true)
        createCard(i, false)

    }
}
// Funció per moure una carta al contenidor field
function moveToField(cardElem, isPlayer=true) {
    // Obtenir l'id de la carta des de la classe
    const cardId = Array.from(cardElem.classList).find(cls => !isNaN(cls)); // Busca una classe que sigui un número

    if (!cardId) {
        console.error('No s\'ha trobat cap id vàlid a les classes de la carta.');
        return;
    }

    if(isPlayer) {
    // Construir dinàmicament la query per seleccionar el contenidor corresponent
    const fieldContainer = document.querySelector(`.field .card-pos-${cardId}`);
    if (fieldContainer) {
        // Comptar quantes cartes ja hi ha al contenidor
        const existingCards = fieldContainer.querySelectorAll('.card').length;

        // Ajustar la posició de la nova carta
        cardElem.style.position = 'absolute';
        cardElem.style.top = `${existingCards * 20}px`; // Desplaça 20px per cada carta existent

        // Afegir la carta al contenidor
        fieldContainer.appendChild(cardElem);

        // Eliminar l'`onclick` de la carta
        const cardFrontImg = cardElem.querySelector('.hand .card-front img');
        if (cardFrontImg) {
            cardFrontImg.onclick = null; // Elimina l'`onclick`
        }

        console.log(`Carta amb id ${cardId} moguda al contenidor field card-pos-${cardId}.`);
    } else {
        console.error(`No s'ha trobat el contenidor .field .card-pos-${cardId}`);
    }
    }
    else {
        // Construir dinàmicament la query per seleccionar el contenidor corresponent
        const fieldContainer = document.querySelector(`.fieldPC .card-pos-${cardId}`);
        if (fieldContainer) {
            // Comptar quantes cartes ja hi ha al contenidor
            const existingCards = fieldContainer.querySelectorAll('.card').length;

            // Ajustar la posició de la nova carta
            cardElem.style.position = 'absolute';
            cardElem.style.top = `${existingCards * 20}px`; // Desplaça 20px per cada carta existent

            // Afegir la carta al contenidor
            fieldContainer.appendChild(cardElem);
            // Eliminar l'`onclick` de la carta
            const cardFrontImg = cardElem.querySelector('.hand .card-front img');
            if (cardFrontImg) {
                cardFrontImg.onclick = null; // Elimina l'`onclick`
            }
            console.log(`Carta amb id ${cardId} moguda al contenidor fieldPC card-pos-${cardId}.`);
        } else {
            console.error(`No s'ha trobat el contenidor .fieldPC .card-pos-${cardId}`);
        }
    }
}

function getGridPosNumber(element) {
    // Buscar una classe que coincideixi amb el patró "card-pos-X"
    const gridPosClass = Array.from(element.classList).find(cls => cls.startsWith('card-pos-'));

    if (gridPosClass) {
        // Extreure el número de la classe "card-pos-X"
        const gridPosNumber = gridPosClass.split('-')[2]; // Agafa la part després del segon guió
        return parseInt(gridPosNumber, 10); // Converteix a número
    }

    console.error('No s\'ha trobat cap classe amb el patró "card-pos-X".');
    return null;
}

// Funció per comprovar si s'ha guanyat (es comprova cada vegada que es mou una carta)
// Hi ha dues maneres de guanyar:
// 1. Si un contenidor té 5 cartes (guanyes)
// 2. Si tots els contenidors tenen almenys una carta (guanyes)
function WinCheck() {
    // Iterar pels contenidors de field (del 1 al 5)
    for (let i = 1; i <= 5; i++) {
        const fieldContainer = document.querySelector(`.field .card-pos-${i}`);

        if (!fieldContainer || fieldContainer.children.length === 0) {
            console.log(`El contenidor card-pos-${i} està buit.`);
            return false; // Si un contenidor està buit, no hi ha victòria
        }

        if(fieldContainer.children.length === 5) {
            console.log(`El contenidor card-pos-${i} té 5 cartes. Has guanyat!`);
            return true; // Si un contenidor té 5 cartes, hi ha victòria
        }
    }

    console.log('Tots els contenidors tenen almenys una carta. Has guanyat!');
    return true; // Si tots els contenidors tenen almenys una carta, hi ha victòria
}

function tornPC() {
    const handPCContainer = document.querySelector('.handPC');

    // Obtenir totes les cartes disponibles a la mà de la màquina
    const availableCards = Array.from(handPCContainer.querySelectorAll('.card'));

    if (availableCards.length === 0) {
        console.error('No hi ha cartes disponibles a la mà de la màquina.');
        return;
    }

    // Seleccionar una carta aleatòria
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const cardItem = availableCards[randomIndex];

    if (!cardItem) {
        console.error('No s\'ha trobat cap carta vàlida.');
        return;
    }

    // Moure la carta al contenidor fieldPC
    moveToField(cardItem, false);
    const cardInnerElem = cardItem.querySelector('.card-inner');
    cardInnerElem.style.transform = 'rotateY(0deg)'; /* La cara de darrere està visible */
    

    // Crear una nova carta a la mà inicial per substituir la que s'ha mogut
    const gridPosNumber = getGridPosNumber(cardItem.parentElement); // Obtenir la posició de la carta
    createCard(gridPosNumber, false);
}

gameStart()
