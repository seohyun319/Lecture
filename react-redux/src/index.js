import { createStore } from "redux";

// store 생성 ->
// store 인자인 reducer는 state 수정 ->
// reducer는 인자로 현재 state와 action을 받고 변경된 state return
// dispatch가 reducer 불러 current state와 action을 더함
// 변경 사항을 store에서 감지하고 싶으면 subscribe 하면 됨.

const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.querySelector("span");

number.innerText = 0;

// 실수 방지를 위해 변수로 선언
const ADD = "ADD";
const MINUS = "MINUS";

// reducer는 data(state)를 수정하는 유일한 함수
// reducer(Modifier)가 return하는 건 application의 data가 됨
// 인자로 state를 받고, 수정된 state return
// count=0 : count의 defaultState는 0
const countModifier = (count = 0, action) => {
  switch (action.type) {
    case ADD:
      return count + 1;
    case MINUS:
      return count - 1;
    default:
      return count;
  }
};

// store: state를 넣는 곳
// data를 넣을 수 있는 장소를 생성
// store 만들면 안에 reducer 넣어야함
// createStore(reducer);
const countStore = createStore(countModifier);

const onChange = () => {
  number.innerText = countStore.getState();
};

// subscribe: store 안의 변화를 알 수 있게 해줌
countStore.subscribe(onChange);

// dispatch: reducer에게 특정 동작 하라고 action 보냄.
// dispatch 인자에 action 넘김.
const handleAdd = () => {
  // action은 {type: "ADD"}. object여야 함, string 불가. 무조건 type이 있어야 함.
  countStore.dispatch({ type: ADD });
};

const handleMinus = () => {
  countStore.dispatch({ type: MINUS });
};

add.addEventListener("click", handleAdd);
minus.addEventListener("click", handleMinus);
