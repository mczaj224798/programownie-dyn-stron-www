class DOMHelper {
    static addElementWithClass(parent, element, cl, tag) {
        let box = document.createElement(element);
        if (cl !== null) {
            cl.forEach(cls => { box.classList.add(cls); })
            if (tag !== null) {
                box.innerHTML = tag;
            }
        }
        parent.appendChild(box);
        return box;
    }
}

const inputs = document.getElementById("main");
const yearInput = DOMHelper.addElementWithClass(inputs, "input", ["small"], "Rok");
const monthInput = DOMHelper.addElementWithClass(inputs, "input", ["small"], "Miesiąc");
const dayInput = DOMHelper.addElementWithClass(inputs, "input", ["small"], "Dzień");
const extraInput = DOMHelper.addElementWithClass(inputs, "input", ["long"], "Pozostałe 5 cyfr");

const buttons = document.getElementById("main");
const validateButton = DOMHelper.addElementWithClass(buttons, "button", null, "Validate PESEL");
const showAllButton = DOMHelper.addElementWithClass(buttons, "button", null, "Show all");
const findValidButton = DOMHelper.addElementWithClass(buttons, "button", null, "Find valid PESEL");

const box = document.getElementById("box");


if (window.Worker) {
    const validateWorker = new Worker("validate_one_pesel.js");
    validateButton.addEventListener("click", e => {
        validateWorker.postMessage([yearInput.value, monthInput.value, dayInput.value, extraInput.value])
    });
    validateWorker.onmessage = e=> {
        console.log("Main script: got result from validate_one_pesel worker")
        console.log(e)
        if (!e.data) {
            window.alert("Invalid PESEL")
        }
    };
    const showAllWorker = new Worker("show_all_pesels.js");
    showAllButton.addEventListener("click", e => {
        showAllWorker.postMessage([yearInput.value, monthInput.value, dayInput.value])
    });
    showAllWorker.onmessage = e=> {
        console.log("Main script: got result from show_all_pesels worker")
        console.log(e.data)
        if (e.data !== false) {
            let showAllString = "";
            e.data.forEach(str => {
                showAllString += str + "<br>";
            })

            box.innerHTML = showAllString;
        }
    };

} else {
    console.log("Browser does not support Workers");
}
