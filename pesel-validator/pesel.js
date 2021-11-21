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

var inputs = document.getElementById("main");
var yearInput = DOMHelper.addElementWithClass(inputs, "input", ["small"], "Rok");
var monthInput = DOMHelper.addElementWithClass(inputs, "input", ["small"], "Miesiąc");
var dayInput = DOMHelper.addElementWithClass(inputs, "input", ["small"], "Dzień");
var extraInput = DOMHelper.addElementWithClass(inputs, "input", ["long"], "Pozostałe 5 cyfr");

var buttons = document.getElementById("main");
var validateButton = DOMHelper.addElementWithClass(buttons, "button", null, "Validate PESEL");
var showAllButton = DOMHelper.addElementWithClass(buttons, "button", null, "Show all");
var findValidButton = DOMHelper.addElementWithClass(buttons, "button", null, "Find valid PESEL");

if (window.Worker) {
    const validateWorker = new Worker("validate_one_pesel.js");
    // validateButton.addEventListener("click", validateWorker.postMessage([yearInput.val(), monthInput.val(), dayInput.val(), extraInput.val()]));
} else {
    console.log("Brower does not support Workers");
}
