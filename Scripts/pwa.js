const btnInstall = document.querySelector("div.absolute button#add-button");

window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    btnInstall.style.display = "block";

    btnInstall.addEventListener("click", (e) => {
        // hide our user interface that shows our A2HS button
        btnInstall.style.display = "none";
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the A2HS prompt");
            } else {
                console.log("User dismissed the A2HS prompt");
            }
            deferredPrompt = null;
        });
    });
});

if (location.protocol === "https:" && window.isSecureContext) {
    addEventListener("load", e => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("serviceworker.js").then(registration => {
                addPwaInstall();
            })
                .catch(err => alert(`Error while installing: ${err}`));
        }
    });
}