import * as React from "react";
import * as Firestore from "firebase/firestore";
import { getCollection } from "../firebase/index";
import { Link } from "react-router-dom";
import { ErrorPopup } from "../class/ErrorPopup";
import { Project, IProject, Role, Status } from "../class/Project";
import { ProjectsManager } from "../class/ProjectsManager";
import { ProjectCard } from "./ProjectCard";
import SearchBox from "./SearchBox";
import { useState, useEffect } from "react";

interface Props {
  projectsManager: ProjectsManager;
}

export function ProjectsPage(props: Props) {
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
  props.projectsManager.onProjectCreated = () => {
    setProjects([...props.projectsManager.list]);
  };

  const collection = getCollection<IProject>("/projects");

  const getFirestorProjects = async () => {
    const document = await Firestore.getDocs(collection);
    for (const doc of document.docs) {
      const data = doc.data();
      const projectData: IProject = {
        ...data,
        finishDate: (
          data.finishDate as unknown as Firestore.Timestamp
        ).toDate(),
      };
      try {
        props.projectsManager.newProject(projectData, doc.id);
      } catch {
        props.projectsManager.editProject(doc.id, projectData);
      }
    }
  };

  useEffect(() => {
    getFirestorProjects();
  }, []);

  const projectCards = projects.map((project) => {
    return (
      <Link to={`/project/${project.id}`} key={project.id}>
        <ProjectCard project={project} />
      </Link>
    );
  });

  const onNewProjectClick = () => {
    toggleModal("new-project-modal");
  };

  const onExport = () => {
    props.projectsManager.exportAsJSON();
    console.log("Projects exported.");
  };
  const onImport = () => {
    props.projectsManager.importFromJSON();
    console.log("Projects imported.");
  };

  const onProjectSearch = (value: string) => {
    setProjects(props.projectsManager.filterProjects(value));
  };

  const onNewProjectSubmit = (e: React.FormEvent) => {
    const projectForm = document.getElementById("new-project-form");
    // Checking if form exists and if it is of correct data type
    if (!(projectForm && projectForm instanceof HTMLFormElement)) {
      return;
    }
    // Preventing default behaviour of form
    e.preventDefault();
    const formData = new FormData(projectForm);
    // Initializing an object of type IProject to store project data
    let data: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      role: formData.get("role") as Role,
      status: formData.get("status") as Status,
      finishDate: new Date(formData.get("finishDate") as string),
    };
    try {
      Firestore.addDoc(collection, data);
      // Calling NEWPROJECT function
      props.projectsManager.newProject(data);
      projectForm.reset();
      toggleModal("new-project-modal");
    } catch (err) {
      new ErrorPopup(err.message);
    }
  };

  return (
    <div className="page" id="projects-page" style={{ display: "flex" }}>
      <dialog id="new-project-modal">
        <form
          onSubmit={(e) => {
            onNewProjectSubmit(e);
          }}
          id="new-project-form"
        >
          <h2>New Project</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">apartment</span>Name
              </label>
              <input
                required
                name="name"
                type="text"
                placeholder="What's the name of your project?"
              />
              <p
                style={{
                  color: "gray",
                  fontSize: "var(--font-sm)",
                  marginTop: 5,
                  fontStyle: "italic",
                }}
              >
                TIP: Give it a short name
              </p>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">subject</span>
                Description
              </label>
              <textarea
                name="description"
                cols={30}
                rows={5}
                placeholder="Give your project a nice description! So people is jealous about it."
                defaultValue={""}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">person</span>Role
              </label>
              <select required name="role">
                <option>Architect</option>
                <option>Engineer</option>
                <option>Developer</option>
              </select>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">
                  not_listed_location
                </span>
                Status
              </label>
              <select required name="status">
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
              <input required name="finishDate" type="date" />
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px 10px auto",
                columnGap: 10,
              }}
            >
              <button
                id="close-button-form"
                type="button"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: "rgb(18, 145, 18)" }}
              >
                Accept
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <header>
        <h2>Projects</h2>
        <SearchBox onChange={onProjectSearch} />
        <div id="header-button-container">
          <div id="up-down-buttons">
            <button onClick={onExport} id="export-button">
              <img src="./assets/upload-icon.svg" alt="" />
            </button>
            <button onClick={onImport} id="import-button">
              <img src="./assets/download-icon.svg" alt="" />
            </button>
          </div>
          <div>
            <button onClick={onNewProjectClick} id="new-project-btn">
              <span className="material-icons-round">add</span>New Project
            </button>
          </div>
        </div>
      </header>
      {projectCards.length > 0 ? (
        <div id="projects-list">{projectCards}</div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "75%",
            textAlign: "center",
          }}
        >
          <p>
            <p style={{ fontSize: "x-large" }}>Oops!</p>
            <br />
            <p style={{ fontSize: "large" }}>No projects were found.</p>
          </p>
        </div>
      )}
    </div>
  );
}
