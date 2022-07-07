import { createStore } from "redux";

const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.querySelector("span");

number.innerText = 0;

// reducer는 data(state)를 수정하는 유일한 함수
// reducer(Modifier)가 return하는 건 application의 data가 됨
// 인자로 state를 받고, 수정된 state return
// count=0 : count의 defaultState는 0
const countModifier = (count = 0, action) => {
  console.log(count, action);
  if (action.type === "ADD") {
    return count + 1;
  } else if (action.type === "MINUS") {
    return count - 1;
  } else {
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
  // action은 {type: "ADD"}
  countStore.dispatch({ type: "ADD" });
};

const handleMinus = () => {
  countStore.dispatch({ type: "MINUS" });
};

add.addEventListener("click", handleAdd);
minus.addEventListener("click", handleMinus);
