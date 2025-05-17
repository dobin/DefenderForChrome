

chrome.runtime.onInstalled.addListener(() => {
    fetch(chrome.runtime.getURL("file-whitelist.json"))
        .then(r => r.json())
        .then(data => chrome.storage.local.set({ fileWhitelist: data }));

    fetch(chrome.runtime.getURL("clipboard-blacklist.json"))
        .then(r => r.json())
        .then(data => chrome.storage.local.set({ clipboardBlacklist: data }));
});


// File download blocking
chrome.downloads.onCreated.addListener(function (downloadItem) {
    const url = downloadItem.finalUrl || downloadItem.url;
    const filename = downloadItem.filename || url.split("/").pop().split("?")[0];

    // Lets do it async yay love javascript
    chrome.storage.local.get('fileWhitelist', (result) => {
        const allowedExtensions = result.fileWhitelist;
        const isAllowed = allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext.toLowerCase()));

        if (!isAllowed) {
            console.log(`Blocked download: ${filename}`);

            // Cancel the download - no file for you
            chrome.downloads.cancel(downloadItem.id, () => {
                console.log("Download canceled.");
            });

            // Optionally erase the canceled download record
            chrome.downloads.erase({ id: downloadItem.id });

            // Notify the user about the blocked download
            chrome.notifications.create({
                type: "basic",
                iconUrl: "warning-icon.png",
                title: "Blocked Download",
                message: "The file type you are trying to download is not allowed.",
                priority: 2
            });
        } else {
            // Auditing purposes
            console.log(`Allowed download: ${filename}`);
        }
    });
});


// Clipboard blocking notification
// Called from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "show_notification") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "warning-icon.png",
            title: request.title,
            message: request.message,
            priority: 2
        });
    }
});