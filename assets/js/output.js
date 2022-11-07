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

var mainContainer = $('<main>');
$('body').prepend(mainContainer);

var eventsSection = $('<div>');
var triviaSection = $('<div>');
mainContainer.append(triviaSection, eventsSection);

var questionsTrivia = [];
var correctAnswerTrivia = [];
var questionNumber = 0;
var totalResponses = 0;
var askQuestion = $('<h2>');
var answerChoiceList = $("<ul>");
var feedback = $('<p>');
var triviaCompleted = $('<h3>');

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

    var eventType = $('<h1>');
    eventType.text(eventsCategory);
    eventsSection.append(eventType);

    for (var i = 0; i < data.events.length; i++) {

        var eachEvent = $('<div>');
        eventsSection.append(eachEvent);

        var eventTitle = $('<h2>');
        var eventDate = $('<p>');
        var eventVenue = $('<p>');

        var dateLocal = data.events[i].datetime_local;

        eventTitle.text(data.events[i].title);
        eventDate.text(moment(dateLocal).format("MMM DD, YYYY hh:mm:ss a"));
        eventVenue.text(data.events[i].venue.name + " | " + data.events[i].venue.display_location);
        var urlEvent = $('<a href="' + data.events[i].url + '" target="_blank">link to the event</a>');

        eachEvent.append(eventTitle, eventDate, eventVenue, urlEvent);

    };
}

// buttons to save and clear events

function saveEventInfo() {

}

function getQuoteData() {

}

function displayQuoteData() {

}

parametersURL();