import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./mix.css";

const InterestsDetails = () => {
  const [interestsList, setInterestsList] = useState(() => {
    const savedInterests = localStorage.getItem("savedInterests");
    return savedInterests ? JSON.parse(savedInterests) : [{ interest: "" }];
  });

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setInterestsList((prevList) => {
      const newList = [...prevList];
      newList[index][name] = value;
      return newList;
    });
  };

  const handleAddMore = () => {
    setInterestsList((prevList) => [
      ...prevList,
      {
        interest: "",
      },
    ]);
  };

  const saveInterestsDetails = async (e) => {
    e.preventDefault();

    const interestsListAsStrings = interestsList.map((interest) => interest.interest);

    for (const interest of interestsListAsStrings) {
      if (interest === "") {
        toast.warning("All fields are required!", {
          position: "top-center",
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem("usersdatatoken");

      const response = await fetch("/interests-details", {
        method: "POST",
        body: JSON.stringify({ interestsListAsStrings }),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Interests details saved successfully 😃!", {
          position: "top-center",
        });
        navigate('/view-details');
      } else {
        toast.error(data.message || "Failed to save interests details. Please try again later.", {
          position: "top-center",
        });
      }

      // Save the interests to local storage for persistence
      localStorage.setItem("savedInterests", JSON.stringify(interestsList));

    } catch (error) {
      console.error("Error saving interests details:", error);
      toast.error("Failed to save interests details. Please try again later.", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    return () => localStorage.removeItem("savedInterests");
  }, []);

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Interests Details</h1>
            <p style={{ textAlign: "center" }}>Please provide your interests information below.</p>
          </div>

          <form>
            {interestsList.map((interest, index) => (
              <div key={index}>
                <div className="form_input">
                  <label for="interests"htmlFor={`interest${index}`}>Interest</label>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, index)}
                    value={interest.interest}
                    name="interest"
                    id={`interest${index}`}
                    placeholder="Enter Interest"
                  />
                </div>
              </div>
            ))}

            <button type="button" className="btn" onClick={handleAddMore}>
              Add More
            </button>

            <button className="btn" onClick={saveInterestsDetails}>
              Save Details
            </button>

          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  );
};

export default InterestsDetails;
