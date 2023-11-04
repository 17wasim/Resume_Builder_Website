import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./mix.css";

const CertificationsDetails = () => {
  const [certificationsList, setCertificationsList] = useState([
    {
      certificationName: "",
      issuedBy: "",
      issueDate: "",
    },
  ]);

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setCertificationsList((prevList) => {
      const newList = [...prevList];
      newList[index][name] = value;
      return newList;
    });
  };

  const handleAddMore = () => {
    setCertificationsList((prevList) => [
      ...prevList,
      {
        certificationName: "",
        issuedBy: "",
        issueDate: "",
      },
    ]);
  };

  const saveCertificationsDetails = async (e) => {
    e.preventDefault();

    // Validate the form inputs
    for (const certification of certificationsList) {
      if (
        certification.certificationName === "" ||
        certification.issuedBy === "" ||
        certification.issueDate === ""
      ) {
        toast.warning("All fields are required!", {
          position: "top-center",
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem("usersdatatoken"); // Get the JWT token from local storage

      const response = await fetch("/certifications-details", {
        method: "POST",
        body: JSON.stringify({certificationsList}),
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Include the JWT token in the request header
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Certifications details saved successfully 😃!", {
          position: "top-center",
        });
				navigate('/interests-details');
      } else {
        toast.error(data.message || "Failed to save certifications details. Please try again later.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error saving certifications details:", error);
      toast.error("Failed to save certifications details. Please try again later.", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Certifications Details</h1>
            <p style={{ textAlign: "center" }}>Please provide your certifications information below.</p>
          </div>

          <form>
            {certificationsList.map((certification, index) => (
              <div key={index}>
                <div className="form_input">
                  <label htmlFor={`certificationName${index}`}>Certification Name</label>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, index)}
                    value={certification.certificationName}
                    name="certificationName"
                    id={`certificationName${index}`}
                    placeholder="Enter Certification Name"
                  />
                </div>
                <div className="form_input">
                  <label htmlFor={`issuedBy${index}`}>Issued By</label>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, index)}
                    value={certification.issuedBy}
                    name="issuedBy"
                    id={`issuedBy${index}`}
                    placeholder="Enter Issuing Authority"
                  />
                </div>
                <div className="form_input">
                  <label htmlFor={`issueDate${index}`}>Issue Date</label>
                  <input
                    type="date"
                    onChange={(e) => handleChange(e, index)}
                    value={certification.issueDate}
                    name="issueDate"
                    id={`issueDate${index}`}
                  />
                </div>
              </div>
            ))}

            <button type="button" className="btn" onClick={handleAddMore}>
              Add More
            </button>

            <button className="btn" onClick={saveCertificationsDetails}>
              Save Details
            </button>

          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  );
};

export default CertificationsDetails;
