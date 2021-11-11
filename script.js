let addbtn = document.querySelector(".add-btn");
let removebtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");

let colors = ['lightpink', 'lightblue', 'lightgreen', 'black'];
let modalPriorityColor = colors[colors.length - 1];

let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketsArr = [];

if (localStorage.getItem("tickets")) {
    // Retirieve and Display tickets
    ticketsArr = JSON.parse(localStorage.getItem("tickets"));
    ticketsArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    });
}

// Color Based Sort
for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolboxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj, idx) => {
            return currentToolboxColor === ticketObj.ticketColor;
        });

        // Remove Previous Tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTicketsCont.length; j++) {
            allTicketsCont[j].remove();
        }

        // Display New Filtered Tickets
        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        });
    });

    // Reset Tickets to Original Mix
    toolBoxColors[i].addEventListener("dblclick", (e) => {
        // Remove Previous Tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTicketsCont.length; j++) {
            allTicketsCont[j].remove();
        }

        // Add Original Mix of Tickets
        ticketsArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        });
    });
}

// Default for Modal
function setModalToDefault() {
    modalCont.style.display = "none";
    textareaCont.value = "";
    modalPriorityColor = colors[colors.length - 1];
    allPriorityColor.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    });
    allPriorityColor[allPriorityColor.length - 1].classList.add("border");
}

// Modal priority coloring customization
allPriorityColor.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColor.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    });
});

// Toggle Modal Display
addbtn.addEventListener("click", (e) => {
    addFlag = !addFlag;
    if (addFlag) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }
});

// Toggle Remove Button
removebtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
});

// Add ticket to main container on keypress
modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Escape") {
        createTicket(modalPriorityColor, textareaCont.value);
        addFlag = false;
        setModalToDefault();
    }
});

// Generate and Add Ticket 
function createTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
            <div class="ticket-cont">
            <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">
                <center># ${id}</center>
            </div>
            <div class="task-area">
                <center>${ticketTask}</center>
            </div>
            <div class="ticket-lock">
                <i class="fas fa-lock"></i>
            </div>
        </div>
    `;
    mainCont.appendChild(ticketCont);

    // Create objects of tickets and Add to ticketArr
    if (!ticketID) {
        ticketsArr.push({ ticketColor, ticketTask, ticketID: id });
        // Store data in local storage
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    }

    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}

// Delete Ticket
function handleRemoval(ticket, id) {
    ticket.addEventListener("click", (e) => {
        if (!removeFlag) return;

        let idx = getTicketIdx(id);
        ticketsArr.splice(idx, 1); //DB removal
        let strTicketArr = JSON.stringify(ticketsArr);
        localStorage.setItem("tickets", strTicketArr);
        ticket.remove(); //UI removal
    });
}

// Lock handling
function handleLock(ticket, id) {
    let ticketLockElem = document.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = document.querySelector(".task-area");
    ticketLockElem.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);

        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }
        // Modify data in local storage (ticket task)
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    });

}

// Color Refix for Tickets
function handleColor(ticket, id) {
    // Toggle colors
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);

        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        });
        currentTicketColorIdx++;
        let newTicketcolorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketcolorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        // Modify data in local storage (color change)
        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    });
}

// Gets ticket from the ticketsArr for updation
function getTicketIdx(id) {
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    });
    return ticketIdx;
}