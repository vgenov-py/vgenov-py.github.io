window.location.replace("https://www.deamadrid.com/sdc");
const whatShouldBe = document.querySelector("#whatShouldBe");
const getData = () => {
    const date1 = document.querySelector("#date1");
    const date2 = document.querySelector("#date2");
    const visit1 = new Date(date1.value);
    const visit2 = new Date(date2.value);
    const diffOnDays = (visit2 - visit1) / (1000 * 60 * 60 * 24);
    console.log("diffOnDays:", diffOnDays);

    const pillsPerDay = parseInt(document.querySelector("#PPD").value);
    const pillsPerKit = parseInt(document.querySelector("#PPK").value);
    const kitsPerPatient = parseInt(document.querySelector("#KPP").value);
    const medicationSupplyOnDays = (pillsPerKit * kitsPerPatient) / pillsPerDay;
    const pillsToReturn = (medicationSupplyOnDays - diffOnDays) * pillsPerDay;
    const result = document.querySelector("#result");
    console.log("pillsToReturn: ", pillsToReturn);
    const pillsReturned = parseInt(
        document.querySelector("#pillsReturned").value
    );
    console.log(pillsReturned);
    const adherenceField = document.querySelector("#adherence");
    let adherence = 0;
    const pillsToTake = pillsPerDay * diffOnDays;
    const PillsTaken = kitsPerPatient * pillsPerKit - pillsReturned;
    adherence = (PillsTaken * 100) / pillsToTake;

    const daysWithoutMedicationField = document.querySelector(
        "#daysWithoutMedicationField"
    );
    const daysWithoutMedication = (pillsToTake - PillsTaken) / pillsPerDay;

    const visitsDifference = document.querySelector("#visitsDifference");

    return (
        (result.innerText = pillsToReturn),
        ((adherenceField.innerText = `${adherence.toFixed(2)}%`),
            (daysWithoutMedicationField.innerText = daysWithoutMedication)),
        (visitsDifference.innerText = diffOnDays)
    );
};

whatShouldBe.addEventListener("click", getData);
