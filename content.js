console.log("content Connected .....", straightedgefe);
chrome.runtime.onConnect.addListener(function (port) {
    console.log(port);
    port.onMessage.addListener(function (msg) {
        console.log('message in content :', msg);
    });
});
chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log(sender);
    try {
        msg = JSON.parse(msg);
    } catch (e) { }
    console.log("message recieved in back", msg);
    if (msg.active == true) {
        straightedgefe.run(window, (e) => {
            console.log(e);
            chrome.extension.sendMessage({ message: 'Content is pushing', event: e });
        });
    } else if (msg.active == false) {
        straightedgefe.stop();
    }
});