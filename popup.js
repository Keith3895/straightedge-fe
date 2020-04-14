class popup {
    constructor() {
        this.port = chrome.extension.connect({
            name: "Sample Communication"
        });
        chrome.windows.getCurrent((w) => {
            chrome.tabs.getSelected(w.id,
                (response) => {
                    this.currentURL = response.url;
                    this.startCommunications();
                    document.querySelector('#play').addEventListener('click', () => {
                        this.port.postMessage(JSON.stringify({ active: true }));
                    });
                    document.querySelector('#stop').addEventListener('click', () => {
                        this.port.postMessage(JSON.stringify({ "active": false }));
                    });
                });
        });
    }

    showTimeLine = (eventStack) => {
        document.querySelector('#homeView').style.display = 'none';
        document.querySelector('#timelineParent').style.display = 'block';
        document.querySelector('ul.timeline').innerHTML = eventStack.map(el => {
            return `
            <li>
                <div class="direction-r">
                    <div class="flag-wrapper">
                        <span class="flag">${el.action}</span>
                        <span class="time-wrapper"><span class="time">${new Date(el.timestamp).toLocaleString()}</span></span>
                    </div>
                    <div class="desc">${el.path}</div>
                </div>
            </li>
            `;
        });
    }
    showHome = () => {
        document.querySelector('#homeView').style.display = 'block';
        document.querySelector('#timelineParent').style.display = 'none';
        document.querySelector('#currentURL').textContent = this.currentURL;
    }
    startCommunications = () => {

        this.port.onMessage.addListener(this._communicationListener);
        this.port.postMessage("get Status");
    }
    _communicationListener = (msg) => {
        try {
            msg = JSON.parse(msg);
        } catch (e) { }
        console.log("message recieved" + msg);
        if (msg.active) {
            this.showTimeLine(msg.eventStack);
        } else {
            this.showHome();
        }
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, msg);
        });
    }
}





(new popup());
