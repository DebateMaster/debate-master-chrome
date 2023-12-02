function createPopupHtml(prediction: boolean, category: string): string {
    return `
        <div id="my-extension-popup" style="position:fixed; bottom: 20px; right: 20px; width: 300px; z-index: 99999; background: #f9f7f5; border-radius: 20px; border: none; padding: 10px;">
            <div id="popup-container" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                <div id="status-icon-and-text-container" style="display: flex; flex-direction: row; justify-content: center; align-items: center; margin-bottom: 20px;">
                    <div id="my-extension-status-icon" style="color: ${ prediction ? "#d9534f" : "#33ab5f" }; font-size: 30px; float: left; margin-right: 10px;">
                        ${ prediction ? "&#10539;" : "&check;" }
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: black;" id="my-extension-contains-fallacy">
                        ${prediction ? 'Fallacy Detected' : 'No Fallacies Detected'}
                    </div>
                </div>
                <div id="fallacy-category-container" style="display: flex; flex-direction: row; justify-content: center; align-items: center; margin-bottom: 20px;">
                    ${ prediction ? `<div id="my-extension-fallacy-category" style="color: #555;">Category: ${category}</div>` : ""}
                </div>
                <div id="close-button-container" style="display: flex; flex-direction: row; justify-content: right;">
                    <button id="my-extension-close-btn" style="background: ${ prediction ? "#d9534f" : "#33ab5f" }; color: #fff; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">Close</button>
                </div>
            </div>
        </div>
    `;
}

function showPopup(prediction: boolean, category: string) {
    const existingPopup = document.getElementById("my-extension-popup");
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create the popup
    const popupHtml = createPopupHtml(prediction, category);
    document.body.insertAdjacentHTML("beforeend", popupHtml);

    // Add event listener to the 'Close' button
    document.getElementById("my-extension-close-btn")?.addEventListener('click', () => {
        document.getElementById("my-extension-popup")?.remove();
    });
}

function sendSentenceRequest(sentence: string) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            const category = response['category'];
            const prediction = response['prediction'];
            showPopup(prediction, category);
        }
    };

    const encodedText = encodeURIComponent(sentence);
    const baseUrl = "https://strangers.pub";
    const url = `${baseUrl}/text_predict?text=${encodedText}`;
    xhr.open("GET", url, true);
    xhr.send();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function selectionToSentences(selection: Selection): string[] {
    const range = selection.getRangeAt(0);
    const text = range.toString();
    return text
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s + '.');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

function mainNode() {
    const selection = window.getSelection();
    const text = selection?.toString();
    if (selection && text && text.length > 0) {
        sendSentenceRequest(text);
    }
}

mainNode();