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

function sendSentenceRequest(sentence: string) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    };

    const encodedText = encodeURIComponent(sentence);
    const url = `http://34.85.198.249:12023/text_predict?text=${encodedText}`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Accept", "text/plain");
    xhr.send();
}

function selectionToSentences(selection: Selection): string[] {
    const range = selection.getRangeAt(0);
    const text = range.toString();
    return text
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s + '.');
}

function getTextNodes(range: Range) {  
    const nodeList: Node[] = [];
    // Iterate over all the child nodes in the document fragment
    const iterateChildNodes = (node: Node) => {
        node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                nodeList.push(child);
            }
            if (child.hasChildNodes()) {
                iterateChildNodes(child);
            }
        });
    };

    iterateChildNodes(range.extractContents());

    return nodeList;
}

function getSubstringOffsetInString(string: string, substring: string): number {
    const index = string.indexOf(substring);
    if (index >= 0) {
        return index;
    }
    return 0;
}

function randomBool() {
    return Math.random() < 0.5;
}

function checkSentence(sentence: string): boolean {
    sendSentenceRequest(sentence);
    return randomBool();
}

function highlightSentence(selection: Selection, sentence: string, text: string) {
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    if (startContainer !== endContainer) {
        console.log('Invalid selection');
        return;
    }
    const startOffset = range.startOffset;
    const sentenceOffset = getSubstringOffsetInString(text, sentence);
    
    const newStartOffset = startOffset + sentenceOffset;
    const newEndOffset = newStartOffset + sentence.length;

    range.setStart(startContainer, newStartOffset);
    range.setEnd(startContainer, newEndOffset);
    
    highlightSelection(selection, range, 'yellow');
}

function mainNode() {
    const selection = window.getSelection();
    const text = selection?.toString();
    if (selection && text && text.length > 0) {
        const sentences = selectionToSentences(selection);

        for (const sentence of sentences) {
            if (checkSentence(sentence)) {
                highlightSentence(selection, sentence, text);
            }
        }
    }
}

mainNode();