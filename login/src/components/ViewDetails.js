import React, { useEffect, useState } from 'react';
import './ViewDetails.css';

const ViewDetails = () => {
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		// Fetch user data from the server
		const fetchUserData = async () => {
			try {
				const token = localStorage.getItem('usersdatatoken'); // Get the JWT token from local storage

				const response = await fetch('/validuser', {
					method: 'GET',
					headers: {
						Authorization: token, // Include the JWT token in the request header
					},
				});

				const data = await response.json();
				if (response.ok) {
					setUserData(data.ValidUserOne);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, []);

	if (!userData) {
		return <p>Loading...</p>;
	}

	return (
		<div className="resume-container">
			<div className="personal-details">
				<h2><div className="name">{userData.fname}</div></h2>
				<p><div className="personal-subhead"> {userData.email}</div></p>
				<p> <div className="personal-subhead"> {userData.phoneNumber} </div> </p>
				{/* <p>About Me: {userData.aboutMe}</p> */}
				{userData.profilePic && (
					<img
						src={userData.profilePic}
						alt="Profile Pic"
						className="profile-pic"
					/>
				)}
			</div>

			<div className="section-container">
				<div className="left-side">
					<div className="about-details">
						<h2>About Me</h2>
						<p>{userData.aboutMe}</p>
					</div>

					<div className="experience-details">
					<h2>Experience</h2>
					{userData.experience.map((exp, index) => (
						<div key={index}>
							<p><span className="subhead">Title:</span> {exp.title}</p>
							<p><span className="subhead">Company: </span>{exp.company}</p>
							<p><span className="subhead">Location: </span>{exp.location}</p>
							<p><span className="subhead">Start Date: </span>{new Date(exp.startDate).toDateString()}</p>
							<p><span className="subhead">End Date: </span>{new Date(exp.endDate).toDateString()}</p>
						</div>
					))}
					</div>

					<div className="education-details">
					<h2>Education</h2>
					{userData.education.map((edu, index) => (
						<div key={index}>
							<p><span className="subhead">Institution: </span>{edu.institution}</p>
							<p><span className="subhead">Degree: </span>{edu.degree}</p>
							<p><span className="subhead">Field of Study: </span>{edu.fieldOfStudy}</p>
							<p><span className="subhead">Start Date: </span>{new Date(edu.startDate).toDateString()}</p>
							<p><span className="subhead">End Date: </span>{new Date(edu.endDate).toDateString()}</p>
						</div>
					))}
					</div>

					{/* <div className="certificate-details">
					<h2>Certifications</h2>
					{userData.certifications.map((cert, index) => (
						<div key={index}>
							<p><span className="subhead">Certification Name: </span>{cert.certificationName}</p>
							<p><span className="subhead">Issued By:</span> {cert.issuedBy}</p>
							<p><span className="subhead">Issue Date: </span>{new Date(cert.issueDate).toDateString()}</p>
						</div>
					))}
				</div> */}
				</div>

				<div className="right-side">
					<div className="skills-details">
						<h2>Skills</h2>
						<ul>
							{userData.skills.map((skill, index) => (
								<li key={index}>{skill.skillName} - {skill.proficiency}</li>
							))}
						</ul>
					</div>

					<div className="interests-details">
						<h2>Interests</h2>
						<ul>
							{userData.interests.map((interest, index) => (
								<li key={index}>{interest}</li>
							))}
						</ul>
					</div>

					<div className="certificate-details">
					<h2>Certifications</h2>
					{userData.certifications.map((cert, index) => (
						<div key={index}>
							<p><span className="subhead">Certification Name: </span>{cert.certificationName}</p>
							<p><span className="subhead">Issued By:</span> {cert.issuedBy}</p>
							<p><span className="subhead">Issue Date: </span>{new Date(cert.issueDate).toDateString()}</p>
						</div>
					))}
				</div>

				</div>
			</div>
		</div>
	);
};

export default ViewDetails;