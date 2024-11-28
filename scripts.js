// Vars
let readMore;
let readLess;

/**
 * Show or hide the additional informations of the given project.
 * @param {*} event 
 */
function toggleReadMore(event) {
    const description = event.target.previousElementSibling;

    if (description.classList.contains('more-text-closed')) {
        description.classList.remove('more-text-closed');
        description.classList.add('more-text-opened');
        event.target.setAttribute("data-key","read-less");
        event.target.textContent = readLess;
    } else {
        description.classList.add('more-text-closed');
        description.classList.remove('more-text-opened');
        event.target.setAttribute("data-key","read-more");
        event.target.textContent = readMore;
    }
}

/**
 * In the result section of each project.
 * A click on an image will display it in full-screen.
 * @param {*} event 
 */
function displayPicture(event) {
    // Image to display Vars
    let figureInitial = event.target;
    let imgInitial;
    let figcaptionInitial;
    // Image holder Vars
    const divImgHolder = document.querySelector("#img-close-up");
    let imgHolder;
    let figcaptionHolder;
    // Initialise
    // In case the image is cliked instead of the figure
    if(!figureInitial.matches("figure")){
        figureInitial = figureInitial.parentNode
    }
    imgInitial = figureInitial.querySelector("img");
    figcaptionInitial =  figureInitial.querySelector("figcaption");
    // Show div
    divImgHolder.style.visibility = "visible";
    // Set image
    imgHolder = divImgHolder.querySelector("img");
    imgHolder.src = imgInitial.src;
    // Set description
    figcaptionHolder = divImgHolder.querySelector("figcaption");
    console.log(figcaptionInitial.textContent);
    figcaptionHolder.textContent = figcaptionInitial.textContent;
}
/**
 * Hide the full-screen image.
 */
function hidePicture(){
    const bigImgHolder = document.querySelector("#img-close-up");
    bigImgHolder.style.visibility = "hidden";
}

/**
 * On page load. Load the default language
 */
document.addEventListener('DOMContentLoaded', function () {
    const languageSwitcher = document.getElementById('language-switcher');
    let currentLanguage = navigator.language.substring(0,2) == 'fr' ? 'fr' : 'en'; // default lang is english

    languageSwitcher.addEventListener('click', function () {
        currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
        updateLanguage(currentLanguage);
    });

    /**
     * fetch the Translation of the page for the given language.
     * @param {string} lang A two character string for the language (fr, en, sp)
     * @returns json file with translations for each field
     */
    async function fetchLanguage(lang){
        return  fetch(`./Langs/${lang}.json`)
            .then((data)=>data.json());
    } 

    /**
     * Change the language of the page.
     * @param {string} language A two character string for the language (fr, en, sp)
     */
    async function updateLanguage(language) {
        const fields = await fetchLanguage(language);
        for (const [key, value] of Object.entries(fields)) {
            let elements = document.querySelectorAll(`[data-key=${key}]`);
            elements.forEach(elt => {
                elt.textContent = value;
            });
        }
        readMore = fields["read-more"];
        readLess = fields["read-less"];
        document.lang = language;
        document.querySelector("html").setAttribute("lang",language);
        languageSwitcher.querySelector("img").src = `./Images/flag_${language}.svg`
    }

    updateLanguage(currentLanguage); // Update to default
});

/**
 * Boutton CV
 */
document.getElementById("cv").addEventListener('click',(ev)=>{
    window.open(`./Images/CV_${document.lang}.pdf`,"_blank",null);
});