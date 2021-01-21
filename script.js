/* Input Text Box */
function generateMainInputTextBox() {
    const mainInputTextBoxBase = mainInputTextBox();
    $('.inputBreedMainDropDown').append(mainInputTextBoxBase);
}

function mainInputTextBox() {

    return `<input id="dog-select" type="text" id="name" name="name" required
    minlength="0" maxlength="25" size="10" pattern="[a-zA-Z]+" oninvalid="this.setCustomValidity(validationCheck())"  placeholder="Enter favorite">`;
}

function validationCheck(){
    if($('#dog-select').val() === ""){
        return "This field can not be left blank";
    }else{
        return "Plese enter alphabets only";
    }
}

/* Random number generator */

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/* Generates Images after form submission */
function generateImage(responseJson) {

    let breedDogsMessageLength = responseJson.message.length;
    let receivedRandomIntegerValue = getRandomInteger(0, breedDogsMessageLength);

    $(".userOuputHolder").append(`<div class="dogImageContainer"><img class="dogImageStyle" src='${responseJson.message[receivedRandomIntegerValue]}' alt='dog'></div>`);
}

/* Generates Images on default page load */
function generateDefaultImages(responseJson) {
    let breedDogsMessageLength = responseJson.message.length;
    let receivedRandomIntegerValue = getRandomInteger(0, breedDogsMessageLength);

    $(".placeHolderImageHeaderContainer").append(`<div class="dogImageContainer"><img class="dogImageStyle" src='${responseJson.message[receivedRandomIntegerValue]}' alt='dog'></div>`);
}

function getDogImage(breedType, defaultValAvailCheck) {
    var getBreedType = breedType;
    // construct url
    var url = "https://dog.ceo/api/breed/" + getBreedType + "/images";
    fetch(url)
        .then(response => response.json())
        .then(
            responseJson => {
                if(responseJson.status === "success"){
                    if (defaultValAvailCheck === true) {
                        generateDefaultImages(responseJson);
                    } else if (defaultValAvailCheck === false) {
                        generateImage(responseJson);
                    }
                }else if(responseJson.status === "error"){
                    throw '🤪Dog breed not found. Not a good dog fan?😪Please try again with other breed name😀🤣';
                }
            }
        )
        .catch(error => {
            $('#serverErrorReportContainer').css('display','block');
            $('#serverErrorReportContainer').text(error);
        });
}

/* Handle actions after form submission */
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        // Remove placeholder header
        if ($('.placeHolderHeader').length) {
            $(".placeHolderHeader").remove();
        }

        if ($('.dogImageContainer').length) {
            $(".dogImageContainer").remove();
        }

        // make error report field blank
        $('#serverErrorReportContainer').css('display','none');
        $('#serverErrorReportContainer').text("");

        if (($('#dog-select').val()) === "") {
            alert("Please Enter Breed Type");
        } else {
            /* Get Breed of Dog From user */
            var tempInputStringHolder = $('#dog-select').val();
            var userSelectedBreed = tempInputStringHolder.toLowerCase();

            /* pass this value to fetching function */
            getDogImage(userSelectedBreed, false);
        }
    });
}

/* Generate random breed type */
function generateRandomBreed(breed) {
    let randomIntegerNumber = getRandomInteger(0, ((breed.length) - 1));
    let randomBreedType = breed[randomIntegerNumber].id;
    return randomBreedType;
}

/* Load three random dog images on page load */
function initialDefaultDogImages(breed) {
    let tempBreedHolder = generateRandomBreed(breed);
    getDogImage(tempBreedHolder, true);
}

/*Footer*/

function generateFooter() {
    const dogFooterBase = dogFooter();
    $('#footer').append(dogFooterBase);
}

function dogFooter() {
    return `<div class="footContain"><div class="footStyles"><span>&nbsp;Dogs Breed Panel&nbsp;&nbsp;<br></span><span>Nesh &copy; ${getCopyRightYear()}</span></div></div>`;
}

function getCopyRightYear() {
    return new Date().getFullYear();
}

$(window).bind("load", function() {
    var footerHeight = 0,
        footerTop = 0,
        $footer = $("#footer");
    positionFooter();

    function positionFooter() {
        footerHeight = $footer.height();
        footerTop = ($(window).scrollTop() + $(window).height() - footerHeight) + "px";
        if (($(document.body).height() + footerHeight) < $(window).height()) {
            $footer.css({
                position: "absolute"
            }).animate({
                top: footerTop
            })
        } else {
            $footer.css({
                position: "static"
            })
        }
    }
    $(window)
        .scroll(positionFooter)
        .resize(positionFooter)
});

/* Initialize App */
$(function() {
    // get Breed List loaded First when default random image appears
    (async() => {
        let response = await fetch('https://dog.ceo/api/breeds/list/all');
        let responseJson = await response.json();
        const temp = await generateBreedsArray(responseJson);
        const breed = temp;
        generateMainInputTextBox();
        initialDefaultDogImages(breed);
        watchForm();
        generateFooter();
    })();
});