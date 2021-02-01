const button = document.querySelector("button");
const getDays = () => {
    const date1 = document.querySelector("#date1");
    const date2 = document.querySelector("#date2");
    const text = document.querySelector("#text");
    const date1value = new Date(date1.value);
    const date2value = new Date(date2.value);
    const diff = (date2value - date1value) / (1000 * 24 * 60 * 60);
    return (text.value = diff);
};
button.addEventListener("click", getDays);