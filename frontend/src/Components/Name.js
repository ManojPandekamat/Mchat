import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Card.css"

function Name() {

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        paddingTop: "1rem",
        paddingLeft: "1rem",
      }}

      className="name"
    >
      <Link
        to={"/"}
        style={{
          textDecoration: "none",
        }}
      >
        <div  style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "2rem",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textDecoration: "none",
          color: "#4a4a4a",
        }}>
          <span style={{ color: "#ff9e7c" }}>M</span>Chat
        </div>
      </Link>
    </div>
  );
}

export default Name;

