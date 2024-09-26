// Script pour la barre de navigation
if(window.innerWidth < 750){
    retractNav()
}
// On vérifie que l'utilisateur n'a pas changé les dimentions de son navigateur toutes les 10 milliseondes.
window.onresize = resize;
/**
 * Si l'utilisateur agrandit la taille de la fenêtre. On doit forcer js à afficher le texte de la barre de navigation.
 * Dans le cas inverse c'est le nom de l'entreprise qu'il faut re-afficher.
 */
function resize(){
    title = document.querySelector("nav div .nomPage");
    // Quand la taille de la fenêtre est au format ordinateur
    if(window.innerWidth > 750){
        deployNav();
        title.style.display = "none";
        changeModeSousMenuLien();
        retractSousMenu();
        document.querySelector("nav").style.width = "100%";
    // Quand elle est au format téléphone
    }else if(document.querySelector("nav button").getAttribute("onclick") == "retractNav()"){
        title.style.display = "initial";
        document.querySelector("nav").style.width = "240px";
        changeModeSousMenuBouton();
    }
}

/**
 * Change l'affichage de la barre de navigation téléphone en son affichage minimal
 */
function retractNav(){
    // Récupère les dirrérentes balises
    img = document.querySelector("#navEdit > button > img");
    button = document.querySelector("#navEdit > button");
    texts = document.querySelectorAll(".nomPage");
    // Change l'icone
    img.setAttribute("src","images/icones/menu.png");
    // Change la fonction appellé par le bouton 
    button.setAttribute("onclick","deployNav()");
    // Cache tous les noms d'action de la barre de naviation
    for(var i=0 ; i<texts.length ;i++){
        texts[i].style.display = "none";
    }
    // Ferme les sous menu
    sousMenus = document.querySelectorAll("ul.sousMenu");
    for(var i=0 ; i<sousMenus.length ; i++){
        sousMenus[i].style.display = "none";
    }
    // Ferme les sous menus
    retractSousMenu();
    document.querySelector("nav").style.width = "46px";
}

/**
 * Change l'affichage de la barre de navigation téléphone en son affichage complet
 */
function deployNav(){
    // Récupère les dirrérentes balises
    img = document.querySelector("#navEdit > button > img");
    button = document.querySelector("#navEdit > button");
    texts = document.querySelectorAll(".nomPage");
    nav = document.querySelector("nav");
    // Change l'icone
    img.setAttribute("src","images/icones/fleches-de-contour-fin-a-gauche.png");
    // Change la fonction appellé par le bouton 
    button.setAttribute("onclick","retractNav()");
    // Affiche tous les noms d'action de la barre de naviation
    for(var i=0 ; i<texts.length ; i++){
        texts[i].style.display = "initial";
    };
    document.querySelector("nav").style.width = "240px";
}

/**
 * Change les options de la barre de navigation ayant un sous menu
 * en lien vers la page de navigation
 */
function changeModeSousMenuLien(){
    // Cache le bouton
    bouttonSousMenu = document.querySelectorAll("nav li.sousMenu > button");
    for(var i=0 ; i<bouttonSousMenu.length ; i++){
        bouttonSousMenu[i].style.display = "none";
    }
    // Affiche le lien
    lienSousMenu = document.querySelectorAll("nav li.sousMenu > a");
    for(var i=0 ; i<lienSousMenu.length ; i++){
        lienSousMenu[i].style.display = "block";
    }
}

/**
 * Change les options de la barre de navigation ayant un sous menu
 * en bouton déroulant les options du sous menu
 */
function changeModeSousMenuBouton(){
    // Cache le lien
    lienSousMenu = document.querySelectorAll("nav li.sousMenu > a");
    for(var i=0 ; i<lienSousMenu.length ; i++){
        lienSousMenu[i].style.display = "none";
    }
    // Affiche le bouton
    bouttonSousMenu = document.querySelectorAll("nav li.sousMenu > button");
    for(var i=0 ; i<bouttonSousMenu.length ; i++){
        bouttonSousMenu[i].style.display = "block";
    }
}

/**
 * Affiche les options du sous menu indiqué de la barre de navigation.
 * Utile pour le format téléphone
 * @param {*} nSousMenu l'indice du sous menu à afficher
 */
function deploySousMenu(nSousMenu){
    deployNav();
    // Ferme les sous menu
    sousMenus = document.querySelectorAll("li.sousMenu ul");
    for(var i=0 ; i<sousMenus.length ; i++){
        sousMenus[i].style.display = "none";
    }
    // Ouvre le menu donné
    sousMenus[nSousMenu].style.display = "block";
}

/**
 * Cache les options des sous menu de la barre de navigation.
 * Utile pour le format téléphone
 */
function retractSousMenu(){
    // Ferme les sous menu
    sousMenus = document.querySelectorAll("li.sousMenu ul");
    sousMenusHover = document.querySelectorAll("li.sousMenu:hover ul");
    for(var i=0 ; i<sousMenus.length ; i++){
        sousMenus[i].style.display = "none";
    }
}