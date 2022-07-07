import { createStore } from "redux";
import { createAction, createReducer } from "@reduxjs/toolkit";

export const addToDo = createAction("ADD");
export const deleteToDo = createAction("DELETE");

// const reducer = (state = [], action) => {
//   switch (action.type) {
//     // addToDo는 함수이고, addToDo.type은 text인 "ADD"임
//     case addToDo.type:
//       // action에서 넘어온 거는 payload로 받음
//       return [{ text: action.payload, id: Date.now() }, ...state];
//     case deleteToDo.type:
//       return state.filter((toDo) => toDo.id !== action.payload);
//     default:
//       return state;
//   }
// };

// createReducer() 사용하면 state를 mutate하기 쉽게 만듦. switch와 case 사용 안 해도 됨.
// 첫 번째 arg는 initialState
const reducer = createReducer([], {
  // action이 addToDo일 때
  [addToDo]: (state, action) => {
    // state를 mutate함. -> 아무것도 리턴 안 함. state를 mutate만 함.
    state.push({ text: action.payload, id: Date.now() });
  },
  [deleteToDo]: (state, action) =>
    // state를 mutate 안 함. -> 새로운 state return
    state.filter((toDo) => toDo.id !== action.payload),
});

const store = createStore(reducer);

export default store;
