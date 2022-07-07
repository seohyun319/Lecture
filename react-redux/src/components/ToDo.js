import React from "react";
import { Link } from "react-router-dom";
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
      <Link to={`/${id}`}>
        {text} <button onClick={onClick}>DEL</button>
      </Link>
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
