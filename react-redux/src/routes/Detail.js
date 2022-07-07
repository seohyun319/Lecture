import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Detail() {
  //클릭된 리스트의 아이디값을 가져옴
  const id = useParams().id;

  const toDos = useSelector((state) => state);
  // id가 일치하는 애 들고옴
  const toDo = toDos.find((toDo) => toDo.id === parseInt(id));

  return (
    <>
      <h1>{toDo?.text}</h1>
      <h5>Created at: {toDo?.id}</h5>
    </>
  );
}

export default Detail;
