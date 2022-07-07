import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ToDo from "../components/ToDo";
import { addToDo } from "../store";

function Home() {
  const [text, setText] = useState("");
  function onChange(e) {
    setText(e.target.value);
  }

  // useSelector()은 getState랑 같은 기능. (store에서 정보를 가져옴)
  // mapStateToProps() 대체
  const toDos = useSelector((state) => state);
  // useDispatch()는 mapDispatchToProps() 대체
  const dispatch = useDispatch();

  function onSubmit(e) {
    e.preventDefault();
    // dispatch로 reducer에게 addToDo하는 동작 호출
    dispatch(addToDo(text));
    setText("");
  }

  return (
    <>
      <h1>To Do</h1>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <button>Add</button>
      </form>
      <ul>
        {toDos.map((toDo) => (
          <ToDo {...toDo} key={toDo.id} />
        ))}
      </ul>
    </>
  );
}

export default Home;
