let addbtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");

let colors = ['lightpink', 'lightblue', 'lightgreen', 'black'];
let modalPriorityColor = colors[colors.length - 1];
let addFlag = false;

// Listener for modal priority coloring


addbtn.addEventListener("click", (e) => {
    // Display Modal
    // AddFlag, true -> Modal Display
    // AddFlag, false -> Modal None
    addFlag = !addFlag;
    if (addFlag) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }
});

// Add ticket to main container on keypress
modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket();
        modalCont.style.display = "none";
        textareaCont.value = "";
        addFlag = false;
    }
});

// Generate and Add Ticket 
function createTicket() {
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color"></div>
        <div class="ticket-id">Lorem, ipsum.</div>
        <div class="task-area">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore at repudiandae.
        </div>
    `;
    mainCont.appendChild(ticketCont);
}