import * as React from "react";
import { ITodo, Project, Status } from "../../class/Project";
import { ProjectsManager } from "../../class/ProjectsManager";
import { ErrorPopup } from "../../class/ErrorPopup";

interface Props {
  projectsManager: ProjectsManager;
}

export default function AddTodoForm(props: Props) {
  // Toggle modal function
  function toggleModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal.open) {
      modal.close();
    } else {
      modal.showModal();
    }
  }

  const onTodoFormSubmit = (e: React.FormEvent) => {
    const todoForm = document.getElementById(
      "add-todo-form"
    ) as HTMLFormElement;
    if (!(todoForm instanceof HTMLFormElement)) {
      return;
    }

    e.preventDefault();
    const formData = new FormData(todoForm);
    // Initializing an object of type IProject to store project data
    let data: ITodo = {
      description: formData.get("description") as string,
      status: formData.get("status") as Status,
      finishDate: new Date(formData.get("finishDate") as string),
    };
    try {
      // Calling NEWPROJECT function
      props.projectsManager.addTodo(data, props.projectsManager.currentProject);
      todoForm.reset();
      toggleModal("add-todo-modal");
    } catch (err) {
      new ErrorPopup(err.message);
    }
  };

  return (
    <form id="add-todo-form" onSubmit={onTodoFormSubmit}>
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
