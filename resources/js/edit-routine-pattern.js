document.addEventListener("DOMContentLoaded", (e)=> {
    let urlParams = new URLSearchParams(window.location.search);

    console.log(urlParams.get("action"));
    if (urlParams.get("action") == "edit" && urlParams.get("patternid")) {
        
        let patternsStorage = localStorage.getItem("routinePatterns");
        let patternsStorageOBJ = JSON.parse(patternsStorage);
        
        let itemToEdit = patternsStorageOBJ.find(element => element.id == urlParams.get("patternid"));
        console.log (itemToEdit);

        if (itemToEdit) {

            let InputName = document.querySelector("#input-name");
            let InputHeader = document.querySelector("#input-header");
            let InputRoutine = document.querySelector("#input-routine");
            let InputFooter = document.querySelector("#input-footer");
            let InputImageRadios = document.querySelectorAll("input[name='image-select-radio']");
            let InputFileName = document.querySelector("#input-file-name");
            let SelectFileExtension = document.querySelector("#select-file-extension");
            

            InputName.innerText = itemToEdit.name;
            InputHeader.innerText = itemToEdit.header;
            InputRoutine.innerText = itemToEdit.routine;
            InputFooter.innerText = itemToEdit.footer;
            InputFileName.value = itemToEdit.file_name;
            SelectFileExtension.value = itemToEdit.file_extension;


            InputImageRadios.forEach(element => {
                
                element.checked = (element.value == itemToEdit.image_file_name);

                if (element.checked) {
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                }
                console.log(itemToEdit.image_file_name);
            });

            
            console.log("foi 1");

        } else {
            alert("Edição impossível: Padrão de Rotina não encontrado.")
            
        }
    }

    // Highlight PArameters in Textareas
    highlightAllParametersOnLoadPage();

    console.log("foi f");
})

function startImageRadioSelectContainer() {
    let labelsContainer = document.querySelector(".radio-select-container").querySelector(".labels");
    let labels = labelsContainer.querySelectorAll("label");
    let radios = labelsContainer.querySelectorAll("input[type='radio']");

    radios.forEach((element, radioIndex) => {
        element.addEventListener("change", (radio)=> {
            labels.forEach(label => {
                label.classList.remove("selected");
            });

            labels[radioIndex].classList.add("selected");

        })

    });

}

startImageRadioSelectContainer();

async function confirmFormButton() {
    let InputNameValue = document.querySelector("#input-name").innerText;
    let InputHeaderValue = document.querySelector("#input-header").innerText;
    let InputRoutineValue = document.querySelector("#input-routine").innerText;
    let InputFooterValue = document.querySelector("#input-footer").innerText;
    let InputImageValue = document.querySelector("input[name='image-select-radio']:checked").value;
    let InputFileNameValue = document.querySelector("#input-file-name").value;
    let SelectFileExtensionValue = document.querySelector("#select-file-extension").value;

    //console.log(InputNameValue, InputHeaderValue, InputRoutineValue, InputFooterValue, InputImageValue)

    let urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("action") == "new") {
        newPattern(InputNameValue, InputHeaderValue, InputRoutineValue, InputFooterValue, InputFileNameValue, SelectFileExtensionValue, InputImageValue);
        alert("Sucesso ao criar Padrão de Rotina.");
        window.location.href = "routine-pattern.html";

    } else if (urlParams.get("action") == "edit") {

        let confirmation = await confirmationModal("Confirmar Edição?", "Confirmar Edição no Padrão de Rotina?\nEssa alteração é irreversível.", "Sim, confirmar");

        if (confirmation) {
            editPattern(urlParams.get("patternid"), InputNameValue, InputHeaderValue, InputRoutineValue, InputFooterValue, InputFileNameValue, SelectFileExtensionValue, InputImageValue);
            alert("Sucesso ao editar Padrão de Rotina.");
            window.location.href = "routine-pattern.html";
        }

    }
}

// Color Formatting of Parameters In Inputs

function getCaretIndex(root) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return 0;
    const range = sel.getRangeAt(0);

    // cria um range do início até o cursor
    const preRange = document.createRange();
    preRange.selectNodeContents(root);
    preRange.setEnd(range.startContainer, range.startOffset);

    return preRange.toString().length; // comprimento do texto até o caret
}

function setCaretIndex(root, index) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let remaining = index;

    while ((node = walker.nextNode())) {
        const len = node.nodeValue.length;
        if (remaining <= len) {
            const range = document.createRange();
            range.setStart(node, remaining);
            range.collapse(true);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            return;
        }
        remaining -= len;
    }

    // fallback: coloca no final
    const range = document.createRange();
    range.selectNodeContents(root);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function highlightParameters(target) {
    let textarea = target;

    
    // salva índice global do cursor
    const caretIndex = getCaretIndex(textarea);

    let textValue = textarea.innerText;

    let parameters = ["tool-name", "tool-number", "tool-diameter", "tool-length"];

    let highlightedText = textValue.replace(new RegExp(`\\b(${parameters.join("|")})\\b`, "gi"), "<span>$1</span>");

    textarea.innerHTML = highlightedText;

    textarea.setAttribute("content", textarea.innerText)
    console.log("Content: ", textarea.getAttribute("content"));

    // restaura posição do cursor
    setCaretIndex(textarea, caretIndex);

}

function highlightAllParametersOnLoadPage() {
    let textareas = document.querySelectorAll(".highlighting-textarea");

    textareas.forEach(element => {
        highlightParameters(element);
    });
}


// Storage Management

function newPattern(patternName, patternHeader, patternRoutine, patternFooter, patternFileName, patternFIleExtension, patternImageFileName) {
    let patternsStorage = localStorage.getItem("routinePatterns");

    let routinePatternID = patternName.replace(/\s+/g, '').toLowerCase();

    let newRoutinePattern = {
        name: `${patternName}`,
        header: `${patternHeader}`,
        routine: `${patternRoutine}`,
        footer: `${patternFooter}`,
        file_name: `${patternFileName}`,
        file_extension: `${patternFIleExtension}`,
        image_file_name: `${patternImageFileName}`,
        id: `${routinePatternID}`
    }

    let patternsToSave;

    if (patternsStorage) {
        let patternsStorageOBJ = JSON.parse(patternsStorage);
        patternsStorageOBJ.push(newRoutinePattern);

        patternsToSave = patternsStorageOBJ;

    } else {
        patternsToSave = [newRoutinePattern];
    }

    localStorage.setItem("routinePatterns", JSON.stringify(patternsToSave));
    localStorage.setItem("selectedPattern", routinePatternID);
}

function editPattern(patternID, patternName, patternHeader, patternRoutine, patternFooter, patternFileName, patternFIleExtension, patternImageFileName) {
    let patternsStorage = localStorage.getItem("routinePatterns");

    let patternsStorageOBJ = JSON.parse(patternsStorage);
    
    let itemToEdit = patternsStorageOBJ.find(element => element.id == patternID);


    if (itemToEdit) {
        itemToEdit.name = `${patternName}`,
        itemToEdit.header = `${patternHeader}`,
        itemToEdit.routine = `${patternRoutine}`,
        itemToEdit.footer = `${patternFooter}`,
        itemToEdit.file_name = `${patternFileName}`,
        itemToEdit.file_extension = `${patternFIleExtension}`,
        itemToEdit.image_file_name = `${patternImageFileName}`,
        itemToEdit.id = `${patternID}`
    }

    localStorage.setItem("routinePatterns", JSON.stringify(patternsStorageOBJ));
}

// Tool Parameters Modal

function toolParametersModal(bool) {
    let modal = document.querySelector(".tool-parameters-modal");
    let blackBack = document.querySelector(".black-back");

    if (bool) {
        modal.classList.add("visible");
        blackBack.classList.add("visible");

        let parametersLi = modal.querySelector("ul").querySelectorAll("li");

        parametersLi.forEach(element => {
            element.onclick = async (event)=> {
                try {
                    await navigator.clipboard.writeText(element.getAttribute("copy-value"));
                    notify("Parâmetro copiado para a área de transferência.");
                    
                } catch(err) {
                    notify("<span>Erro:</span> Falha ao tentar copiar.");
                }
            }
        });

    } else {
        modal.classList.remove("visible");
        blackBack.classList.remove("visible");
    }


}
