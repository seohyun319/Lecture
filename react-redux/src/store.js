import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";

export const addToDo = createAction("ADD");
export const deleteToDo = createAction("DELETE");

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

// configureStore()을 사용하면 redux developer tools 사용 가능
// 오...대박임... 크롬 개발자도구로 보기! 엣지에선 안 보였음
const store = configureStore({ reducer });

export default store;
