/* eslint-disable @typescript-eslint/no-unused-vars */
function replaceSelectionWithJoke(joke: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(joke));
    }
}

function fetchJoke() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            replaceSelectionWithJoke(xhr.responseText);
        }
    };
    xhr.open("GET", "https://icanhazdadjoke.com/", true);
    xhr.setRequestHeader("Accept", "text/plain");
    xhr.send();
}

document.addEventListener('mouseup', function(_event) {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 0) {
        fetchJoke();
    }
});