const addBtn = document.querySelector('.add-btn');
const modalCont = document.querySelector('.modal-cont');
const taskArea = document.querySelector('.textArea-cont');
const mainCont = document.querySelector('.main-cont');
const allpriorityColors = document.querySelectorAll('.priority-color');
const removeBtn = document.querySelector('.remove-btn');
const lockBtn = document.querySelector('.lock');
const toolBoxColors = document.querySelectorAll('.color');

let ticketsArr = JSON.parse(localStorage.getItem('appTickets'))||[]
console.log(ticketsArr)

let colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];  //priority colors array
let modalColorForTicket= 'lightpink';

// MODAL POP UP EVENT

let addBtnFlag = false;
addBtn.addEventListener('click', function(){
    addBtnFlag = !addBtnFlag;
    if(addBtnFlag){
        modalCont.style.display = 'flex';
    }
    else{
        modalCont.style.display = 'none';
    }
})


// CREATE A TICKET 

function createTicket(ticketColor, ticketTask, ticketId){
    let ticketCont = document.createElement('div');
    ticketCont.setAttribute('class', 'ticket-cont');
    ticketCont.innerHTML = `
        <div class="ticket-cont">
        <div class="ticket-color" style="background-color:${ticketColor}"></div>
        <div class="ticket-id">${ticketId}</div>
        <div class="task-area" contenteditable="false">${ticketTask}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock lock"></i>
        </div>
        </div>
    `;

    mainCont.appendChild(ticketCont);

    handleRemoval(ticketCont);
    handleColor(ticketCont);
    handleLock(ticketCont);
    
}
// localStorage.clear()


// TASK ADDING EVENT

modalCont.addEventListener('keydown', function(e){
    if(e.key === 'Shift'){
        let task = taskArea.value;
        const id = shortid();
        createTicket(modalColorForTicket, task, id);
        modalCont.style.display = 'none';
        taskArea.value = '';
        addBtnFlag = false;
        ticketsArr.push({color: modalColorForTicket, task: task, id: id});
        updateLocalStorage();
    }
})


// Moving the active class on priority color boxes

allpriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click', function(){

        allpriorityColors.forEach(function(priorityColor){
            priorityColor.classList.remove('active');
        })

        colorElem.classList.add('active');
        modalColorForTicket = colorElem.classList[0] 
    })
})


// REMOVE BUTTON EVENT FOR DELETING A TICKET 

let removeBtnFlag = false;
removeBtn.addEventListener('click', function(){
    removeBtnFlag = !removeBtnFlag;
    if(removeBtnFlag){
        alert('Delete Button Activated')
        removeBtn.style.color = 'rgb(240, 97, 97)';
    }
    else{
        removeBtn.style.color = '';
    }
})

function handleRemoval(ticket){
    ticket.addEventListener('click', function(){
        if(removeBtnFlag){
            ticket.remove();
        }
    })
    
}


// CHANGE PRIORITY COLOR OF TICKETS

function handleColor(ticket){
    let ticketColorBand= ticket.querySelector('.ticket-color');
    const id = ticket.querySelector('.ticket-id').innerText;
    console.log(id);
    
    ticketColorBand.addEventListener('click', function(){
        let ticketIdx = getIdx(id)
        console.log(ticketIdx)

        let currentColor = ticketColorBand.style.backgroundColor;

        let currentColorIdx = colors.findIndex(function(color){
            return color === currentColor
        })
        currentColorIdx++;
        let newColorIdx = currentColorIdx;
        if(newColorIdx > colors.length-1){
            newColorIdx = 0
        }
        let newColor = colors[newColorIdx];
        ticketColorBand.style.backgroundColor = newColor;

        ticketsArr[ticketIdx].color = newColor;
        updateLocalStorage();
    })
}


// LOCK - UNLOCK FEATURE 

function handleLock(ticket){
    let ticketLockCont = ticket.querySelector('.ticket-lock');
    let ticketLockIcon = ticketLockCont.children[0];
    let ticketTaskArea = ticket.querySelector('.task-area');

    ticketLockCont.addEventListener('click', function(){
        if(ticketLockIcon.classList.contains('fa-lock')){
            ticketLockIcon.classList.remove('fa-lock');
            ticketLockIcon.classList.add('fa-unlock');
            ticketTaskArea.contentEditable = true;
        }
        else{
            ticketLockIcon.classList.remove('fa-unlock');
            ticketLockIcon.classList.add('fa-lock');
            ticketTaskArea.contentEditable = false;
        }
    })
}


//  FILTER OUT TICKETS ACCORDING TO THE COLOR

toolBoxColors.forEach(function(colorElem){
    colorElem.addEventListener('click', function(){
        let color = colorElem.classList[0];
        let tickets = document.querySelectorAll('.ticket-cont');
        let deselectFilterBtn = document.querySelector('.deselect-filter');
        for(let i=0; i<tickets.length; i++){
            let currentColor = tickets[i].querySelector('.ticket-color').style.backgroundColor;
            if(currentColor === color){
                tickets[i].style.display = 'block';
            }
            else{
                tickets[i].style.display = 'none';
            } 
        }

        deselectFilterBtn.addEventListener('click', function(){
            for(let i=0; i<tickets.length; i++){
                tickets[i].style.display = 'block';
            }
        })
    })
})


// UPDATING LOCAL STORAGE

function updateLocalStorage(){
    localStorage.setItem('appTickets' , JSON.stringify(ticketsArr));
}
  
function init(){
    if(localStorage.getItem('appTickets')){
        ticketsArr.forEach(function(ticket){
            createTicket(ticket.color, ticket.task, ticket.id);
        })
    }
}
init();

function getIdx(id){
    let ticketIdx = ticketsArr.findIndex(function(ticketContainers){
        return ticketContainers.id == id;
    });
    return ticketIdx;
}
