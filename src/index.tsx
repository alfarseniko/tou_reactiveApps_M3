/** ################################################### */
/*--------------------IMPORTS-------------------- */
/** ################################################### */
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as Router from "react-router-dom";
import { Sidebar } from "./react-components/Sidebar";
import { ProjectsPage } from "./react-components/ProjectsPage";
import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IProject, Role, Status } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";
import { ErrorPopup } from "./class/ErrorPopup";
import { ITodo } from "./class/Project";
import ProjectDetails from "./react-components/ProjectDetails";

/** ################################################### */
/*--------------------REACT---------------------------- */
/** ################################################### */

//Initializing projectsManager for global use
const projectsManager = new ProjectsManager();

const rootElement = document.getElementById("app") as HTMLDivElement;
const appRoot = ReactDOM.createRoot(rootElement);
appRoot.render(
  <>
    <Router.BrowserRouter>
      <Sidebar />
      <Router.Routes>
        <Router.Route
          path="/"
          element={<ProjectsPage projectsManager={projectsManager} />}
        />
        <Router.Route
          path="/project/:id"
          element={<ProjectDetails projectsManager={projectsManager} />}
        />
      </Router.Routes>
    </Router.BrowserRouter>
  </>
);

/** ################################################### */
/*--------------------FUNCTIONS-------------------- */
/** ################################################### */
function toggleModal(id: string) {
  const modal = document.getElementById(id) as HTMLDialogElement;
  if (modal.open) {
    modal.close();
  } else {
    modal.showModal();
  }
}

/** ################################################### */
// Event listener for showing new project modal
/** ################################################### */
const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    toggleModal("new-project-modal");
    const closeButton = document.getElementById(
      "close-button-form"
    ) as HTMLButtonElement;
    closeButton.addEventListener("click", () => {
      toggleModal("new-project-modal");
    });
  });
} else {
  console.warn("The new project button was not found!");
}

/** ################################################### */
/*----------------PROJECTS MANAGER CLASS-------------------- */
/** ################################################### */
const projectsListUi = document.getElementById("projects-list") as HTMLElement;

/** ################################################### */
/*----------------IMPORT/EXPORT BUTTONS-------------------- */
/** ################################################### */
const exportButton = document.getElementById(
  "export-button"
) as HTMLButtonElement;
if (exportButton) {
  exportButton.addEventListener("click", () => {
    projectsManager.exportAsJSON();
  });
}
const importButton = document.getElementById(
  "import-button"
) as HTMLButtonElement;
if (importButton) {
  importButton.addEventListener("click", () => {
    projectsManager.importFromJSON();
    console.log("all good");
  });
}

/** ################################################### */
/*------------BUTTON TO GO BACK TO MAIN PAGE----------- */
/** ################################################### */

const projectsButton = document.getElementById(
  "projects-button"
) as HTMLDataListElement;
// projectsButton.addEventListener("click", () => {
//   const projectsPage = document.getElementById("projects-page");
//   const detailsPage = document.getElementById("project-details");
//   if (!projectsPage || !detailsPage) {
//     return;
//   }
//   projectsPage.style.display = "flex";
//   detailsPage.style.display = "none";
// });
/** ################################################### */
/*----------BUTTON TO OPEN EDIT PROJECT FORM----------- */
/** ################################################### */
const editProjectButton = document.getElementById(
  "edit-project-button"
) as HTMLButtonElement;
if (editProjectButton) {
  editProjectButton.addEventListener("click", () => {
    toggleModal("edit-project-modal");
    const closeButton = document.getElementById(
      "close-button-edit-form"
    ) as HTMLButtonElement;
    closeButton.addEventListener("click", () => {
      toggleModal("edit-project-modal");
    });
  });
} else {
  console.warn("The edit project button was not found!");
}

/** ################################################### */
/**-----------------------NEW PROJECT------------------ */
/** ################################################### */

/*----------------Getting Form Data NEW PROJECT----------------- */
const projectForm = document.getElementById("new-project-form");
// Checking if form exists and if it is of correct data type
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
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
      // Calling NEWPROJECT function
      const project = projectsManager.newProject(data);
      projectForm.reset();
      toggleModal("new-project-modal");
      console.log(project);
    } catch (err) {
      new ErrorPopup(err.message);
    }
  });
} else {
  // WARNING in case of not finding the required form
  console.warn(
    "The project form was not found! The project form:",
    projectForm
  );
}

/** ################################################### */
/**-----------------------EDIT PROJECT----------------- */
/** ################################################### */

/*----------------Getting Form Data EDIT PROJECT----------------- */
const editForm = document.getElementById(
  "edit-project-form"
) as HTMLFormElement;
if (editForm) {
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(editForm);
    // Initializing an object of type IProject to store project data
    let data: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      role: formData.get("role") as Role,
      status: formData.get("status") as Status,
      finishDate: new Date(formData.get("finishDate") as string),
    };
    try {
      // Calling NEWPROJECT function
      projectsManager.editProject(projectsManager.currentProject, data);
      editForm.reset();
      toggleModal("edit-project-modal");
    } catch (err) {
      new ErrorPopup(err.message);
    }
  });
} else {
  console.warn("The edit form was not found.");
}

/** ################################################### */
/**-----------------------TODO------------------------- */
/** ################################################### */
const addTodoButton = document.getElementById(
  "add-todo-button"
) as HTMLSpanElement;
addTodoButton.addEventListener("click", () => {
  toggleModal("add-todo-modal");
});
const todoForm = document.getElementById("add-todo-form") as HTMLFormElement;
if (todoForm) {
  todoForm.addEventListener("submit", (e) => {
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
      projectsManager.addTodo(data, projectsManager.currentProject);
      editForm.reset();
      toggleModal("add-todo-modal");
    } catch (err) {
      new ErrorPopup(err.message);
    }
  });
} else {
  console.warn("The edit form was not found.");
}

/** ################################################### */
/**---------------------THREE-------------------------- */
/** ################################################### */

const scene = new THREE.Scene();

const viewerContainer = document.getElementById(
  "viewer-container"
) as HTMLDivElement;
if (!viewerContainer) {
  console.error("Viewer container not found!");
}
const containerDimensions = viewerContainer.getBoundingClientRect();

const fov = 75;
const camera = new THREE.PerspectiveCamera(fov);
camera.position.z = 5;
camera.near = 0.0001;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
function resizeViewer() {
  const containerDimensions = viewerContainer.getBoundingClientRect();
  renderer.setSize(containerDimensions.width, containerDimensions.height);
  camera.aspect = containerDimensions.width / containerDimensions.height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", () => resizeViewer());
resizeViewer();
viewerContainer.append(renderer.domElement);
renderer.setSize(containerDimensions.width, containerDimensions.height);

const boxGeometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial();
const cube = new THREE.Mesh(boxGeometry, material);

const directionalLightTop = new THREE.DirectionalLight();
const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.4;
const spotLight = new THREE.SpotLight();

scene.add(ambientLight, directionalLightTop, spotLight);

const cameraControls = new OrbitControls(camera, viewerContainer);

function renderScene() {
  renderer.render(scene, camera);
  requestAnimationFrame(renderScene);
}

renderScene();

const dirLightTopHelper = new THREE.DirectionalLightHelper(
  directionalLightTop,
  0
);

const axes = new THREE.AxesHelper();
const grid = new THREE.GridHelper();
grid.material.transparent = true;
grid.material.opacity = 0.5;
grid.material.color = new THREE.Color("#fff");

scene.add(axes, grid, dirLightTopHelper);

/*const gui = new GUI();
const cubeControls = gui.addFolder("Cube");
cubeControls.add(cube.position, "x", -10, 10, 0.1);
cubeControls.add(cube.position, "y", -10, 10, 0.1);
cubeControls.add(cube.position, "z", -10, 10, 0.1);
cubeControls.add(cube, "visible");
cubeControls.addColor(cube.material, "color");
const dirLightControls = gui.addFolder("Directional Light");
dirLightControls.addColor(directionalLightTop, "color");
dirLightControls.add(directionalLightTop.position, "x", -10, 10, 0.1);
dirLightControls.add(directionalLightTop.position, "y", -10, 10, 0.1);
dirLightControls.add(directionalLightTop.position, "z", -10, 10, 0.1);
dirLightControls.add(directionalLightTop, "intensity", 0, 1, 0.1);
const spotLightControls = gui.addFolder("Spot Light");
spotLightControls.addColor(spotLight, "color");
spotLightControls.add(spotLight.position, "x", -10, 10, 0.1);
spotLightControls.add(spotLight.position, "y", -10, 10, 0.1);
spotLightControls.add(spotLight.position, "z", -10, 10, 0.1);
spotLightControls.add(spotLight, "intensity", 0, 1, 0.1);

const loader = new GLTFLoader();
loader.load("../assets/carModel/scene.gltf", (gltf) => {
  scene.add(gltf.scene);
});*/
