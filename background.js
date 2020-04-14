var activeStatus = {};
var eventStack = [];
chrome.extension.onConnect.addListener(function (port) {
    console.log("Connected .....", port);
    port.onMessage.addListener(function (msg) {
        try {
            msg = JSON.parse(msg);
        } catch (e) { }
        console.log("message recieved in back", msg);

        if (msg.hasOwnProperty('active')) {
            if (msg.active == false && msg.active != activeStatus.active) {
                eventStack = [];
            }
            activeStatus = msg;
        }
        activeStatus['eventStack'] = eventStack;
        port.postMessage(JSON.stringify(activeStatus));
    });
});

/**
 * when content js calls this listener is triggered.
 */
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    request.event.currentAction['timestamp'] = new Date();
    eventStack.push(request.event.currentAction);
});
