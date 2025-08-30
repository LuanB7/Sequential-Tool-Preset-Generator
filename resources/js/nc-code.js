function ncCodeModal(boolean, code) {
    let modal = document.querySelector(".nc-code-modal");
    let blackBack = document.querySelector(".black-back");
    let codeDOM = modal.querySelector(".code");

    //let confirmButton = modal.querySelector(".confirm-button")

    if (boolean) { 

        codeDOM.innerHTML = code;
        modal.classList.add("visible");
        blackBack.classList.add("visible");
        
    } else {
        codeDOM.innerHTML = '';
        modal.classList.remove("visible");
        blackBack.classList.remove("visible");

    }

}

function replaceToolParameters(text, element) {


    let replaceParametersFor = {
        "tool-name": element.t_name,
        "tool-number": element.t_number,
        "tool-diameter": element.t_diameter,
        "tool-length": element.t_length,
    }

    const formatedParametersForRegex = Object.keys(replaceParametersFor).join("|");
    const regex = new RegExp(`(?<!\\w)(${formatedParametersForRegex})(?!\\w)`, "g");

    const replacedText = text.replace(regex, (match)=> {
        const value = replaceParametersFor[match];

        if (value !== undefined) {
            return value;
        } else {
            return match;
        }
    });

    return replacedText;

}


function generateNcCode(array) {
    /* let templateArray = [
        {t_number: 24, t_diameter: "50.", t_length: "80.", t_name: "FR D50"},
        {t_number: 8, t_diameter: "10.", t_length: "110.", t_name: "FR D10"},
        {t_number: 4, t_diameter: "6.", t_length: "90.", t_name: "FR D6"},
        {t_number: 5, t_diameter: "3.", t_length: "82.", t_name: "FR D3"},
    ] */

    let patternsStorage = localStorage.getItem("routinePatterns");
    let patternsStorageOBJ = JSON.parse(patternsStorage);

    // Def Selected Pattern data --------------------------
    let selectedPatternHeader;
    let selectedPatternRoutine;
    let selectedPatternFooter;

    patternsStorageOBJ.forEach(element => {
        if (localStorage.getItem("selectedPattern")) {
            if (localStorage.getItem("selectedPattern") == element.id) {

                selectedPatternHeader = element.header;
                selectedPatternRoutine = element.routine;
                selectedPatternFooter = element.footer;
            }
        }
    });
    // --------------------------

    let newObjectsArray = [];

    let toolsContainer = document.querySelector(".tools");
    let tools = toolsContainer.querySelectorAll(".tool");

    tools.forEach(element => {
        let newObj = {
            t_number: element.querySelector(".tool-number").dataset.value,
            t_diameter: element.querySelector(".tool-diameter").dataset.value,
            t_length: element.querySelector(".tool-length").dataset.value,
            t_name: element.querySelector(".tool-name").dataset.value
        }

        newObjectsArray.push(newObj);
    });

    console.log(newObjectsArray);

    /* const templateCode = `
        (PRESET VARIAS FERRAMENTAS)
        #531=98. (NUMERO DA FERRAMENTA)
        #532=0. (DIA DA FERRAMENTA)
        #533=45. (COMPRIMENTO DA FERRAMENTA)

        G90 G17 G40 G80
        G54

        G100T#531

        G65 P8857 B3 D#532 Y#533

        M403
        G00 G28 G91 Z0.
        G00 G28 G91 X0. Y0.
        G90
    
    ` */
    let codeString = '';

    newObjectsArray.forEach(element => {


        let routine = selectedPatternRoutine;
        //
        routine = replaceToolParameters(selectedPatternRoutine, element);;

        // Deprecated
        /*
        let elemCode = `
(${element.t_name} ----------)
#531=${element.t_number} (NUMERO DA FERRAMENTA)
#532=${element.t_diameter} (DIAMETRO DA FERRAMENTA)
#533=${element.t_length} (COMPRIMENTO DA FERRAMENTA)

G90 G17 G40 G80
G54

G100T#531

G65 P8857 B3 D#532 Y#533

M403
G00 G28 G91 Z0.
G00 G28 G91 X0. Y0.
G90

        `; */

        elemCode = `
${routine}
        `;

        codeString+=elemCode;
    });


    let header = selectedPatternHeader;
    let footer = selectedPatternFooter ;

    codeString = `
${header}
${codeString}
${footer}
    `
    codeString = codeString.trim();
    

    ncCodeModal(true, codeString);
}


function saveNcFile() {
    let modal = document.querySelector(".nc-code-modal");
    let codeDOM = modal.querySelector(".code");

    let now = new Date();

    // Def Selected Pattern data --------------------------
    let patternsStorage = localStorage.getItem("routinePatterns");
    let patternsStorageOBJ = JSON.parse(patternsStorage);

    let selectedPatternFileName
    let selectedPatternFileExtension;

    patternsStorageOBJ.forEach(element => {
        if (localStorage.getItem("selectedPattern")) {
            if (localStorage.getItem("selectedPattern") == element.id) {

                selectedPatternFileName = element.file_name;
                selectedPatternFileExtension = element.file_extension;
            }
        }
    });


    // defaultSaveFile(`presset-${now.toLocaleString().replace(" ", "-")}.nc`, codeDOM.textContent);
    defaultSaveFile(`${selectedPatternFileName}.${selectedPatternFileExtension}`, codeDOM.textContent);

}

function defaultSaveFile(fileName, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}