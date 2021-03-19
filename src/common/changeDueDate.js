'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"


// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class changeDueDate extends jsTPS_Transaction {
    constructor(dueDate,duedateInput,listItem) {
        super();
        this.dueDate = dueDate;
        this.duedateInput = duedateInput;
        this.listItem = listItem;
        this.original = this.dueDate.innerHTML;
        this.newValue = this.duedateInput.value;
    }

    doTransaction() {
        this.dueDate.style.display = "block";
        this.duedateInput.style.display = "none";
        this.dueDate.innerHTML =  this.newValue;
        this.listItem.due_date =  this.newValue;
    }

    undoTransaction() {
        this.dueDate.style.display = "block";
        this.duedateInput.style.display = "none";
        this.dueDate.innerHTML =  this.original;
        this.listItem.due_date =  this.original;
    }
}