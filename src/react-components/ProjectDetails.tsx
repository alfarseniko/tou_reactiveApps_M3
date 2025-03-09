import * as React from "react";
import { useState } from "react";
import { ProjectsManager } from "../class/ProjectsManager";
import { Link, Router, useParams } from "react-router-dom";
import Todo from "./Todo";
import EditProjectForm from "./forms/EditProjectForm";
import AddTodoForm from "./forms/AddTodoForm";
import { Project } from "../class/Project";
import ThreeViewer from "./ThreeViewer";

interface Props {
  projectsManager: ProjectsManager;
}

export default function ProjectDetails(props: Props) {
  // Toggle modal function
  function toggleModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal.open) {
      modal.close();
    } else {
      modal.showModal();
    }
  }

  const [projects, setProjects] = useState<Project[]>(
    props.projectsManager.list
  );
  props.projectsManager.onProjectEditted = () => {
    setProjects([...props.projectsManager.list]);
  };
  props.projectsManager.onTodoCreated = () => {
    setProjects([...props.projectsManager.list]);
  };

  const routeParams = useParams<{ id: string }>();
  if (!routeParams.id) {
    console.log("The ID parameter was not found.");
    return;
  } else {
    console.log("The following ID was passed to the page", routeParams.id);
  }
  const project = props.projectsManager.getProject(routeParams.id);
  if (!project) {
    console.warn("The project wasn't found.");
    return;
  } else {
    console.log("The following project was found:", project);
  }

  const todoItems = project.todo.map((todo) => {
    return <Todo todo={todo} />;
  });

  const onEditProjectClick = () => {
    toggleModal("edit-project-modal");
  };

  const onAddTodoClick = () => {
    toggleModal("add-todo-modal");
    console.log(props.projectsManager.getProject);
  };
  return (
    <div className="page" id="project-details">
      <dialog id="edit-project-modal">
        <EditProjectForm projectsManager={props.projectsManager} />
      </dialog>
      <dialog id="add-todo-modal">
        <AddTodoForm projectsManager={props.projectsManager} />
      </dialog>
      <header>
        <div>
          <h2 details-page-info="name-heading">{project.name}</h2>
          <p
            details-page-info="description-heading"
            style={{ color: "#969696" }}
          >
            {project.description}
          </p>
        </div>
      </header>
      <div className="main-page-content">
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
          <div className="dashboard-card" style={{ padding: "30px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 30px",
                marginBottom: 30,
              }}
            >
              <p
                details-page-info="project-initials"
                style={{
                  fontSize: 20,
                  backgroundColor: "#ca8134",
                  aspectRatio: 1,
                  borderRadius: "100%",
                  padding: 12,
                  textTransform: "uppercase",
                }}
              >
                {project.name[0] + project.name[1]}
              </p>
              <button
                id="edit-project-button"
                className="btn-secondary"
                onClick={onEditProjectClick}
              >
                <p style={{ width: "100%" }}>Edit</p>
              </button>
            </div>
            <div style={{ padding: "0 30px" }}>
              <div>
                <h5 details-page-info="name">{project.name}</h5>
                <p details-page-info="description">{project.description}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: 30,
                  padding: "30px 0px",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Status
                  </p>
                  <p details-page-info="status">{project.status}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Cost
                  </p>
                  <p details-page-info="cost">$ 2'542.000</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Role
                  </p>
                  <p details-page-info="role">{project.role}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Finish Date
                  </p>
                  <p details-page-info="finishDate">
                    {project.finishDate.toDateString()}
                  </p>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#404040",
                  borderRadius: 9999,
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    width: "80%",
                    backgroundColor: "green",
                    padding: "4px 0",
                    textAlign: "center",
                  }}
                >
                  {project.progress}
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-card" style={{ flexGrow: 1 }}>
            <div
              style={{
                padding: "20px 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h4>To-Do</h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  columnGap: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: 10,
                  }}
                >
                  <span className="material-icons-round">search</span>
                  <input
                    type="text"
                    placeholder="Search To-Do's by name"
                    style={{ width: "100%" }}
                  />
                </div>
                <span
                  id="add-todo-button"
                  className="material-icons-round"
                  onClick={onAddTodoClick}
                >
                  add
                </span>
              </div>
            </div>
            <div
              id="todo-list"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px 30px",
                rowGap: 20,
              }}
            >
              {todoItems}
            </div>
          </div>
        </div>
        {/**ThreeViewer */}
        <ThreeViewer />
      </div>
    </div>
  );
}
