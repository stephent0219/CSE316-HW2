// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'

class ListLink extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " constructor");
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " did mount");
    }

    handleLoadList = () => {
        if(this.props.toDoList === this.props.currentList){
            this.props.renameListCallback();
        }else{
            this.props.loadToDoListCallback(this.props.toDoList);
        }
    }



    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink render");
        
        return (
            <div>
                <div 
                    className='todo-list-button'
                    id = {'todo-list-button-'+this.props.toDoList.id}
                    onClick={this.handleLoadList}
                >
                    {this.props.toDoList.name}
                </div>
                <input className = 'rename-list' id = {'rename-list-'+this.props.toDoList.id} style = {{display:'none'}}></input>
           </div>
        )
    }
}

export default ListLink;