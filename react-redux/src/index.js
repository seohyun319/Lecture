import { createStore } from "redux";

const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.querySelector("span");

// reducer는 data(state)를 수정하는 유일한 함수
// reducer(Modifier)가 return하는 건 application의 data가 됨
// 인자로 state를 받고, 수정된 state return
// count=0 : count의 defaultState는 0
const countModifier = (count = 0) => {
  return count;
};

// store: state를 넣는 곳
// data를 넣을 수 있는 장소를 생성
// store 만들면 안에 reducer 넣어야함
// createStore(reducer);
const countStore = createStore(countModifier);

console.log(countStore.getState());
