// --------------------------------------------------------------------------------------------------

// Confirmation Modal

function confirmationModal(title, text, confirmbuttontext="Confirmar", closebuttontext="Cancelar") {
    
    return new Promise((resolve)=> {
        let modal = document.querySelector(".confirmation-modal");
        let blackBack = document.querySelector(".black-back");

        let modalDOMTitle = modal.querySelector("h1");
        let modalDOMText = modal.querySelector("h2");
        let modalDOMCloseButton = modal.querySelector(".cancel-button");
        let modalDOMConfirmButton = modal.querySelector(".confirm-button");

        if (title) {
            modalDOMTitle.innerHTML = title;
            modalDOMText.innerHTML = text;
            modalDOMCloseButton.innerHTML = `<i class="fa-solid fa-xmark"></i>${closebuttontext}`;;
            modalDOMConfirmButton.innerHTML = `<i class="fa-solid fa-check"></i>${confirmbuttontext}`;

            modal.classList.add("visible");
            blackBack.classList.add("visible");

            modalDOMCloseButton.onclick = ()=> {
                modal.classList.remove("visible");
                blackBack.classList.remove("visible");
                resolve(false);
            }

            modalDOMConfirmButton.onclick = ()=> {
                resolve(true);
                modal.classList.remove("visible");
                blackBack.classList.remove("visible");
            }
        } else {
            modal.classList.remove("visible");
            blackBack.classList.remove("visible");
            resolve(false);
        }
    })

    
}


// Notify

function notify(text, duration=3, delay=0) {
    let modal = document.querySelector(".notify-modal");
    let modalDOMText = modal.querySelector("p");

    if (text) {
        modalDOMText.innerHTML = `${text}`;

        setTimeout(()=>{

            modal.classList.add("visible");

            setTimeout(()=>{
                modal.classList.remove("visible");
            }, duration*1000);

        }, delay*1000);

    } else {
        console.error("Erro: notify() requer um texto.");
    }
}