// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import ListLink from './ListLink'
import AddBox from '@material-ui/icons/AddBox';

class LeftSidebar extends Component {
    constructor(props) {
        super(props);
    }

    handleAddNewList = () => {
        this.props.addNewListCallback();
    }

    render() {
        return (

            <div id="left-sidebar">

                <div id="left-sidebar-header" className="section-header">
                    <span className="left-sidebar-header-text">Todolists</span>
                    <span className="left-sidebar-controls" id="add-undo-redo-box">
                        <AddBox 
                            id="add-list-button"
                            className="material-icons todo_button"
                            onClick={this.handleAddNewList} />
                    </span>
                </div>

                <div id="todo-lists-list">
                {
                    this.props.toDoLists.map((toDoList) => (
                        <ListLink
                            key={toDoList.id}
                            toDoList={toDoList}                                // PASS THE LIST TO THE CHILDREN
                            loadToDoListCallback={this.props.loadToDoListCallback} 
                            currentList = {this.props.currentList}       
                            renameListCallback = {this.props.renameListCallback}
                            />  
                    ))
                }
                </div>

            </div>
        );
    }

}

export default LeftSidebar;