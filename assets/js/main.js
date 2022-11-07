var mainContainer = $('<main>');
var formInput = $('<form>');

$('body').prepend(mainContainer);
mainContainer.append(formInput);

// trivia
var sectionTrivia = $('<section>Trivia Questions</section>');

var labelTrivia = $('<label for="input-trivia">');
var inputTrivia = $('<input id="input-trivia" type="number" min="1" max="20">');

var selectTrivia = $('<select>Select a Category</select>');
var optionChooseTrivia = $('<option selected disabled>Choose:</option>');
var optionOneTrivia = $('<option value="9">General Knowledge</option>');
var optionTwoTrivia = $('<option value="14">TV</option>');
var optionThreeTrivia = $('<option value="12">Music</option>');
var optionFourTrivia = $('<option value="11">Film</option>');

formInput.append(sectionTrivia);
sectionTrivia.append(labelTrivia, inputTrivia, selectTrivia);
selectTrivia.append(optionChooseTrivia, optionOneTrivia, optionTwoTrivia, optionThreeTrivia, optionFourTrivia);


// events
var sectionEvents = $('<section>Events Search</section>');

var labelEvents = $('<label for="postal-code">');
var inputEvents = $('<input id="postal-code" type="number">');

var selectEvents = $('<select>Select a Category</select>');
var optionOneEvents = $('<option selected disabled>Choose:</option>');
var optionTwoEvents = $('<option value="theater">Theater</option>');
var optionThreeEvents = $('<option value="concert">Concert</option>');
var optionFourEvents = $('<option value="sports">Sports</option>');


formInput.append(sectionEvents);
sectionEvents.append(labelEvents, inputEvents, selectEvents);
selectEvents.append(optionOneEvents, optionTwoEvents, optionThreeEvents, optionFourEvents);


// select the output
var chooseOutput = $('<div id="output-selection">')
var headingDisplay = $('<h2>Choose:</h2>');

var onlyTriviaInput = $('<input>');
onlyTriviaInput.attr({
    type: 'radio',
    id: 'trivia-only',
    name: 'choose-output',
    value: 'trivia'
});
var onlyTriviaLabel = $('<label for="trivia-only">Trivia Only</label>');

var onlyEventsInput = $('<input>');
onlyEventsInput.attr({
    type: 'radio',
    id: 'events-only',
    name: 'choose-output',
    value: 'events'
});
var onlyEventsLabel = $('<label for="events-only">Events Only</label>');

var bothInput = $('<input>');
bothInput.attr({
    type: 'radio',
    id: 'trivia-events',
    name: 'choose-output',
    value: 'both-trivia-events'
});
var bothLabel = $('<label for="trivia-events">Both Trivia and Events</label>');

formInput.append(chooseOutput);
chooseOutput.append(headingDisplay, onlyTriviaInput, onlyTriviaLabel, onlyEventsInput, onlyEventsLabel, bothInput, bothLabel);


var submitButton = $('<button type="submit">Submit</button>');
formInput.append(submitButton);


function searchSubmit(event) {

    event.preventDefault();

    switch (true) {

        case (onlyTriviaInput.is(":checked")):
            if (!inputTrivia.val() || !selectTrivia.val()) {
                alert('Trivia: A search input is required!');
                return;
            } else {
                var urlQuery = './output.html?inputTrivia=' + inputTrivia.val() + '&categoryTrivia=' + selectTrivia.val();
                location.assign(urlQuery);
            }
            break;

        case (onlyEventsInput.is(":checked")):
            if (!inputEvents.val() || !selectEvents.val()) {
                alert('Events: A search input is required!');
                return;
            } else {
                var urlQuery = './output.html?inputEvents=' + inputEvents.val() + '&categoryEvents=' + selectEvents.val();
                location.assign(urlQuery);
            }
            break;

        default:
            if (!inputTrivia.val() || !selectTrivia.val() || !inputEvents.val() || !selectEvents.val()) {
                alert('A search input is required!');
                return;
            } else {
                var urlQuery = './output.html?inputTrivia=' + inputTrivia.val() + '&categoryTrivia=' + selectTrivia.val() + '&inputEvents=' + inputEvents.val() + '&categoryEvents=' + selectEvents.val();
                location.assign(urlQuery);
            }
            break;
    }
}

formInput.on('submit', searchSubmit);