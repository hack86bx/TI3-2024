// Définition du centre de la carte et du zoom

const map = L.map('map').setView([50.8466, 4.3528], 16);

//Ajout du fond de carte
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Récupération des données 
fetch("apicarte.php")
    .then(function (response) {
        response.json().then(function (data) {
            console.log(data);
            afficheMarqueurs(data);
            afficheListe(data);
        });
    })
    .catch(function (error) {
        console.log(error.message);
    });

// Création d'un tableau de marqueurs pour un affichage avec featureGroup
const markerTable = [];

function afficheMarqueurs(liste) {

    //Boucle pour créer les marqueurs de la liste
    for (let item in liste) {
        //Crée un marqueur pour chaque élément de la liste
        let unMarqueur = L.marker([liste[item].latitude, liste[item].longitude]).addTo(map);

        //Ajout du nom de l'item dans un popup
        unMarqueur.bindPopup(`<h3>${liste[item].nom}</h3> <p>${liste[item].adresse}</p>`);

        //Ajout de ce marqueur au tableau
        markerTable.push(unMarqueur);
    }

    // Placement du tableau de marqueurs dans le featureGroup 
    const groupe = new L.featureGroup(markerTable);

    // On adapte l'affichage de la carte en fonction de la position des marqueurs

    map.fitBounds(groupe.getBounds());
}

function afficheListe(liste) {
    const divListe = document.getElementById('liste');
    const ul = document.createElement("ul");

    liste.forEach(function (item, index) {
        //Créer l'élément de type li
        let li = document.createElement("li");
        //remplir le li
        li.innerHTML = `${item.nom} | ${item.adresse}`;
        //Ajoute un eventListener sur l'event clic
        li.addEventListener('click', itemClick);
        //ajouter un attribut à cet item li pour l'identifier
        li.setAttribute("id", `${item.idgeoloc}`);
        //Ajoute un attribut à cet item li pour stocker les coordonnées
        li.setAttribute("latitude", `${item.latitude}`);
        li.setAttribute("longitude", `${item.longitude}`);

        //attacher ce li au ul
        ul.appendChild(li);
    });

    //attacher la liste ul au div
    divListe.appendChild(ul);
}



function itemClick() {
    console.log('Item cliqué');
    let latitude = this.getAttribute('latitude');
    let longitude = this.getAttribute('longitude');
    let id = this.getAttribute('id');
    console.log(`${latitude} ${longitude}`);

    let marqueur = markerTable[id];

    map.flyTo([latitude, longitude], 17);

    marqueur.togglePopup();
}