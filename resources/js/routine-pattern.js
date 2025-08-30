function startSelectPatternChanger() {
    let labelsContainer = document.querySelector(".patterns");
    let labels = labelsContainer.querySelectorAll(".pattern");

    function chooseNewSequenceButtonText() {
        let patternsStorage = localStorage.getItem("routinePatterns");
        let patternsStorageOBJ = JSON.parse(patternsStorage);

        patternsStorageOBJ.forEach(element => {
            if (localStorage.getItem("selectedPattern")) {
                if (localStorage.getItem("selectedPattern") == element.id) {

                    let newSequenceButton = document.querySelector(".new-sequence-button");
                    newSequenceButton.innerHTML = `<i class="fa-solid fa-forward"></i> Nova Sequência para ${element.name.toUpperCase()}`;
                }
            }
        });
    }
    
    labels.forEach(clickedLabel => {
        clickedLabel.addEventListener("click", ()=> {
            labels.forEach(label => {
                label.classList.remove('selected');
            });

            if (!clickedLabel.classList.contains("oncontextmenu")) {
                clickedLabel.classList.add("selected");
                //alert(clickedLabel.getAttribute("patternid"));

                localStorage.setItem("selectedPattern", clickedLabel.getAttribute("patternid"));
                console.log(localStorage.getItem("selectedPattern"));
                chooseNewSequenceButtonText();
            }
           

        })
    });

    chooseNewSequenceButtonText();
}

startSelectPatternChanger();


function loadRoutinePatterns() {
    let labelsContainer = document.querySelector(".patterns");

    let patternsStorage = localStorage.getItem("routinePatterns");

    labelsContainer.innerHTML = "";

    if(patternsStorage) {
        let patternsStorageOBJ = JSON.parse(patternsStorage);

        patternsStorageOBJ.forEach(element => {
            let newLabel = document.createElement("div");
            
            newLabel.setAttribute("class", "pattern");
            newLabel.setAttribute("patternid", element.id);
            newLabel.setAttribute("oncontextmenu", "patternContextMenu(event)")

            if (localStorage.getItem("selectedPattern") == element.id) {
                newLabel.classList.add("selected");
            }

            newLabel.innerHTML = `
                <div class="checkbox"><i class="fa-solid fa-check"></i></div>

                <img src="resources/images/Machines/${element.image_file_name}" alt="">

                <div class="text">
                    <h2>${element.name}</h2>
                    <h3>.${element.file_extension}</h3>
                </div>

                <div class="contextmenu">
                    <button onclick="window.location.href = 'edit-routine-pattern.html?action=edit&patternid=${element.id}'"><i class="fa-solid fa-pencil"></i>Editar</button>
                    <button onclick="deletePattern('${element.id}')"><i class="fa-solid fa-trash-can"></i>Excluir</button>
                </div>
            
            `;

            labelsContainer.appendChild(newLabel);
        });

        startSelectPatternChanger();

    }
}

loadRoutinePatterns();



// Context Menu

function patternContextMenu(event) {

    let allLabels = document.querySelector(".patterns").querySelectorAll(".pattern");

    allLabels.forEach(element => {
        element.classList.remove("oncontextmenu");
    });

    let contextmenu = event.target.querySelector(".contextmenu");

    event.preventDefault();
    event.target.classList.add("oncontextmenu");

    document.onclick = (ev) => {
        if (!contextmenu.contains(ev.target)) {
            
            let allLabels = document.querySelectorAll(".pattern");

            allLabels.forEach(element => {
                element.classList.remove("oncontextmenu");
            });

            //event.target.classList.remove("oncontextmenu");
        }
    }

}


async function deletePattern(patternID) {

    let patternsStorage = localStorage.getItem("routinePatterns");

    let patternsStorageOBJ = JSON.parse(patternsStorage);

    // Referência ao Elemento somente para pegar nome
    let itemToDelete = patternsStorageOBJ.find(element => element.id == patternID);

    

    let confirmation = await confirmationModal("Excluir Padrão de Rotina?", `Tem certeza de que deseja excluir permanentemente o Padrão de Rotina <span>${itemToDelete.name}</span>?`, "Sim, confirmar exclusão");

    if (confirmation) {
        let newPatternsStorageOBJ = patternsStorageOBJ.filter(element => element.id !== patternID);

        localStorage.setItem("routinePatterns", JSON.stringify(newPatternsStorageOBJ));

        console.log(patternID, " excluido.");
        notify(`O padrão de rotina <span>${itemToDelete.name}</span> foi excluído.`, 4);

        loadRoutinePatterns();
    }

}