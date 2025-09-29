const TIMEOUT = 200;
const DEFAULT_TEXT = "No ticket";

class TicketInfo {
    constructor(position, overlay, selector, copyAction) {
        this.position = position;
        this.overlay = overlay;
        this.selector = selector;
        this.copyAction = copyAction;
    }
}

const positionType = Object.freeze({
    APPEND: 'append',
    PREPEND: 'prepend',
});

const overlayType = Object.freeze({
    NONE: 'none',
    OVERLAY: 'overlay',
});

const ticketInfos = [
    new TicketInfo(positionType.PREPEND, overlayType.OVERLAY, "div._n7zlzgxb._bfhk1w7a._1e0c1txw._kqswh2mm._ca0qidpf._u5f3u2gc._n3tdidpf._19bvu2gc._80omtlke._1ragglyw._49cvfajl._9993fajl._1rcdfajl._1wp9fajl._9oik18uv._1bnxglyw._jf4cnqa1._irr3166n._1di61dty._4t3i1jfw._y7iw3acm",
        (container) => {
            let link = "";
            const openLink = container.querySelector("a.css-l44fgp");
            const closedLink = container.querySelector("a.css-wn3cj9");

            if (openLink) {
                link = openLink;
            } else if (closedLink) {
                link = closedLink;
            } else {
                return;
            }

            return link.innerText.trim();
        }),
    new TicketInfo(positionType.APPEND, overlayType.NONE, "ol._1e0c1txw._1n261g80._syaz1wmz._6rthze3t._1pfhze3t._12l2ze3t._ahbqze3t._85i5ze3t._1q51ze3t._y4tize3t._bozgze3t",
        (container) => {
            const spans = container.querySelectorAll("span.css-1gd7hga");
            if (!spans.length) {
                console.error("Target span not found!");
                return;
            }

            const lastSpan = spans[spans.length - 1];
            return lastSpan.innerText.trim();
        })
];

async function copyToClipboard(action) {
    let text = DEFAULT_TEXT;

    try {
        const result = action();
        text = result || DEFAULT_TEXT;
    } catch (err) {
        console.error("Error in copy action:", err);
    }

    try {
        navigator.clipboard.writeText(text);
    } catch (err) {
        console.error("Failed to copy text: ", err);
    }
}

function makeOverlay(button) {
    button.classList.add("jira-helper-overlay");
}

function createCopyButton(copyAction) {
    const button = document.createElement("button");
    button.className = "jira-helper-button";
    button.title = "Copy";

    const img = document.createElement("img");

    if (typeof browser !== "undefined" && browser.runtime && browser.runtime.getURL) {
        img.src = browser.runtime.getURL("copyImage.png");
    } else {
        img.src = "copyImage.png";
    }

    img.alt = "Copy";
    img.className = "jira-helper-icon";

    button.appendChild(img);
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        copyToClipboard(copyAction);
    });

    return button;
}

function findAndAddButtons() {
    ticketInfos.forEach(ticketInfo => {
        const elements = document.querySelectorAll(ticketInfo.selector);
        elements.forEach(element => {
            if (element.querySelector(".jira-helper-button")) {
                return;
            }

            const button = createCopyButton(() => ticketInfo.copyAction(element));
            let position = ticketInfo.position;
            if (position === positionType.APPEND) {
                element.appendChild(button);
            } else if (position === positionType.PREPEND) {
                element.prepend(button);
            }

            if (ticketInfo.overlay === overlayType.OVERLAY) {
                makeOverlay(button);
            }
        });
    });
}

(function observeMutations() {
    let debounceTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(findAndAddButtons, TIMEOUT);
    });
    observer.observe(document.body, {childList: true, subtree: true});

    window.addEventListener("beforeunload", () => {
        observer.disconnect();
    });
})();
