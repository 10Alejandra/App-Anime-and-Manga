const cards = document.querySelector(".cards-main");

//Declarations
let animes = [];
let datosAux = [];
let find = "";
let limit = 5;
let offset = 0;
let numero = 0;
let state = false;

//Events
document.getElementById("back")
    .addEventListener("click", function(){
        offset = offset == 0 ? offset: offset-limit;
        getAnimes(state);
    });

document.getElementById("next")
    .addEventListener("click", function(){    
        offset = offset+limit;
        getAnimes(state);
    });

document.getElementById("search")
    .addEventListener("click", function(event){
        findAnime();
        document.getElementById("name").value="";
        event.preventDefault();
    });

let valor = document.getElementById("limit");
    valor.addEventListener("change", function(){
       limit = valor.value;
       getAnimes(state);
    });

document.getElementById("manga")
    .addEventListener("click", function(event){
        state=true;
        getAnimes(state);
    });

document.getElementById("anime")
    .addEventListener("click", function(event){
        state= false;
        getAnimes(state);
    });

//Functions
function findAnime() { 
    find = document.getElementById("name").value;
    getAnimes(state); 
}

function getAnimes(state) {
    let url="";
    if(state === true){
        url = `https://kitsu.io/api/edge/manga?page[limit]=${limit}&page[offset]=${offset}`;
        if (find !== "") {
            url = `https://kitsu.io/api/edge/manga?filter[text]=${find}&page[limit]=${limit}&page[offset]=${offset}`;
        }
    }else {
        url = `https://kitsu.io/api/edge/anime?page[limit]=${limit}&page[offset]=${offset}`;
        if (find !== "") {
            url = `https://kitsu.io/api/edge/anime?filter[text]=${find}&page[limit]=${limit}&page[offset]=${offset}`;
        }
    }
    fetch(url)
        .then(res => res.json())
        .then(datos => {
            animes = datos.data;
            showAnime(animes);
        })
        .catch(error => console.log("Error al cargar los datos", error));
}

getAnimes(state);

function showAnime(animes) {
   cards.innerHTML=animes.map(CreateHTMLAnime).join('');
}

function getImage(posterImage) {
    return posterImage ? posterImage.small : '/resources/img/img-not-found.png';
}

function getParrafo(description) {
    return description.length > 150 ? description.slice(0,150)+'...': description;
}

function getName(name) {
    return  name.en_jp ? name.en_jp : name.en; //si existe
}

function verMas(id) {
    cards.innerHTML = animes.filter(anime => anime.id.includes(id))
    .map(CreateHTMLAnime)
    .join('');
}

function CreateHTMLAnime(animes) {
    return `
    <div class="card">
        <div class="img">
          <img src="${getImage(animes.attributes.posterImage)}">
        </div>
        <div class="name">${getName(animes.attributes.titles)}</div>
        <div class="type">${animes.type}</div>
        <div class="description">
        <p >${getParrafo(animes.attributes.description)}
        <a class="mas" href="#" onclick="verMas(${animes.id})">[leer más]</a>
        </p> </div>
    </div>`;
}


