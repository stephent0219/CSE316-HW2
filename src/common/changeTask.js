'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"


// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class changeTask extends jsTPS_Transaction {
    constructor(tasks,tasksInput,listItem) {
        super();
        this.tasks = tasks;
        this.tasksInput = tasksInput;
        this.listItem = listItem;
        this.original = this.tasks.innerHTML;
        this.newValue = this.tasksInput.value;
    }

    doTransaction() {
        this.tasks.style.display = "block";
        this.tasksInput.style.display = "none";
        this.tasks.innerHTML =  this.newValue;
        this.listItem.description =  this.newValue;
    }

    undoTransaction() {
        this.tasks.style.display = "block";
        this.tasksInput.style.display = "none";
        this.tasks.innerHTML =  this.original;
        this.listItem.description =  this.original;
    }
}