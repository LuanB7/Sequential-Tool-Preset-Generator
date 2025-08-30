function onConfirm(event) {
    console.log("Confirmado");

    if (event.type === "click" || (event.type === "keydown" && event.key === "Enter")) {
        console.log("Ok");

        let modal = document.querySelector(".new-tool-modal");

        let modalInputs = modal.querySelectorAll("input");

        if (modalInputs[0].value != '' && modalInputs[1].value != '' && modalInputs[2].value != '') {

            if (addTool(modalInputs[0].value, modalInputs[1].value, modalInputs[2].value, modalInputs[3].value)) {
                newToolModal();
            }

        } else {
            alert("Preencha os campos obrigratórios")
        }

    } else {
        console.log("Not Ok")
    }
}

function newToolModal(boolean, inputToFocus=0) {
    let modal = document.querySelector(".new-tool-modal");
    let blackBack = document.querySelector(".black-back");
    let confirmButton = modal.querySelector(".confirm-button")

    if (boolean) {

        let modalInputs = modal.querySelectorAll("input");
        modalInputs.forEach(element => {
            element.value = ''
        });

        modal.classList.add("visible");
        blackBack.classList.add("visible");

        confirmButton.addEventListener("click", onConfirm);
        document.addEventListener("keydown", onConfirm)

        setTimeout(()=>{
            modal.querySelectorAll("input")[inputToFocus].focus();
        }
        , 200);

        window.onkeydown = (event) => {
            if (event.key === "Escape") {
                newToolModal();
            }
        }


        
    } else {
        modal.classList.remove("visible");
        blackBack.classList.remove("visible");

        confirmButton.removeEventListener("click", onConfirm);
        document.removeEventListener("keydown", onConfirm)
    }



}

// --------------------------------------------------------------------------------------------------


function addTool(number, diameter, length, name) {
    let toolsContainer = document.querySelector(".tools");

    let newToolDiv = document.createElement("div");

    newToolDiv.setAttribute("class", "tool");

    newToolDiv.innerHTML = `
            <h2 class="tool-name" data-value="${name}">${name}</h2>
            <ul>
                <li>
                    <h3>Número da Ferramenta</h3>
                    <h4 class="tool-number" data-value="${number}">T${number}</h4>
                </li>

                <li>
                    <h3>Diâmetro</h3>
                    <h4 class="tool-diameter" data-value="${diameter}">${diameter}</h4>
                </li>

                <li>
                    <h3>Comprimento aprox.</h3>
                    <h4 class="tool-length" data-value="${length}">${length}</h4>
                </li>
            </ul>

            <div class="buttons">
                <button><i class="fa-solid fa-pencil"></i></button>
                <button onclick="removeTool(event)"><i class="fa-solid fa-xmark"></i></button>
            </div>
    `;


    toolsContainer.appendChild(newToolDiv);
    console.log(`Ferramenta "${name} | T${number} | ⌀ ${diameter} | Z ${length}" criada com sucesso.`)

    return true;
}

function removeTool(event) {
    const target = event.target;

    let toolContainerByChildren = target.closest(".tool");

    toolContainerByChildren.remove();


}
// Quick New Tool


function startQuickNewTool() {
    let allowedKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    window.addEventListener("keydown", (event)=> {

        const modal = document.querySelector(".new-tool-modal");
        const modalInputs = modal.querySelectorAll("input");

        if (!modal.classList.contains("visible")) {
            let keyNum = null;

            // Normal row (Digit1...Digit9)
            if (event.code.startsWith("Digit")) {
                keyNum = event.code.replace("Digit", "");
            }

            // Numpad (Numpad1...Numpad9)
            if (event.code.startsWith("Numpad")) {
                keyNum = event.code.replace("Numpad", "");
            }

            if (keyNum && allowedKeys.includes(keyNum)) {

                if (event.shiftKey) {
                    newToolModal(true, 2);
                    modalInputs[0].value = keyNum;
                    modalInputs[1].value = "0";
                    console.log("Shift");
                } else {
                    newToolModal(true, 1);
                    modalInputs[0].value = keyNum;
                }
            }
        }



    });


}

startQuickNewTool();

function startSelectForSelectedPattern() {
    let select = document.querySelector("#header-routine-pattern-select");

    let patternsStorage = localStorage.getItem("routinePatterns");

    if (patternsStorage) {
        
        let patternsStorageOBJ = JSON.parse(patternsStorage);

        patternsStorageOBJ.forEach(element => {
            
            let newOption = document.createElement("option");

            newOption.value = element.id;
            newOption.text = element.name;

            select.appendChild(newOption);
        });

        select.value = localStorage.getItem("selectedPattern");

        select.addEventListener("change", ()=> {
            localStorage.setItem("selectedPattern", select.value);
            notify(`Padrão de Rotina alterado para <span>${select.options[select.selectedIndex].text}</span>`, 2)
        })

    } else {
        select.style.display = "none";
    }
    
}

startSelectForSelectedPattern() ;