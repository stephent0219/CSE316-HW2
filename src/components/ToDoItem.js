// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Close from '@material-ui/icons/Close';

import changeTask from '../common/changeTask'
import changeDueDate from '../common/changeDueDate'
import changeStatus from '../common/changeStatus'

class ToDoItem extends Component {
    constructor(props) {
        super(props);
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " constructor");
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " did mount");
    }

    



    changeTasks = () =>{

        let listItem = this.props.toDoListItem;
        var tasks = document.getElementById("task-col-"+listItem.id);
        var tasksInput = document.getElementById('task-column-input-'+listItem.id);
        var app = this;

        tasks.addEventListener("mousedown",() => {
            this.props.refresh();

            tasksInput.style.display = "block";
            tasksInput.value = tasks.innerHTML;
            tasks.style.display = "none";
        });

        tasksInput.addEventListener("focusout",() => {
            
            let transaction = new changeTask(tasks,tasksInput,listItem);
            app.props.TPS.addTransaction(transaction);
            if(this.props.TPS.getUndoSize() !== 0){
                document.getElementById("undo-button").style.color = "rgb(233,237,240)";
                document.getElementById("undo-button").style.pointerEvents = "auto";
            }
            this.props.afterToDoListsChangeComplete();
        });
       
    }

    changeDueDate = () =>{
        let listItem = this.props.toDoListItem;
        var dueDate = document.getElementById("due-date-col-"+listItem.id);
        var duedateInput = document.getElementById("due-date-column-input-"+listItem.id);
        var app = this;

        dueDate.addEventListener("mousedown",() => { 
            this.props.refresh();

            duedateInput.style.display = "block";
            duedateInput.value = dueDate.innerHTML;
            dueDate.style.display = "none";
        });

        duedateInput.addEventListener("focusout",() => {

            let transaction = new changeDueDate(dueDate,duedateInput,listItem);
            app.props.TPS.addTransaction(transaction);
            if(this.props.TPS.getUndoSize() !== 0){
                document.getElementById("undo-button").style.color = "rgb(233,237,240)";
                document.getElementById("undo-button").style.pointerEvents = "auto";
            }
            this.props.afterToDoListsChangeComplete();
        });

    }



    changeStatus = () =>{
        let listItem = this.props.toDoListItem;
        var status = document.getElementById("status-col-"+listItem.id);
        var statusSelect = document.getElementById("status-select-"+listItem.id);
        var app = this;

        status.addEventListener("mousedown",() => { 
            this.props.refresh();

            statusSelect.style.display = "block";
            statusSelect.value = status.innerHTML;
            status.style.display = "none";
        });

        statusSelect.addEventListener("focusout",() => {
            let transaction = new changeStatus(status,statusSelect,listItem);
            app.props.TPS.addTransaction(transaction);
            if(this.props.TPS.getUndoSize() !== 0){
                document.getElementById("undo-button").style.color = "rgb(233,237,240)";
                document.getElementById("undo-button").style.pointerEvents = "auto";
            }
            this.props.afterToDoListsChangeComplete();
        });
    }





    handleMoveItemUp = () =>{
        this.props.itemArrowUpCallback(this.props.toDoListItem);
    }

    handleMoveItemDown = () =>{
        this.props.itemArrowDownCallback(this.props.toDoListItem);
    }

    handleDeleteItem = () =>{
        this.props.itemDeleteCallback(this.props.toDoListItem);
    }

    

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem render");

        let listItem = this.props.toDoListItem;
        let statusType = "status-complete";

        if (listItem.status === "incomplete"){
            statusType = "status-incomplete";
        }
        
        return (

            <div id={'todo-list-item-' + listItem.id} className='list-item-card'>

                <div className='item-col task-col' id = {'task-col-'+listItem.id} onClick = {this.changeTasks}>{listItem.description}</div>
                <input className = 'task-column-input' id = {'task-column-input-'+listItem.id} style = {{display:'none'}}></input>

                <div className='item-col due-date-col' id = {'due-date-col-'+listItem.id} onClick = {this.changeDueDate}>{listItem.due_date}</div>
                <input type = 'date' className = 'due-date-column-input' id = {'due-date-column-input-'+listItem.id} style = {{display:'none'}}></input>

                <div className='item-col status-col' id = {'status-col-'+listItem.id} onClick = {this.changeStatus} className={statusType}>{listItem.status}</div>
                <select className = 'status status-select' style = {{display:'none'}} id = {'status-select-'+listItem.id} ><option 
                value='complete'>complete</option><option value='incomplete'>incomplete</option></select>

                <div className='item-col test-4-col'></div>
                <div className='item-col list-controls-col'>
                    <KeyboardArrowUp className='list-item-control todo-button' id={"arrow-up-${listItem.id}"} onClick={this.handleMoveItemUp}
                     style={this.props.disableUp ? {color: "#322d2d", pointerEvents: "none"} : {color: "rgb(233,237,240", pointerEvents: "auto"}} />
                    <KeyboardArrowDown className='list-item-control todo-button' id={'arrow-down-'+listItem.id} onClick={this.handleMoveItemDown}
                     style={this.props.disableDown ? {color: "#322d2d", pointerEvents: "none"} : {color: "rgb(233,237,240", pointerEvents: "auto"}} />
                    <Close className='list-item-control todo-button' id={'close-list-'+listItem.id} onClick={this.handleDeleteItem} />
                    <div className='list-item-control'></div>
        <div className='list-item-control'></div>
                </div>
            </div>
        )
    }
}

export default ToDoItem;