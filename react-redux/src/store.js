import { configureStore, createSlice } from "@reduxjs/toolkit";

// createSlice()는 reducer 뿐만 아니라 action도 생성함
const toDos = createSlice({
  name: "toDosReducer",
  initialState: [],
  reducers: {
    add: (state, action) => {
      state.push({ text: action.payload, id: Date.now() });
    },
    remove: (state, action) =>
      state.filter((toDo) => toDo.id !== action.payload),
  },
});

// configureStore()을 사용하면 redux developer tools 사용 가능
// 오...대박임... 크롬 개발자도구로 보기! 엣지에선 안 보였음
const store = configureStore({ reducer: toDos.reducer });

export const { add, remove } = toDos.actions;

export default store;
