import React, { useState } from "react";
import "../styles/Register.css";
import RegisterSchool from "../component/RegisterSchool";
import RegisterStudent from "../component/RegisterStudent";

const Register = () => {
  const [active, setActive] = useState("student");

  return (
    <div className="container-register">
      <div className="container-content-register">
        <div className="block-register">
          <div className="content-button">
            <button
              className={`student ${active === "student" ? "active" : ""}`}
              onClick={() => setActive("student")}
            >
              Élève
            </button>
            <button
              className={`school ${active !== "student" ? "active" : ""}`}
              onClick={() => setActive("school")}
            >
              Établissement
            </button>
          </div>

          {/* Section Élève */}
          {active === "student" && (
            <RegisterStudent />
          )}

          {/* Section Établissement */}
          {active === "school" && (
            <RegisterSchool />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
