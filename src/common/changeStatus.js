'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"


// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class changeStatus extends jsTPS_Transaction {
    constructor(status,statusSelect,listItem) {
        super();
        this.status = status;
        this.statusSelect = statusSelect;
        this.listItem = listItem;
        this.original = this.status.innerHTML;
        this.newValue = this.statusSelect.value;
    }

    doTransaction() {
        this.status.style.display = "block";
        this.statusSelect.style.display = "none";
        this.status.innerHTML =  this.newValue;
        this.listItem.status =  this.newValue;
        if(this.listItem.status === "incomplete"){
            this.status.style.color = "#ffc819";
        }else{
            this.status.style.color = "#19c8ff";
        }
    }

    undoTransaction() {
        this.status.style.display = "block";
        this.statusSelect.style.display = "none";
        this.status.innerHTML =  this.original;
        this.listItem.status =  this.original;
        if(this.listItem.status === "incomplete"){
            this.status.style.color = "#ffc819";
        }else{
            this.status.style.color = "#19c8ff";
        }
    }
}