const btnInstall = document.querySelector("button#install_app");
const appInfo = document.querySelector("div#install_app_info");

function addPwaInstall() {
    window.addEventListener("beforeinstallprompt", e => {
        btnInstall.style.display = "block";
        appInfo.style.display = "block";
        btnInstall.addEventListener("click", clickEvent => {
            e.prompt();
            e.userChoice.then(choice => {
                if (choice.outcome === "accepted") {
                    console.log("installed");
                }
            });
        });
    });
}

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