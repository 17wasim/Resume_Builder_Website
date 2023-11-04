import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./mix.css"; // Import your custom CSS styles for the form
import { useParams } from 'react-router-dom';      

const ModifyPassword = () => {

	const { id } = useParams();

	const [userId, setUserId] = useState("");

	

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const toggleShowPassword = (field) => {
    if (field === "oldPassword") {
      setShowOldPassword((prevShow) => !prevShow);
    } else if (field === "newPassword") {
      setShowNewPassword((prevShow) => !prevShow);
    } else if (field === "confirmNewPassword") {
      setShowConfirmPassword((prevShow) => !prevShow);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmNewPassword } = formData;

    // Check if the new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.", {
        position: "top-center"
      });
      return;
    }

    try {
      // Get the token from the URL parameters
      const token = window.location.pathname.split("/").pop();

      // Send a POST request to the server to update the password
      const res = await fetch(`/modify-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });

      const data = await res.json();

      if (data.status === 201) {
        // If the password is updated successfully, display a success message
        toast.success("Password updated successfully!", {
          position: "top-center"
        });

        // Clear the form fields after successful password update
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });
      } else {
        // If there is an error while updating the password, display an error message using toast
        toast.error("Error updating the password. Please try again later.", {
          position: "top-center"
        });
      }
    } catch (error) {
      console.error("Error updating the password:", error);
    }
  };

  return (
    <section>
      <div className="form_data">
        <div className="form_heading">
          <h1>Modify Password</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form_input">
            <label htmlFor="oldPassword">Old Password:</label>
            <div className="two">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
              <div
                className="showpass"
                onClick={() => toggleShowPassword("oldPassword")}
              >
                {showOldPassword ? "Hide" : "Show"}
              </div>
            </div>
          </div>
          <div className="form_input">
            <label htmlFor="newPassword">New Password:</label>
            <div className="two">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <div
                className="showpass"
                onClick={() => toggleShowPassword("newPassword")}
              >
                {showNewPassword ? "Hide" : "Show"}
              </div>
            </div>
          </div>
          <div className="form_input">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <div className="two">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                required
              />
              <div
                className="showpass"
                onClick={() => toggleShowPassword("confirmNewPassword")}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </div>
            </div>
          </div>
          <button type="submit" className="btn">Submit</button>
        </form>
        <ToastContainer />
      </div>
    </section>
  );
};

export default ModifyPassword;
