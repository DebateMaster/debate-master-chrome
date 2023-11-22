/* eslint-disable @typescript-eslint/no-unused-vars */
function replaceSelectionWithJoke(joke: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(joke));
    }
}

function highlightSelection(selection: Selection, range: Range, color: string) {
    if (!selection || !range) {
        console.log('Invalid input');
        return;
    }
  
    const span = document.createElement('span');
    span.style.backgroundColor = color;
  
    try {
        range.surroundContents(span);
    } catch(e) {
        console.log('Invalid range', e);
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

function mainNode() {
    const selection = window.getSelection();
    const text = selection?.toString();
    if (selection && text && text.length > 0) {
        fetchJoke();
    }
}

mainNode();