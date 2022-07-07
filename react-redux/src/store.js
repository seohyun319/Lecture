import { createStore } from "redux";
import { createAction } from "@reduxjs/toolkit";

export const addToDo = createAction("ADD");
export const deleteToDo = createAction("DELETE");

const reducer = (state = [], action) => {
  switch (action.type) {
    // addToDo는 함수이고, addToDo.type은 text인 "ADD"임
    case addToDo.type:
      // action에서 넘어온 거는 payload로 받음
      return [{ text: action.payload, id: Date.now() }, ...state];
    case deleteToDo.type:
      return state.filter((toDo) => toDo.id !== action.payload);
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
