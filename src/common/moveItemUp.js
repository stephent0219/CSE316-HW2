'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"


// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class moveItemUp extends jsTPS_Transaction {
    constructor(items,toDoListItem) {
        super();
        this.items = items;
        this.toDoListItem = toDoListItem;     
        this.index = -1;
        
        if(this.items[0] !== this.toDoListItem){    
            for(let i = 1; i < this.items.length; i++){
                if(this.items[i] === this.toDoListItem){
                    this.index = i;
                    break;
                }
            }
        }

    }

    doTransaction() {
        var temp = this.items[this.index-1];
        this.items[this.index-1] = this.items[this.index];
        this.items[this.index] = temp;
    }

    undoTransaction() {
        var temp = this.items[this.index-1];
        this.items[this.index-1] = this.items[this.index];
        this.items[this.index] = temp;
    }
}