const cardObjectDefinitions = [
    {id:1, imagePath:'/images/plains.jpg'},
    {id:2, imagePath:'/images/island.jpg'},
    {id:3, imagePath:'/images/swamp.jpg'},
    {id:4, imagePath:'/images/mountain.jpg'},
    {id:5, imagePath:'/images/forest.jpg'}
]
const cardBackImgPath = './images/card_back.jpg'

const cardContainerElem = document.querySelector('.card-container')


/* Exemple de l'estructura d'una carta
<div class="card">
    <div class="card-inner">
        <div class="card-front">
            <img src="./images/plains.jpg" alt="" class="card-img">
        </div>
        <div class="card-back">
            <img src="./images/card_back.jpg" alt="" class="card-img">
        </div>
    </div>
</div>  */

function createCard(gridPos){

    const randomIndex = Math.floor(Math.random() * cardObjectDefinitions.length);
    const cardItem = cardObjectDefinitions[randomIndex];

    // crear divs per fer una carta
    const cardElem = createElement('div')
    const cardInnerElem = createElement('div')
    const cardFrontElem = createElement('div')
    const cardBackElem = createElement('div')

    //crear les imatges de la cara de davant i darrere
    const cardFrontImg = createElement('img')
    const cardBackImg = createElement('img')

    //afegir classes i id
    addClassToElement(cardElem, 'card')
    addClassToElement(cardElem, cardItem.id) // ha de ser classe per que es pot repetir una mateixa carta

    addClassToElement(cardInnerElem, 'card-inner')
    addClassToElement(cardFrontElem, 'card-front')
    addClassToElement(cardBackElem, 'card-back')

    //afegir rutes a les imatges i classes
    addSrcToImageElem(cardBackImg, cardBackImgPath)
    addSrcToImageElem(cardFrontImg, cardItem.imagePath)
    addClassToElement(cardBackImg, 'card-img')
    addClassToElement(cardFrontImg, 'card-img')

    // Afegir un onclick listener a la imatge de la cara frontal
    cardFrontImg.addEventListener('click', () => {
        moveToField(cardElem);
    });

    //afegir com a fills les imatges als contenidors que toca
    addChildElement(cardBackElem,cardBackImg)
    addChildElement(cardFrontElem,cardFrontImg)
    //afegir els contenidors amb els seus pares
    addChildElement(cardInnerElem, cardFrontElem)
    addChildElement(cardInnerElem, cardBackElem)
    addChildElement(cardElem, cardInnerElem)

    //afegir la carta a la seva zona corresponent
    gridPos=document.querySelector('.card-pos-'+gridPos)
    addChildElement(gridPos, cardElem)

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
        createCard(i)
    }
}
// Funció per moure una carta al contenidor field
function moveToField(cardElem) {
    const cardId = Array.from(cardElem.classList).find(cls => !isNaN(cls)); // Busca una classe que sigui un número
    // Construir dinàmicament la query per seleccionar el contenidor corresponent
    const fieldContainer = document.querySelector(`.field .card-pos-${cardId}`);
    if (fieldContainer) {
        fieldContainer.appendChild(cardElem);
        console.log(`Carta amb id ${cardId} moguda al contenidor card-pos-${cardId}.`);
    } else {
        console.error(`No s'ha trobat el contenidor .field .card-pos-${cardId}`);
    }
}

gameStart()
