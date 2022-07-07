import React, { useState } from "react";
import { connect } from "react-redux";

function Home({ toDos }) {
  const [text, setText] = useState("");
  function onChange(e) {
    setText(e.target.value);
  }
  function onSubmit(e) {
    e.preventDefault();
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

// connect: component를 store에 연결해줌.
// connect(state)(dispatch)
// mapStateToProps로 store에서 받아온 state를 component Home과 함께 가져옴
// redux state로부터 home component에 prop으로 전달
export default connect(mapStateToProps)(Home);
