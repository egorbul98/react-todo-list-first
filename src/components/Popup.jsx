import React from 'react';
import classNames from "classnames";

const Popup = ({ colors, activePopup, onAddList, loading }) => {
  // const newId = colors[0].id;
  // console.log(colors, "colors");
  const [activeColor, setActiveColor] = React.useState(0);
  const [inputValue, setInputValue] = React.useState('');
  // setActiveColor(newId);
  React.useEffect(() => {
    if (Array.isArray(colors)) {
      setActiveColor(colors[0].id);
    }
  }, [colors]);
  
  const onAdd = () => {
    let newList = {
      "id": Math.random(),
      "title": inputValue,
      "colorId": activeColor
    };
    onAddList(newList);
    setInputValue("");
  }
  return (
    <div className={classNames("popup", {"active":activePopup })}>
          <div className="list-color">
            {colors && colors.map((item, index) => {
              return (
                <div 
                key={index} 
                className={classNames("color", {"active": activeColor === item.id})}
                style={{ backgroundColor: item.hex }}
                title={item.title}
                  onClick={() => setActiveColor(item.id)}></div>
              )
            })}
      </div>
      <input type="text" className="input-title" value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
      <button type="button" className="add-todo" onClick={onAdd}>{loading ? "Добавление...": "Добавить"}</button>
    </div>
  )
};


export default Popup;