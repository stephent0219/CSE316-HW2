'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"


// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class addItem extends jsTPS_Transaction {
    constructor(index,items,newItem) {
        super();
        this.items = items;
        this.newItem = newItem;
        this.index = index;
        this.length = this.items.length;
    }

    doTransaction() {
        this.items.splice(this.length,0,this.newItem);
    }

    undoTransaction() {
        this.items.splice(this.length,1);
    }
}