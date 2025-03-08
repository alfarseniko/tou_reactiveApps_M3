import * as React from "react";

export default function AddTodoForm() {
  return (
    <form id="add-todo-form">
      <h2>ToDo</h2>
      <div className="input-list">
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">subject</span>
            Description
          </label>
          <textarea
            name="description"
            cols={30}
            rows={2}
            placeholder="Describe your task in detail."
            defaultValue={""}
          />
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">not_listed_location</span>
            Status
          </label>
          <select name="status">
            <option>Pending</option>
            <option>Active</option>
            <option>Finished</option>
          </select>
        </div>
        <div className="form-field-container">
          <label htmlFor="finishDate">
            <span className="material-icons-round">calendar_month</span>
            Finish Date
          </label>
          <input name="finishDate" type="date" />
        </div>
        <div
          style={{
            display: "flex",
            margin: "10px 0px 10px auto",
            columnGap: 10,
          }}
        >
          <button
            id="close-button-edit-form"
            type="button"
            style={{ backgroundColor: "transparent" }}
          >
            Cancel
          </button>
          <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
            Accept
          </button>
        </div>
      </div>
    </form>
  );
}
