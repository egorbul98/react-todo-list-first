import React from 'react';
import { List, Popup, Tasks } from './components/index';
import { Route, Link, useHistory, Switch } from 'react-router-dom';

import classnames from 'classnames';
import axios from 'axios';
import AddTaskForm from './components/AddTaskForm';


function App() {
  const [lists, setLists] = React.useState(null);
  const [colors, setColors] = React.useState(null);
  const [activePopup, setActivePopup] = React.useState(false);
  const [selectList, setSelectList] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  React.useEffect(() => {
    axios.get("http://localhost:3001/lists?_expand=color&_embed=tasks").then(({data}) => {
      setLists(data);
    })
    axios.get("http://localhost:3001/colors").then(({data}) => {
      setColors(data);
    })
  }, []);

  React.useEffect(() => {
    console.log("asdasd useEffect", history.location.pathname);
    let arrSplitPath = history.location.pathname.split("/");
    if (arrSplitPath[arrSplitPath.length - 1]) {
      const idItemList = Number(arrSplitPath[arrSplitPath.length - 1]);
      setSelectList(idItemList);
    }
  }, [history.location.pathname, lists]);

  const onSelectItemList = (idItem) => {
    history.push(`/lists/${idItem}`);
    setSelectList(idItem);
  }

  const onPopup = () => {
    setActivePopup(!activePopup);
  }
  const onAddList = (newItem) => {
    setLoading(true);
    axios.post("http://localhost:3001/lists", { "title": newItem.title, "colorId": newItem.colorId }).then(({ data }) => {
      data.tasks = [];
      data.color = colors.filter((item) => {
        return item.id === data.colorId
      })[0];
      const newLists = [...lists, data];
      setLists(newLists);
      history.push("/lists/" + data.id);
    }).finally(() => {
      setLoading(false);
    });
  }
  const onRemoveList = (itemId) => {
    if (window.confirm("Точно хотите удалить?")) {
      axios.delete("http://localhost:3001/lists/"+itemId).then((res) => {
        let newLists = lists.filter((item) => {
          return item.id !== itemId;
        });
        setLists(newLists);
      });
      
    }
  }

  const onEditList = (id, newData) => {
    axios.patch("http://localhost:3001/lists/" + id, newData).then(({ data }) => {
      const newLists = lists.map((item) => {
        if (item.id === id) {
          item.title = data.title;
          item.colorid = data.colorId;
        } 
        return item;
      });
      setLists(newLists);
    }).catch((e) => {
      console.log(e);
      console.log("ошибочка");
    }).finally(() => {
      // setLoading(false);
    });
  }

  const onAddTask = (newItem) => {
    console.log(newItem);
    axios.post("http://localhost:3001/tasks", newItem).then(({ data }) => {
      const newLists = lists.map((item) => {
        if (item.id === newItem.listId) {
          item.tasks = [...item.tasks, data];
        } 
        return item;
      });
      setLists(newLists);
    }).catch((e) => {
      console.log(e);
    }).finally(() => {
      // setLoading(false);
    
    });
    
  }
  const onRemoveTask = (id) => {
   
    axios.delete("http://localhost:3001/tasks/" + id).then(({ data }) => {
      const newLists = lists.map((item) => {
        item.tasks = item.tasks.filter((item) => {
          return item.id !== id;
        })
        return item;
      });
      setLists(newLists);
    }).catch((e) => {
      console.log(e);
    }).finally(() => {
      // setLoading(false);
    });
  }

  // clg nfn 

  const onCompleteTask = (taskId, newValue) => {
    axios.patch("http://localhost:3001/tasks/" + taskId, { "completed": newValue }).then(({data}) => {
      const newLists = lists.map((list) => {
        list.tasks.map((task) => {
          if (task.id === taskId) {
            task.completed = newValue
          }
          return task
        })
        return list;
      });
      setLists(newLists);

    }).catch((e) => {
    });
  }
  const onEditTitleTask = (taskId, newValue) => {
    axios.patch("http://localhost:3001/tasks/" + taskId, { "text": newValue }).then(({data}) => {
      const newLists = lists.map((list) => {
        list.tasks.map((task) => {
          if (task.id === taskId) {
            task.text = newValue
          }
          return task
        })
        return list;
      });
      setLists(newLists);

    }).catch((e) => {
    });
  }

  
  return (
    <div className="todos-block">
      <div className="todos-sidebar">
        <div
          to="/"
          className={classnames("all-list-btn", { active: selectList === null })}
          onClick={() => history.push("/")}
        >Все задачи</div>
        <div className="list">
          <List
            items={lists && lists.map((item) => {
              let tempColor = colors ? colors.filter((color) => {
                return item.colorId === color.id;
              })[0] : null;
              if (tempColor) {
                item.hexColor = tempColor.title;
              }
              return (
                item
              );
            })}
            selectItem={selectList}
            onSelectItemList={onSelectItemList}
            onRemoveList={onRemoveList}
            isRemovable
          />
        </div>

          <List 
            onClick={()=>{onPopup()}} 
            items={[{ title: "Добавить список" }]} />
          <Popup 
          colors={colors} 
          activePopup={activePopup}
          onAddList={onAddList}
          loading={loading}
        />
        
      </div>
      
      <div className="todos-content">
        

        <Route exact path="/">
          {lists && lists.map((item, index) => {
           return <Tasks 
            key={index} 
            list={item} 
             onAddTask={onAddTask}
             onEditList={onEditList}
             onRemoveTask={onRemoveTask}
             onCompleteTask={onCompleteTask}
             onEditTitleTask={onEditTitleTask}
           />
         })}
        
        </Route>
        
        <Route path="/lists/:id">
          {console.log("ssssssssssss")}
          {lists && lists.map((item, index) => {
            console.log("selectList", selectList);
            if (selectList === item.id) {
              return <Tasks 
              key={index} 
              list={item} 
                onAddTask={onAddTask}
                onEditList={onEditList}
                onRemoveTask={onRemoveTask}
                onCompleteTask={onCompleteTask}
                onEditTitleTask={onEditTitleTask}
              />
            } else {
              return null
            }
            
          })}
        
        </Route>
       
      
      </div>
    
     
      
    </div>


  );
}

export default App;
