var onlyTriviaInput = $('#trivia-only');
var inputTrivia = $('#input-trivia');
var selectTrivia = $('#trivia-select');

var onlyEventsInput = $('#events-only');
var inputEvents = $('#postal-code');
var selectEvents = $('#events-select');
var formInput = $('#form-submit');
var requiredInput = $('#input-required');

function searchSubmit(event) {

    event.preventDefault();

    switch (true) {

        case (onlyTriviaInput.is(":checked")):
            if (!inputTrivia.val() || !selectTrivia.val()) {
                requiredInput.text('Trivia: Search inputs are required!');
                return;
            } else {
                var urlQuery = './output.html?inputTrivia=' + inputTrivia.val() + '&categoryTrivia=' + selectTrivia.val();
                location.assign(urlQuery);
            }
            break;

        case (onlyEventsInput.is(":checked")):
            if (!inputEvents.val() || !selectEvents.val()) {
                requiredInput.text('Events: Search inputs are required!');
                return;
            } else {
                var urlQuery = './output.html?inputEvents=' + inputEvents.val() + '&categoryEvents=' + selectEvents.val();
                location.assign(urlQuery);
            }
            break;

        default:
            if (!inputTrivia.val() || !selectTrivia.val() || !inputEvents.val() || !selectEvents.val()) {
                requiredInput.text('Trivia and Events: Search inputs are required!');
                return;
            } else {
                var urlQuery = './output.html?inputTrivia=' + inputTrivia.val() + '&categoryTrivia=' + selectTrivia.val() + '&inputEvents=' + inputEvents.val() + '&categoryEvents=' + selectEvents.val();
                location.assign(urlQuery);
            }
            break;
    }
}

formInput.on('submit', searchSubmit);