'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"


// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class deleteItem extends jsTPS_Transaction {
    constructor(indexOfItem,items,toDoListItem) {
        super();
        this.indexOfItem = indexOfItem;
        this.items = items;
        this.toDoListItem = toDoListItem;

        for(let i = 0; (i < this.items.length) && (this.indexOfItem < 0); i++){
            if(this.items[i] === this.toDoListItem){
                this.indexOfItem = i;
            }
        }

        this.itemForDelete = this.items[this.indexOfItem];

    }

    doTransaction() {
        this.items.splice(this.indexOfItem,1);
    }

    undoTransaction() {
        this.items.splice(this.indexOfItem,0,this.itemForDelete);
    }
}