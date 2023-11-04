import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './mix.css';
import TextField from '@mui/material/TextField'

const PersonalDetails = () => {
  const [inpval, setInpval] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    aboutMe: '',
    profilePic: null,
  });

  const navigate = useNavigate();

  const setVal = (e) => {
    const { name, value } = e.target;
    setInpval((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setInpval((prev) => ({
        ...prev,
        profilePic: reader.result, // Store the base64 string of the profile picture
      }));
    };

    if (file) {
      reader.readAsDataURL(file); // Read the file as a data URL (base64 string)
    }
  };

  const addUserdata = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, phoneNumber, aboutMe, profilePic } = inpval;

    // Validate the form inputs
    if (firstName === '' || lastName === '' || email === '' || phoneNumber === '' || aboutMe === '') {
      toast.warning('All fields are required!', {
        position: 'top-center',
      });
    } else if (!email.includes('@')) {
      toast.warning('Email must include @!', {
        position: 'top-center',
      });
    } else {
      try {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('phoneNumber', phoneNumber);
        formData.append('aboutMe', aboutMe);
        formData.append('profilePic', profilePic);

        const token = localStorage.getItem('usersdatatoken'); // Get the JWT token from local storage

        const response = await fetch('/profile-details', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': token, // Include the JWT token in the request header
          },
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('Profile details saved successfully 😃!', {
            position: 'top-center',
          });
          setInpval({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            aboutMe: '',
            profilePic: null,
          });
        } else {
          toast.error(data.message || 'Failed to save profile details. Please try again later.', {
            position: 'top-center',
          });
        }
      } catch (error) {
        console.error('Error saving profile details:', error);
        toast.error('Failed to save profile details. Please try again later.', {
          position: 'top-center',
        });
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Personal Details</h1>
            <p style={{ textAlign: 'center' }}>Please provide your personal information below.</p>
          </div>

          <form>
            <div className="form_input">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                onChange={setVal}
                value={inpval.firstName}
                name="firstName"
                id="firstName"
                placeholder="Enter Your First Name"
              />
            </div>
            <div className="form_input">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                onChange={setVal}
                value={inpval.lastName}
                name="lastName"
                id="lastName"
                placeholder="Enter Your Last Name"
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                onChange={setVal}
                value={inpval.email}
                name="email"
                id="email"
                placeholder="Enter Your Email Address"
              />
            </div>
            <div className="form_input">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                onChange={setVal}
                value={inpval.phoneNumber}
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Enter Your Phone Number"
              />
            </div>
            <div className="form_input">
              <label htmlFor="aboutMe">About Me</label>
              <textarea
                rows="15"
                cols="56"
                value={inpval.aboutMe}
                onChange={setVal}
                name="aboutMe"
                id="aboutMe"
                placeholder="Tell us something about yourself..."
              />
            </div>

            <div className="form_input">
              <label htmlFor="profilePic">Profile Picture</label>
              <input type="file" onChange={handleProfilePicChange} name="profilePic" id="profilePic" />
            </div>

            <button className="btn" onClick={addUserdata}>
              Save Details
            </button>
            <button className="btn" onClick={() => navigate('/education-details')}>
              Next
            </button>
          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  );
};

export default PersonalDetails;
