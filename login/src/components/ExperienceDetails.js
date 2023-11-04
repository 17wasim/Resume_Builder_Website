import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./mix.css";

const ExperienceDetails = () => {
  const [experienceList, setExperienceList] = useState([
    {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
    },
  ]);

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setExperienceList((prevList) => {
      const newList = [...prevList];
      newList[index][name] = value;
      return newList;
    });
  };

  const handleAddMore = () => {
    setExperienceList((prevList) => [
      ...prevList,
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

	const saveExperienceDetails = async (e) => {
		e.preventDefault();
	
		// Validate the form inputs
		for (const experience of experienceList) {
			if (
				experience.title === "" ||
				experience.company === "" ||
				experience.location === "" ||
				experience.startDate === "" ||
				experience.endDate === ""
			) {
				toast.warning("All fields are required!", {
					position: "top-center",
				});
				return;
			}
	
			try {
				const token = localStorage.getItem("usersdatatoken"); // Get the JWT token from local storage
	
				const response = await fetch("/experience-details", {
					method: "POST",
					body: JSON.stringify({ experienceList }),
					headers: {
						"Content-Type": "application/json",
						Authorization: token, // Include the JWT token in the request header
					},
				});
	
				const data = await response.json();
	
				if (response.ok) {
					toast.success("Experience details saved successfully 😃!", {
						position: "top-center",
					});
					navigate('/skills-details');
				} else {
					toast.error(data.message || "Failed to save experience details. Please try again later.", {
						position: "top-center",
					});
				}
			} catch (error) {
				console.error("Error saving experience details:", error);
				toast.error("Failed to save experience details. Please try again later.", {
					position: "top-center",
				});
			}
		}
	};

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Experience Details</h1>
            <p style={{ textAlign: "center" }}>Please provide your experience information below.</p>
          </div>

          <form>
            {experienceList.map((experience, index) => (
              <div key={index}>
                <div className="form_input">
                  <label htmlFor={`title${index}`}>Job Title</label>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, index)}
                    value={experience.title}
                    name="title"
                    id={`title${index}`}
                    placeholder="Enter Job Title"
                  />
                </div>
                <div className="form_input">
                  <label htmlFor={`company${index}`}>Company</label>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, index)}
                    value={experience.company}
                    name="company"
                    id={`company${index}`}
                    placeholder="Enter Company Name"
                  />
                </div>
                <div className="form_input">
                  <label htmlFor={`location${index}`}>Location</label>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, index)}
                    value={experience.location}
                    name="location"
                    id={`location${index}`}
                    placeholder="Enter Location"
                  />
                </div>
                <div className="form_input">
                  <label htmlFor={`startDate${index}`}>Start Date</label>
                  <input
                    type="date"
                    onChange={(e) => handleChange(e, index)}
                    value={experience.startDate}
                    name="startDate"
                    id={`startDate${index}`}
                  />
                </div>
                <div className="form_input">
                  <label htmlFor={`endDate${index}`}>End Date</label>
                  <input
                    type="date"
                    onChange={(e) => handleChange(e, index)}
                    value={experience.endDate}
                    name="endDate"
                    id={`endDate${index}`}
                  />
                </div>
              </div>
            ))}

            <button type="button" className="btn" onClick={handleAddMore}>
              Add More
            </button>

            <button className="btn" onClick={saveExperienceDetails}>
              Save Details
            </button>

          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  );
};

export default ExperienceDetails;
