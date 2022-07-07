import { createStore } from "redux";
const form = document.querySelector("form");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";

// store를 수정할 수 있는 유일한 방법은 action을 보내는 것.
// state를 mutate하면 안 되고 new state objects를 return해야 함.
// mutate: 기존 상태 수정
// 반드시 새 state를 만들어야서 return해야함. 기존 거 건드리면 안 됨.
const reducer = (state = [], action) => {
  console.log(action);
  switch (action.type) {
    case ADD_TODO:
      // 이전 state와 새 TODO를 가짐
      // 이전 array의 object들과 새 object를 합쳐 새 array를 만듦
      return [...state, { text: action.text, id: Date.now() }];
    case DELETE_TODO:
      return [];
    default:
      return state;
  }
};

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));

const onSubmit = (e) => {
  e.preventDefault();
  const toDo = input.value;
  input.value = "";
  store.dispatch({ type: ADD_TODO, text: toDo });
};

form.addEventListener("submit", onSubmit);
