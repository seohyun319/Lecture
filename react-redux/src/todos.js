import { createStore } from "redux";
const form = document.querySelector("form");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";

// action만 return하는 함수
const addToDo = (text) => {
  return {
    type: ADD_TODO,
    text,
  };
};

const deleteToDo = (id) => {
  return {
    type: DELETE_TODO,
    id,
  };
};

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
      // ...state를 뒤에 둬서 새로 추가한 todo가 맨 앞으로 오게 함
      const newToDoObj = { text: action.text, id: Date.now() };
      return [newToDoObj, ...state];
    case DELETE_TODO:
      // id가 일치하지 않는 애 필터한 새 state return
      // -> 일치하는 애 제외한 나머지만 return해서 삭제한 효과
      const cleaned = state.filter((toDo) => toDo.id !== action.id);
      return cleaned;
    default:
      return state;
  }
};

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));

const dispatchAddToDo = (text) => {
  store.dispatch(addToDo(text));
};

const dispatchDeleteToDo = (e) => {
  const id = parseInt(e.target.parentNode.id);
  store.dispatch(deleteToDo(id));
};

const paintToDos = () => {
  const toDos = store.getState();
  // 추가된 todo는 store에서 getState해왔으니까 store에 계속 쌓여있음.
  // ul 안 비워주면 기존에 적힌 내용까지 지속적으로 쌓임.
  ul.innerHTML = "";
  toDos.forEach((toDo) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerText = "DEL";
    btn.addEventListener("click", dispatchDeleteToDo);
    li.id = toDo.id; // id 부여
    li.innerText = toDo.text;
    li.appendChild(btn);
    ul.appendChild(li); // list item을 list에 추가
  });
};

store.subscribe(paintToDos);

const onSubmit = (e) => {
  e.preventDefault();
  const toDo = input.value;
  input.value = "";
  dispatchAddToDo(toDo);
};

form.addEventListener("submit", onSubmit);
