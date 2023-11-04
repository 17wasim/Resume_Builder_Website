import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./mix.css";

const SkillsDetails = () => {
  const [skillsList, setSkillsList] = useState([
    {
      skillName: "",
      proficiency: "",
    },
  ]);

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setSkillsList((prevList) => {
      const newList = [...prevList];
      newList[index][name] = value;
      return newList;
    });
  };

  const handleAddMore = () => {
    setSkillsList((prevList) => [
      ...prevList,
      {
        skillName: "",
        proficiency: "",
      },
    ]);
  };

  const saveSkillsDetails = async (e) => {
    e.preventDefault();

    // Validate the form inputs
    for (const skill of skillsList) {
      if (skill.skillName === "" || skill.proficiency === "") {
        toast.warning("All fields are required!", {
          position: "top-center",
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem("usersdatatoken"); // Get the JWT token from local storage

      const response = await fetch("/skills-details", {
        method: "POST",
        body: JSON.stringify({skillsList}),
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Include the JWT token in the request header
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Skills details saved successfully 😃!", {
          position: "top-center",
        });
				navigate('/certifications-details');
      } else {
        toast.error(data.message || "Failed to save skills details. Please try again later.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error saving skills details:", error);
      toast.error("Failed to save skills details. Please try again later.", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Skills Details</h1>
            <p style={{ textAlign: "center" }}>Please provide your skills information below.</p>
          </div>

          <form>
            {skillsList.map((skill, index) => (
              <div key={index}>
                <div className="form_input">
                  <label htmlFor={`skillName${index}`}>Skill Name</label>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, index)}
                    value={skill.skillName}
                    name="skillName"
                    id={`skillName${index}`}
                    placeholder="Enter Skill Name"
                  />
                </div>
                <div className="form_input">
                  <label htmlFor={`proficiency${index}`}>Proficiency</label>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, index)}
                    value={skill.proficiency}
                    name="proficiency"
                    id={`proficiency${index}`}
                    placeholder="Enter Proficiency Level"
                  />
                </div>
              </div>
            ))}

            <button type="button" className="btn" onClick={handleAddMore}>
              Add More
            </button>

            <button className="btn" onClick={saveSkillsDetails}>
              Save Details
            </button>
          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  );
};

export default SkillsDetails;
