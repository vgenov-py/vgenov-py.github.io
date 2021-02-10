//MADE BY VITO GENOVESE
//GITHUB: https://github.com/vgenov-py/

const numToGuess = () => {
    const makeARandom = document.querySelector("#makeARandom");
    const numberStatus = document.querySelector("#numberStatus");
    const instructions = document.querySelector("#instructionsButton");
    const instructionsSection = document.querySelector("#instructionsSection");
    const game = document.querySelector("#game");
    const pc = document.querySelector("#numToGuess");
    let array = "";
    const random = () => Math.ceil(Math.random() * 9).toString();
    for (let i = 0; i <= 3;) {
        let r = random();
        if (!array.includes(r)) {
            array = array + r;
            i++;
        }
    }
    return (
        (pc.value = array),
        (numberStatus.innerText = "¡Número creado!"),
        (makeARandom.style.display = "none"),
        (game.style.display = ""),
        (instructions.style.display = "none"),
        (instructionsSection.style.display = "none")
    );
};

const makeARandom = document.querySelector("#makeARandom");
makeARandom.addEventListener("click", numToGuess);

const showInstructions = () => {
    const instructionsSection = document.querySelector("#instructionsSection");
    instructionsSection.style.display = "";
};

const instructions = document.querySelector("#instructionsButton");
instructions.addEventListener("click", showInstructions);

const guess = () => {
    document.querySelector("#numberStatus").innerText = "";
    const pc = [...document.querySelector("#numToGuess").value];
    const user = document.querySelector("#user").value;
    let array = [...user];

    const winMessage = document.querySelector("#winMessage");
    const times = parseInt(winMessage.innerText) + 1;

    //Guessing part:
    let exacts = 0;
    let missPlace = 0;
    let count = 0;
    let passed = false;
    //LIST PREPEND:
    const list = document.querySelector("#list");
    //^^^^^

    const find = (array) => {
        array.forEach((num) => {
            if (array.includes(num, array.indexOf(num) + 1)) {
                passed = true;
            }
        });
        return passed;
    };
    find(array);
    if (array.includes("0")) {
        alert("¡No puedes incluir 0!");
    } else if (array.length < 4 || array.length > 4) {
        alert("¡El número debe ser de 4 cifras!");
    } else if (passed) {
        alert("¡No puedes repetir cifras!");
    } else {
        array.forEach((n) => {
            if (n === pc[count]) {
                exacts++;
            } else if (pc.includes(n)) {
                missPlace++;
            }
            count++;
        });

        winMessage.innerText = times;
        document.querySelector("#user").value = "";
        if (exacts === 4) {
            winMessage.style.display = "";

            winMessage.innerText = `¡Has ganado en ${times} intentos!`;
            document.querySelector("#game").style.display = "none";
        }
        const li = document.createElement("li");
        li.innerText = `${user} ${missPlace}M & ${exacts}E`;
        list.prepend(li);
    }
};
const user = document.querySelector("#user");
user.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.code === "Enter") {
        return guess();
    }
});