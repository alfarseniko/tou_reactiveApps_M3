import * as React from "react";

export function Sidebar() {
  return (
    <aside id="sidebar">
      <img
        id="company-logo"
        src="./assets/company-logo.svg"
        alt="Construction Company"
      />
      <ul id="nav-buttons">
        <li id="projects-button">
          <span className="material-icons-round">apartment</span>Projects
        </li>
        <li id="users-button">
          <span className="material-icons-round">people</span>Users
        </li>
      </ul>
    </aside>
  );
}
