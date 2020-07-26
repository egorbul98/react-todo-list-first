import React from 'react';
import classNames from "classnames"
import {useHistory} from 'react-router-dom';
const List = ({ items, isRemovable, onRemoveList, onSelectItemList, onClick, selectItem}) => {
  return (
    <div className="item-todos-link-list">
      {items && items.map((item, index) => {
        return <div 
        className={classNames("item", {"active":selectItem === item.id})}
          key={item.id ? item.id : index}
          onClick={onSelectItemList ? ()=>onSelectItemList(item.id) : onClick}>
          <div className="icon" style={{ backgroundColor: item.hexColor }}></div>
          
          <div className="text">{item.title} ({item.tasks ? item.tasks.length : 0})</div>
          {isRemovable && <button className="del" onClick={() => { onRemoveList(item.id) }}>x</button>}
        </div>
      })}
    </div>
  )
};


export default List;