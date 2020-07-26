import React from 'react';
import classNames from 'classnames';

const AddTaskForm = ({ onAddTask, list }) => {

  const [visiblePopup, setVisiblePopup] = React.useState(false);
  const [valueText, setValueText] = React.useState('');
  
  const addTask = () => {
    if (valueText) {
      const newTask = {
        "listId": list.id,
        "text": valueText,
        "completed": false
      }
      onAddTask(newTask);
    } else {
      alert("Заполните поле")
    }
    
  }
  return (
    <div className={classNames("add-task-block", {active: visiblePopup})} >
          <div className="btn" onClick={()=>setVisiblePopup(true)}>+ Добавить новое задание</div>
          <div className="form">
        <input type="text" onChange={(e)=>{setValueText(e.target.value)}}/>
            <div className="wrap-btns">
              <button className="btn-add" type="button" onClick={addTask}>Добавить</button>
              <button className="btn-close" type="button" onClick={()=>setVisiblePopup(false)}>Отмена</button>
            </div>
          </div>
    </div>
  )
};


export default AddTaskForm;