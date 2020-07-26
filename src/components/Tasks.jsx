import React from 'react';
import AddTaskForm from './AddTaskForm';

const Tasks = ({ list, onAddTask, onEditList, onRemoveTask, onCompleteTask, onEditTitleTask }) => {
  const tasks = list.tasks;

  const editList = () => {
    let newTitle = window.prompt("Введите новое название", list.title);
    if (newTitle) {
      const data = {
        title: newTitle
      }
      onEditList(list.id, data);
    }
  }

  const editText = (id, oldText) => {
    let newText = window.prompt("Введите новое название", oldText);
    if (newText) {
      onEditTitleTask(id, newText);
    }
    
  }
  

  return (
    <div className="task-item">
      <h1 className="list-title" style={{color:list.color.hex}}>{list.title ? list.title : "Без названия"}<span className="icon" onClick={()=>{editList()}}>изменить</span></h1>
      <div className="list-tasks">
        {tasks && tasks.map((item, index) => {
        return (
            <div
              key={index}
              className="task"
            >
            <input type="checkbox" name="" id="" checked={item.completed} onChange={()=>onCompleteTask(item.id, !item.completed)}/>
            <input type="text" value={item.text} readOnly />
            <span className="edit icon" onClick={()=>editText(item.id, item.text)}>изменить</span>
            <span className="del icon" onClick={()=>onRemoveTask(item.id)}>x</span>
          </div>
        )
        })}
        <AddTaskForm onAddTask={onAddTask} list={list}/>
      </div>
    </div>
  )
};


export default Tasks;