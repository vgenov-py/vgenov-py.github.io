const numToGuess = () => {
    const makeARandom = document.querySelector("#makeARandom");
    const numberStatus = document.querySelector("#numberStatus");
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
        (numberStatus.innerText = "Number Created!"),
        (makeARandom.style.display = "none")
    );
};

const makeARandom = document.querySelector("#makeARandom");
makeARandom.addEventListener("click", numToGuess);

// function guess() {
//     let exacts = 0;
//     let missPlace = 0;
//     let count = 0;
//     user.forEach((n) => {
//         if (n === guess[count]) {
//             exacts++;
//         } else if (guess.includes(n)) {
//             missPlace++;
//         }
//         count++;
//     });
//     console.log(`${missPlace}M & ${exacts}E`);
// }

const guess = () => {
    const pc = [...document.querySelector("#numToGuess").value];
    const user = document.querySelector("#user").value;
    let array = [...user];

    //Guessing part:
    let exacts = 0;
    let missPlace = 0;
    let count = 0;
    //LIST PREPEND:
    const list = document.querySelector("#list");
    //^^^^^
    array.forEach((n) => {
        if (n === pc[count]) {
            exacts++;
        } else if (pc.includes(n)) {
            missPlace++;
        }
        count++;
    });
    const li = document.createElement("li");
    li.innerText = `${user} ${missPlace}M & ${exacts}E`;
    list.prepend(li);
};
const user = document.querySelector("#user");
user.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.code === "Enter") {
        return guess();
    }
});