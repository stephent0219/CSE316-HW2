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
    
    document.getElementById("todo-list-button-"+toDoList.id).style.color = "#ffc819";
    document.getElementById("todo-list-button-"+toDoList.id).style.backgroundColor = "#40454e";


    document.getElementById("add-list-button").style.color = "#322d2d";
    document.getElementById("add-list-button").style.pointerEvents = "none";

    // console.log(document.getElementsByClassName("list-controls-col")[0]);
    // console.log(document.getElementsByClassName("list-controls-col"));

   
    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
    });

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

    // this.state.currentList.items.splice(this.state.nextListItemId,0,newItem);
    

    // AND SET THE STATE, WHICH SHOULD FORCE A render
    this.setState({
      currentList: this.state.currentList,
      nextListItemId: this.state.nextListItemId+1
    });
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
      });
    } 

    document.getElementById("cancel-button").onmousedown = function() {
      dialog.style.display="none";
    }

    this.setState({
      toDoLists: toDoList,
    }, this.afterToDoListsChangeComplete);
  }








  itemArrowUp = (toDoListItem) =>{
    let items = this.state.currentList.items;
        
    let transaction = new moveItemUp(items,toDoListItem);
    this.tps.addTransaction(transaction);

    this.setState({
      currentList: this.state.currentList
    });
  }





  itemArrowDown = (toDoListItem) =>{
    let items = this.state.currentList.items;

    let transaction = new moveItemDown(items,toDoListItem);
    this.tps.addTransaction(transaction);

    this.setState({
      currentList: this.state.currentList
    });
  }



  itemDelete = (toDoListItem) =>{
    let indexOfItem = -1;
    let items = this.state.currentList.items;

    let transaction = new deleteItem(indexOfItem,items,toDoListItem);
    this.tps.addTransaction(transaction);

    this.setState({
      currentList: this.state.currentList
    });
  }




  undoControlButton = () =>{
    this.tps.undoTransaction();
    this.setState({
      currentList: this.state.currentList
    });
  }




  redoControlButton = () =>{
    this.tps.doTransaction();
    this.setState({
      currentList: this.state.currentList
    });
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
    });

  }



  handleCloseCurrentListCallback = () =>{
    var lists = document.getElementsByClassName("todo-list-button");
    for(let i = 0; i < lists.length; i++){
      lists[i].style.color = "rgb(233,237,240)";
      lists[i].style.backgroundColor = "#353a44";
    }
    document.getElementById("add-list-button").style.color = "#ffc819";
    document.getElementById("add-list-button").style.pointerEvents = "auto";
    this.setState({
      currentList: {items:[]},
      toDoLists : this.state.toDoLists
    });
  }


  
  

  // myFunction(){
    
  //   console.log("fffk");
  //   alert("You pressed a key inside the input field");
  // }





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
            // myFunctionCallback = {this.myFunction}
            TPS = {this.tps}
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

          {/* <div>
            <input type="text" onKeyDown={this.myFunction()}></input>
          </div> */}
          

        </div>      
      );
    

  }

}

export default App;