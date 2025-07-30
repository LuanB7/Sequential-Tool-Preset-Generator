// --------------------------------------------------------------------------------------------------

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

function newToolModal(boolean) {
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
            modal.querySelectorAll("input")[0].focus();
        }
        , 200);


        
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