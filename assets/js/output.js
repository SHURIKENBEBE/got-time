var triviaNumber;
var triviaCategory;
var eventsNumber;
var eventsCategory;

function parametersURL() {

    var stringQuery = document.location.search;
    var parametersArray = stringQuery.split('&');

    switch (true) {

        case (stringQuery.includes('inputTrivia') && stringQuery.includes('inputEvents')):
            for (var i = 0; i < parametersArray.length; i++) {
                triviaNumber = parametersArray[0].split('=').pop();
                triviaCategory = parametersArray[1].split('=').pop();
                eventsNumber = parametersArray[2].split('=').pop();
                eventsCategory = parametersArray[3].split('=').pop();
            };
            getTriviaData();
            getEventsData();
            break;

        case (stringQuery.includes('inputTrivia')):
            triviaNumber = parametersArray[0].split('=').pop();
            triviaCategory = parametersArray[1].split('=').pop();
            getTriviaData();
            break;

        default:
            eventsNumber = parametersArray[0].split('=').pop();
            eventsCategory = parametersArray[1].split('=').pop();
            getEventsData();
            break;
    }
}

var mainContainer = $('#main-container');
$('body').prepend(mainContainer);

var eventsSection = $('#events-container');
var triviaSection = $('#trivia-container');
mainContainer.append(triviaSection, eventsSection);

var questionsTrivia = [];
var correctAnswerTrivia = [];
var questionNumber = 0;
var totalResponses = 0;
var askQuestion = $('<h2 class="text-center"></h2>');
var answerChoiceList = $('<p class="text-center">');
var feedback = $('<p>');
var triviaCompleted = $('<p>');

function getTriviaData() {

    if (!triviaNumber || !triviaCategory) {
        return;
    }

    var apiTrivialUrl = "https://opentdb.com/api.php?amount=" + triviaNumber + "&category=" + triviaCategory + "&type=boolean"

    fetch(apiTrivialUrl)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    for (var i = 0; i < data.results.length; i++) {

                        var dataQuestion = data.results[i].question;

                        var triviaQuestion = dataQuestion.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"')

                        questionsTrivia.push(triviaQuestion);

                        correctAnswerTrivia.push(data.results[i].correct_answer);
                    }
                    displayTriviaData()
                })
            } else {
                alert(response.status + " | " + response.statusText);
                return;
            }
        })
        .catch((error) => { alert(error) });
    return;
}

function displayTriviaData() {

    askQuestion.text(questionsTrivia[questionNumber]);
    triviaSection.append(askQuestion, answerChoiceList, feedback);

    answerChoiceList.append($('<li>True</li>'), $('<li>False</li>')).click(chooseAnswer);

    questionNumber++;
}

function chooseAnswer(e) {
    e.preventDefault();
    selectedAnswer = e.target;

    var questionIndex = (questionNumber - 1);

    if (selectedAnswer.textContent == correctAnswerTrivia[questionIndex]) {
        feedback.text('correct')
    } else {
        feedback.text('incorrect')
    }
    totalResponses++

    setTimeout(() => {

        feedback.empty();
        triviaSection.empty();
        answerChoiceList.empty();
        if (totalResponses == questionsTrivia.length) {
            triviaSection.append(triviaCompleted);
            triviaCompleted.text('all done!');
        } else {
            displayTriviaData();
        };
    }, 2000);
}

function getEventsData() {

    var idSG = 'MzAxMTMxMjN8MTY2NzUyNDQ2Ny4xOTQyNjMy'

    var apiEventsUrl = "https://api.seatgeek.com/2/events?type=" + eventsCategory + "&postal_code=" + eventsNumber + "&client_id=" + idSG

    fetch(apiEventsUrl)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => { displayEventsData(data, eventsCategory) })
            } else {
                alert(response.status + " | " + response.statusText);
                return;
            }
        })
        .catch((error) => { alert(error) });
    return;
}

function displayEventsData(data, eventsCategory) {

    var eventType = $('<h2 class="text-center"></h2>');
    eventType.text(eventsCategory);
    eventsSection.append(eventType);

    for (var i = 0; i < data.events.length; i++) {

        var eachEvent = $('<div></div>');
        
        eachEvent.attr('data-num', i)

        eventsSection.append(eachEvent);

        var eventTitle = $('<p>');
        var eventDate = $('<p>');
        var eventVenue = $('<p>');

        var dateLocal = data.events[i].datetime_local;

        eventTitle.text(data.events[i].title);
        eventDate.text(moment(dateLocal).format("MMM DD, YYYY hh:mm:ss a"));
        eventVenue.text(data.events[i].venue.name + " | " + data.events[i].venue.display_location);
        var urlEvent = $('<a href="' + data.events[i].url + '" target="_blank">link to the event</a>');

        var saveButton = $("<button>");
        saveButton.attr({
            type: 'button',
            'data-num': i,
        }).text('save').click(saveEventInfo);

        eachEvent.append(eventTitle, eventDate, eventVenue, urlEvent, saveButton);

    };

    displaySavedEvents();
    
}

var eventsSavedArray = [];

var eventsSavedSection = $('<section>');
var divSavedEventsHeading = $('<h2>Saved Events</h2>');
var clearButton = $("<button>");
var divSavedEvents = $('<div>');
mainContainer.append(eventsSavedSection);
eventsSavedSection.append(divSavedEventsHeading, clearButton, divSavedEvents);

clearButton.attr('type', 'button').text('clear').click(clearSavedEvents);


function saveEventInfo() {


    divSavedEvents.empty();
    
    var eventNum = $(this).attr('data-num');

    var divEachEvent = $("div[data-num=" + eventNum + "]");

    var storeEvent = {
        number: eventNum,
        title: divEachEvent.children().eq(0).text(),
        date: divEachEvent.children().eq(1).text(),
        venue: divEachEvent.children().eq(2).text(),
        link: divEachEvent.children().eq(3).attr('href')
    };

    
    if (eventsSavedArray.some((element => element.number == eventNum))) {
        localStorage.setItem("savedEvents", JSON.stringify(eventsSavedArray));
        displaySavedEvents();
    } else {
        eventsSavedArray.push(storeEvent);
        localStorage.setItem("savedEvents", JSON.stringify(eventsSavedArray));
        displaySavedEvents();
    };

}

function displaySavedEvents() {
    var getSavedEvents = JSON.parse(localStorage.getItem("savedEvents"));

    if (getSavedEvents == null) {
        return;
    } else {
   
        for (var i = 0; i < getSavedEvents.length; i++) {
            
            var displayEachEvent = $('<div>');
            var displayTitle = $('<p>');
            var displayDate = $('<p>');
            var displayVenue = $('<p>');
            var displayLink = $('<a target="_blank">link to the event</a>');
            
            displayTitle.append(getSavedEvents[i].title);
            displayDate.append(getSavedEvents[i].date);
            displayVenue.append(getSavedEvents[i].venue);
            displayLink.attr('href', getSavedEvents[i].link);

            divSavedEvents.append(displayEachEvent);
            displayEachEvent.append(displayTitle, displayDate, displayVenue, displayLink);

        };
        eventsSavedArray = getSavedEvents;
    };
}

function clearSavedEvents() {
    divSavedEvents.empty();
    eventsSavedArray = [];
    localStorage.clear();
}

function getQuoteData() {

    var apiQuoteUrl = "https://api.goprogram.ai/inspiration"

    fetch(apiQuoteUrl)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => { displayQuoteData(data) })
            } else {
                alert(response.status + " | " + response.statusText);
                return;
            }
        })
        .catch((error) => { alert(error) });
    return;

}

var divQuote = $('<div>')
mainContainer.append(divQuote)

function displayQuoteData(data) {

var quote = $('<p>' + data.quote + '</p>')
var author = $('<p>' + data.author + '</p>')

divQuote.append(quote, author);

}

parametersURL();


