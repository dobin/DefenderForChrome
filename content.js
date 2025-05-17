document.addEventListener('copy', function (event) {
    const selection = document.getSelection();
    const copiedText = selection ? selection.toString() : "";

    // Async data access yay
    chrome.storage.local.get('clipboardBlacklist', (result) => {
        const blacklist = result.clipboardBlacklist || [];
        const isBlocked = blacklist.some(word => copiedText.toLowerCase().includes(word.toLowerCase()));

        if (isBlocked) {
            event.preventDefault();
            event.clipboardData.setData('text/plain', 'Copying forbidden content is not allowed.');
            console.log("Blocked forbidden clipboard content");

            chrome.runtime.sendMessage({
                type: "show_notification",
                title: "Clipboard Blocked",
                message: "Copying forbidden content is not allowed."
            });
        } else {
            console.log("Allowed clipboard content.");
        }
    });
});
