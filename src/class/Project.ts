/*--------------------IMPORTS-------------------- */
import { v4 as uuidv4 } from "uuid";

/*--------------------EXPORTING TYPES-------------------- */
export type Status = "Pending" | "Active" | "Finished";
export type Role = "Architect" | "Engineer" | "Developer";

/*--------------------EXPORTING INTERFACES-------------------- */
export interface IProject {
  name: string;
  description: string;
  role: Role;
  status: Status;
  finishDate: Date;
}
export interface ITodo {
  description: string;
  status: Status;
  finishDate: Date;
}

/*--------------------EXPORTING CLASS-------------------- */
export class Project implements IProject {
  // Defining variables in a class to satisfy IProject
  name: string;
  description: string;
  status: Status;
  role: Role;
  finishDate: Date;

  // Initiating internal properties
  ui: HTMLDivElement;
  cost: number = Math.random() * 100000000;
  progress: number = Math.random() * 100;
  id: string;
  todo: ITodo[];
  todoUI: HTMLDivElement[];

  /*--------------------CONSTRUCTOR-------------------- */
  constructor(data: IProject, id = uuidv4()) {
    for (const key in data) {
      this[key] = data[key];
    }
    if (this.finishDate instanceof Date && isNaN(this.finishDate.getTime())) {
      this.finishDate = new Date("December 25, 2000 03:24:00");
    }
    this.id = id;
    this.todo = []; // Initialize todo array
    this.todoUI = []; // Initialize todoUI array
  }

  editProject(data: IProject) {
    // time to start working again

    for (const key in data) {
      this[key] = data[key];
    }

    return this;
  }
  addTodo(data: ITodo) {
    // this.setTodoUI(data);
    this.todo.push(data);
  }

  private todoColour(status: Status) {
    if (status == "Active") {
      return "#007bff";
    }
    if (status == "Finished") {
      return "#28a745";
    } else {
      return "#f4c542";
    }
  }

  randomColor() {
    const colors = ["#EDAE49", "#D1495B", "#00798C", "#30638E", "#003D5B"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
