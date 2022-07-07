import React, { useState } from "react";
import { connect } from "react-redux";
import { actionCreators } from "../store";

function Home({ toDos, addToDo }) {
  const [text, setText] = useState("");
  function onChange(e) {
    setText(e.target.value);
  }
  function onSubmit(e) {
    e.preventDefault();
    addToDo(text);
    setText("");
  }
  return (
    <>
      <h1>To Do</h1>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <button>Add</button>
      </form>
      <ul>{JSON.stringify(toDos)}</ul>
    </>
  );
}

// mapStateToProps(state, ownProps?)
function mapStateToProps(state) {
  return { toDos: state };
}

// mapDispatchToProps(dispatch, ownProps?)
// Home에서 props 바꿀 수 있음.
function mapDispatchToProps(dispatch) {
  return {
    // addToDo는 dispatch 호출
    // dispatch는 actionCreators 호출
    addToDo: (text) => dispatch(actionCreators.addToDo(text)),
  };
}

// connect: component를 store에 연결해줌.
// connect(state)(dispatch)
// mapStateToProps로 store에서 받아온 state를 component Home과 함께 가져옴
// redux state로부터 home component에 prop으로 전달
export default connect(mapStateToProps, mapDispatchToProps)(Home);
