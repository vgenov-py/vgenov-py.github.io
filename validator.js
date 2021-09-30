const KEY = "1234";
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if (params.key != KEY) {
    const body = document.querySelector("body");
    body.innerHTML = "";
}
