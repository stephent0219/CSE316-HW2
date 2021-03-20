// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS'
import deleteItem from './common/deleteItem'
import moveItemUp from './common/moveItemUp'
import moveItemDown from './common/moveItemDown'
import addItem from './common/addItem'

// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'
import { ContactSupportOutlined } from '@material-ui/icons';
{/*import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'
*/}
class App extends Component {
  constructor(props) {
    // ALWAYS DO THIS FIRST
    super(props);

    // DISPLAY WHERE WE ARE
    console.log("App constructor");

    // MAKE OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
    let recentLists = localStorage.getItem("recentLists");
    console.log("recentLists: " + recentLists);
    if (!recentLists) {
      recentLists = JSON.stringify(testData.toDoLists);
      localStorage.setItem("toDoLists", recentLists);
    }
    recentLists = JSON.parse(recentLists);

    // FIND OUT WHAT THE HIGHEST ID NUMBERS ARE FOR LISTS
    let highListId = -1;
    let highListItemId = -1;
    for (let i = 0; i < recentLists.length; i++) {
      let toDoList = recentLists[i];
      if (toDoList.id > highListId) {
        highListId = toDoList.id;
      }
      for (let j = 0; j < toDoList.items.length; j++) {
        let toDoListItem = toDoList.items[j];
        if (toDoListItem.id > highListItemId)
        highListItemId = toDoListItem.id;
      }
    };


    this.state = {
      toDoLists: recentLists,
      currentList: {items: []},
      nextListId: highListId+1,
      nextListItemId: highListItemId+1,
      useVerboseFeedback: true
    }
  }

  refresh = () =>{
    let items = this.state.currentList.items;
    for(let i =0; i < items.length; i++){
      let div = document.getElementById("task-col-"+items[i].id);
      let input = document.getElementById('task-column-input-'+items[i].id);
      div.style.display = "block";
      input.style.display = "none";
    }
    for(let i =0; i < items.length; i++){
      let div = document.getElementById("due-date-col-"+items[i].id);
      let input = document.getElementById('due-date-column-input-'+items[i].id);
      div.style.display = "block";
      input.style.display = "none";
    }
    for(let i =0; i < items.length; i++){
      let div = document.getElementById("status-col-"+items[i].id);
      let input = document.getElementById('status-select-'+items[i].id);
      div.style.display = "block";
      input.style.display = "none";
    }

  }




  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    console.log("loading " + toDoList);

    var lists = document.getElementsByClassName("todo-list-button");
    for(let i = 0; i < lists.length; i++){
      lists[i].style.color = "rgb(233,237,240)";
      lists[i].style.backgroundColor = "#353a44";
    }

    // MAKE SURE toDoList IS AT THE TOP OF THE STACK BY REMOVING THEN PREPENDING
    const nextLists = this.state.toDoLists.filter(testList =>
      testList.id !== toDoList.id
    );
    
    nextLists.unshift(toDoList);

    this.tps.clearAllTransactions();
    
    document.getElementById("todo-list-button-"+toDoList.id).style.color = "#ffc819";
    document.getElementById("todo-list-button-"+toDoList.id).style.backgroundColor = "#40454e";    

    document.getElementById("add-list-button").style.color = "#322d2d";
    document.getElementById("add-list-button").style.pointerEvents = 'none';

    document.getElementById("undo-button").style.color = "#322d2d";
    document.getElementById("undo-button").style.pointerEvents = 'none';

    document.getElementById("redo-button").style.color = "#322d2d";
    document.getElementById("redo-button").style.pointerEvents = 'none';
  
    document.getElementById("add-item-button").style.color = "rgb(233,237,240)";
    document.getElementById("add-item-button").style.pointerEvents = 'auto';

    document.getElementById("delete-list-button").style.color = "rgb(233,237,240)";
    document.getElementById("delete-list-button").style.pointerEvents = 'auto';

    document.getElementById("close-list-button").style.color = "rgb(233,237,240)";
    document.getElementById("close-list-button").style.pointerEvents = 'auto';


    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
    },this.afterToDoListsChangeComplete);

  }


  addNewList = () => {
    let newToDoListInList = [this.makeNewToDoList()];
    let newToDoListsList = [...newToDoListInList, ...this.state.toDoLists];
    let newToDoList = newToDoListInList[0];
    
    // AND SET THE STATE, WHICH SHOULD FORCE A render
    this.setState({
      toDoLists: newToDoListsList,
      currentList: newToDoList,
      nextListId: this.state.nextListId+1
    }, this.afterToDoListsChangeComplete);
  }

  makeNewToDoList = () => {
    let newToDoList = {
      id: this.state.nextListId,
      name: 'Untitled',
      items: []
    };
    return newToDoList;
  }


  addNewItem = () => {
    let newItem = this.makeNewToDoListItem();
    let items = this.state.currentList.items;
    let index = this.state.nextListItemId;

    let transaction = new addItem(index,items,newItem);
    this.tps.addTransaction(transaction);

    if(this.tps.getUndoSize() !== 0){
      document.getElementById("undo-button").style.color = "rgb(233,237,240)";
      document.getElementById("undo-button").style.pointerEvents = "auto";
    }

    // AND SET THE STATE, WHICH SHOULD FORCE A render
    this.setState({
      currentList: this.state.currentList,
      nextListItemId: this.state.nextListItemId+1
    }, this.afterToDoListsChangeComplete);
  }


  makeNewToDoListItem = () =>  {
    let newToDoListItem = {
      id: this.state.nextListItemId,
      description: "No Description",
      due_date: "No Date",
      status: "incomplete"
    };
    return newToDoListItem;
  }


  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    console.log("App updated currentToDoList: " + this.state.currentList);

    // WILL THIS WORK? @todo
    let toDoListsString = JSON.stringify(this.state.toDoLists);
    localStorage.setItem("recentLists", toDoListsString);
  }









  deleteCurrentList = () =>{ 

    var dialog = document.getElementById("delete-confirm-dialog");
    var toDoList = this.state.toDoLists;
    var app = this;

    dialog.style.display = "block";

    document.getElementById("close-button").onmousedown = function() {
      dialog.style.display="none";
    }

    document.getElementById("confirm-button").onmousedown = function() {
      dialog.style.display="none";
      toDoList.splice(0,1);
    
      app.setState({
        toDoLists: toDoList,
        currentList: {items:[]}
      }, app.afterToDoListsChangeComplete);
    } 

    document.getElementById("cancel-button").onmousedown = function() {
      dialog.style.display="none";
    }
    this.handleCloseCurrentListCallback();

    this.setState({
      toDoLists: toDoList,
    }, this.afterToDoListsChangeComplete);
  }








  itemArrowUp = (toDoListItem) =>{
    let items = this.state.currentList.items;
        
    let transaction = new moveItemUp(items,toDoListItem);
    this.tps.addTransaction(transaction);
    if(this.tps.getUndoSize() !== 0){
      document.getElementById("undo-button").style.color = "rgb(233,237,240)";
      document.getElementById("undo-button").style.pointerEvents = "auto";
    }
    this.setState({
      currentList: this.state.currentList
    }, this.afterToDoListsChangeComplete);
  }





  itemArrowDown = (toDoListItem) =>{
    let items = this.state.currentList.items;

    let transaction = new moveItemDown(items,toDoListItem);
    this.tps.addTransaction(transaction);
    if(this.tps.getUndoSize() !== 0){
      document.getElementById("undo-button").style.color = "rgb(233,237,240)";
      document.getElementById("undo-button").style.pointerEvents = "auto";
    }
    this.setState({
      currentList: this.state.currentList
    }, this.afterToDoListsChangeComplete);
  }



  itemDelete = (toDoListItem) =>{
    let indexOfItem = -1;
    let items = this.state.currentList.items;

    let transaction = new deleteItem(indexOfItem,items,toDoListItem);
    this.tps.addTransaction(transaction);
    if(this.tps.getUndoSize() !== 0){
      document.getElementById("undo-button").style.color = "rgb(233,237,240)";
      document.getElementById("undo-button").style.pointerEvents = "auto";
    }
    this.setState({
      currentList: this.state.currentList
    }, this.afterToDoListsChangeComplete);
  }




  undoControlButton = () =>{
    this.tps.undoTransaction();
    if(this.tps.getUndoSize() === 0){
      document.getElementById("undo-button").style.color = "#322d2d";
      document.getElementById("undo-button").style.pointerEvents = "none";
    }
    if(this.tps.getRedoSize() !== 0){
      document.getElementById("redo-button").style.color = "rgb(233,237,240)";
      document.getElementById("redo-button").style.pointerEvents = "auto";
    }
    this.setState({
      currentList: this.state.currentList
    }, this.afterToDoListsChangeComplete);
  }




  redoControlButton = () =>{
    this.tps.doTransaction();
    if(this.tps.getRedoSize() === 0){
      document.getElementById("redo-button").style.color = "#322d2d";
      document.getElementById("redo-button").style.pointerEvents = "none";
    }
    if(this.tps.getUndoSize() !== 0){
      document.getElementById("undo-button").style.color = "rgb(233,237,240)";
      document.getElementById("undo-button").style.pointerEvents = "auto";
    }

    this.setState({
      currentList: this.state.currentList
    }, this.afterToDoListsChangeComplete);
  }


  renameList = () =>{
    let currentList = this.state.currentList;
    var originalName = document.getElementById("todo-list-button-"+currentList.id);
    var newName = document.getElementById('rename-list-'+currentList.id);
    var app = this;
    var toDoList = this.state.toDoLists;

    // originalName.addEventListener("mousedown",() => {
    // }
    newName.style.display = "block";
    newName.value = originalName.innerHTML;
    originalName.style.display = "none";

    newName.addEventListener("focusout",() => {
      originalName.style.display = "block";
      newName.style.display = "none";
      originalName.innerHTML = newName.value;
      originalName.name = newName.value;

      app.setState({
        toDoLists: toDoList
      });
    }, this.afterToDoListsChangeComplete);

  }



  handleCloseCurrentListCallback = () =>{
    var lists = document.getElementsByClassName("todo-list-button");
    for(let i = 0; i < lists.length; i++){
      lists[i].style.color = "rgb(233,237,240)";
      lists[i].style.backgroundColor = "#353a44";
    }
    document.getElementById("add-list-button").style.color = "#ffc819";
    document.getElementById("add-list-button").style.pointerEvents = "auto";



    document.getElementById("undo-button").style.color = "#322d2d";
    document.getElementById("undo-button").style.pointerEvents = "none";

    document.getElementById("redo-button").style.color = "#322d2d";
    document.getElementById("redo-button").style.pointerEvents = "none";

    document.getElementById("add-item-button").style.color = "#322d2d";
    document.getElementById("add-item-button").style.pointerEvents = "none";

    document.getElementById("delete-list-button").style.color = "#322d2d";
    document.getElementById("delete-list-button").style.pointerEvents = "none";

    document.getElementById("close-list-button").style.color = "#322d2d";
    document.getElementById("close-list-button").style.pointerEvents = "none";
    this.setState({
      currentList: {items:[]},
      toDoLists : this.state.toDoLists
    }, this.afterToDoListsChangeComplete);
  }

  update = () =>{
    this.setState({
      // currentList: {items:[]},
      toDoLists : this.state.toDoLists
    },this.afterToDoListsChangeComplete);
  }



  render() {
      let items = this.state.currentList.items;
      return (
        <div id="root">
          <Navbar />
          <LeftSidebar 
            toDoLists={this.state.toDoLists}
            loadToDoListCallback={this.loadToDoList}
            addNewListCallback={this.addNewList}
            currentList = {this.state.currentList}
            renameListCallback = {this.renameList}
          />
          <Workspace 
            toDoListItems={items}
          
            addNewItemCallback = {this.addNewItem}
            deleteCurrentListCallback = {this.deleteCurrentList}
            itemArrowUpCallback = {this.itemArrowUp}
            itemArrowDownCallback = {this.itemArrowDown}
            itemDeleteCallback = {this.itemDelete}
            undoControlButtonCallback = {this.undoControlButton}
            redoControlButtonCallback = {this.redoControlButton}
            handleCloseCurrentListCallback = {this.handleCloseCurrentListCallback}
            refresh = {this.refresh}
            TPS = {this.tps}
            afterToDoListsChangeComplete = {this.update}
          />

          <div id="delete-confirm-dialog" style = {{display:"none"}} className="modal">
              <div className="modal-content">
                  <div className ="modal-header" > 
                      <span id = "close-button" className="close">&times;</span>
                      <h3>Delete List?</h3>
                  </div>
                  <div className = "modal-body">
                      <div id="confirm-button"><span>Confirm</span></div>
                      <div id="cancel-button"><span>Cancel</span></div>
                  </div>

              </div>
          </div>

        </div>      
      );
    

  }

}

export default App;