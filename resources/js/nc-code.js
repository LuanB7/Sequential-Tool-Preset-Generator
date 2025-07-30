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


function generateNcCode(array) {
    /* let templateArray = [
        {t_number: 24, t_diameter: "50.", t_length: "80.", t_name: "FR D50"},
        {t_number: 8, t_diameter: "10.", t_length: "110.", t_name: "FR D10"},
        {t_number: 4, t_diameter: "6.", t_length: "90.", t_name: "FR D6"},
        {t_number: 5, t_diameter: "3.", t_length: "82.", t_name: "FR D3"},
    ] */

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

        `;

        codeString+=elemCode;
    });

    codeString = codeString.trim();
    codeString+=`
    
M30

    `;

    ncCodeModal(true, codeString);
}


function saveNcFile() {
    let modal = document.querySelector(".nc-code-modal");
    let codeDOM = modal.querySelector(".code");

    let now = new Date();


    // defaultSaveFile(`presset-${now.toLocaleString().replace(" ", "-")}.nc`, codeDOM.textContent);
    defaultSaveFile(`O0700.nc`, codeDOM.textContent);

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