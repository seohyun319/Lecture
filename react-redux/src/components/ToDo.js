import React from "react";
import { useDispatch } from "react-redux";
import { deleteToDo } from "../store";

function ToDo({
  text,
  id,
  // , onBtnClick
}) {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(deleteToDo(id));
  };

  return (
    <li>
      {text} <button onClick={onClick}>DEL</button>
    </li>
  );
}

// function mapDispatchToProps(dispatch, ownProps) {
//   return {
//     onBtnClick: () => dispatch(actionCreators.deleteToDo(ownProps.id)),
//   };
// }

// export default connect(null, mapDispatchToProps)(ToDo);
export default ToDo;
