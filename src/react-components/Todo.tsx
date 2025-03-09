/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";
import { ITodo, Project, Status } from "../class/Project";
import { todoColour } from "../class/HelperFunctions";

/** ################################################### */
/*--------------------INTERFACES----------------------- */
/** ################################################### */
interface Props {
  todo: ITodo;
}

/** ################################################### */
/*--------------------REACT FUNCTION------------------- */
/** ################################################### */
export default function Todo(props: Props) {
  /** ################################################### */
  /*--------------------JSX RETURN VALUE----------------- */
  /** ################################################### */
  return (
    <div
      className="todo-item"
      style={{ backgroundColor: todoColour(props.todo.status) }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", columnGap: 15, alignItems: "center" }}>
          <span
            className="material-icons-round"
            style={{
              padding: 10,
              backgroundColor: "#686868",
              borderRadius: 10,
            }}
          >
            construction
          </span>
          <p>{props.todo.description}</p>
        </div>
        <p style={{ textWrap: "nowrap", marginLeft: 10 }}>
          {props.todo.finishDate.toDateString()}
        </p>
      </div>
    </div>
  );
}
