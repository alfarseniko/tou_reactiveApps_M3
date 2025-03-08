import * as React from "react";

export default function Todo() {
  return (
    <div className="todo-item">
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
          <p>$</p>
        </div>
        <p style={{ textWrap: "nowrap", marginLeft: 10 }}>$</p>
      </div>
    </div>
  );
}
