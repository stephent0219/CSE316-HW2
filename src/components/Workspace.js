// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import ToDoItem from './ToDoItem'
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import AddBox from '@material-ui/icons/AddBox';
import Delete from '@material-ui/icons/Delete';
import Close from '@material-ui/icons/Close';

class Workspace extends Component {
    constructor(props) {
        super(props);
    }

    handleAddNewItem = () => {
        this.props.addNewItemCallback();
    }

    handleDeleteCurrentList = () =>{
        this.props.deleteCurrentListCallback();
    }

    loadListcallback = () =>{
        this.props.loadToDoListCallback();
    }



    handleCloseCurrentList = () =>{
        this.props.handleCloseCurrentListCallback();
    }


    componentDidMount=()=>{
        document.addEventListener('keydown',()=>{
            console.log("dasda");
        });
    }

  


    handleUndo = () =>{
        this.props.undoControlButtonCallback();
       
    }
    handleRedo = () =>{
        this.props.redoControlButtonCallback();
    }


    render() {
        let items = this.props.toDoListItems;
        let tps = this.props.TPS;
        return (
            <div id="workspace">
                <div id="todo-list-header-card" className="list-item-card">
                    <div id="task-col-header" className="item-col todo-button">Task</div>
                    <div id="date-col-header" className="item-col todo-button">Due Date</div>
                    <div id="status-col-header" className="item-col todo-button">Status</div>
                    <div className="item-col" display="flex" flexdirection="row" flexwrap="nowrap">
                        <Undo id="undo-button" className="list-item-control material-icons todo-button" 
                                onClick={this.handleUndo} />
                                {/* onKeyDown={this.props.myFunctionCallback} */}
                        <Redo id="redo-button" className="list-item-control material-icons todo-button" 
                                onClick={this.handleRedo} />
                        <AddBox id="add-item-button" className="list-item-control material-icons todo-button"
                                onClick={this.handleAddNewItem} />
                        <Delete id="delete-list-button" className="list-item-control material-icons todo-button"
                                onClick={this.handleDeleteCurrentList} />
                        <Close id="close-list-button" className="list-item-control material-icons todo-button"
                                onClick={this.handleCloseCurrentList} />
                    </div>
                </div>
                <div id="todo-list-items-div">
                    
                    {
                        this.props.toDoListItems.map((toDoListItem) => (
                        <ToDoItem
                            key={toDoListItem.id}
                            toDoListItem={toDoListItem}     // PASS THE ITEM TO THE CHILDREN
                            items = {items}
                            itemArrowUpCallback = {this.props.itemArrowUpCallback}
                            itemArrowDownCallback = {this.props.itemArrowDownCallback}
                            itemDeleteCallback = {this.props.itemDeleteCallback}
                            TPS = {tps}
                            
                        />))
                    }
                </div>
                <br />
            </div>
        );
    }
}

export default Workspace;