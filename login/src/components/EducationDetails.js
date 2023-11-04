import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './mix.css';

const EducationDetails = () => {
	const [educationList, setEducationList] = useState([
		{
			institution: '',
			degree: '',
			fieldOfStudy: '',
			startDate: '',
			endDate: '',
		},
	]);

	const navigate = useNavigate();

	const handleChange = (e, index) => {
		const { name, value } = e.target;
		setEducationList((prevList) => {
			const newList = [...prevList];
			newList[index][name] = value;
			return newList;
		});
	};

	const handleAddMore = () => {
    setEducationList((prevList) => [
      ...prevList,
      {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
      },
    ]);
  };

	const saveEducationDetails = async (e) => {
		e.preventDefault();
	
		// Validate the form inputs
		for (const education of educationList) {
			if (
				education.institution === '' ||
				education.degree === '' ||
				education.fieldOfStudy === '' ||
				education.startDate === '' ||
				education.endDate === ''
			) {
				toast.warning('All fields are required!', {
					position: 'top-center',
				});
				return;
			}
		}
	
		try {
			const token = localStorage.getItem('usersdatatoken'); // Get the JWT token from local storage
	
			const response = await fetch('/education-details', {
				method: 'POST',
				body: JSON.stringify({ educationList }),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token, // Include the JWT token in the request header
				},
			});
	
			const data = await response.json();
	
			if (response.ok) {
				toast.success('Education details saved successfully 😃!', {
					position: 'top-center',
				});
				navigate('/experience-details');
			} else {
				toast.error(data.message || 'Failed to save education details. Please try again later.', {
					position: 'top-center',
				});
			}
		} catch (error) {
			console.error('Error saving education details:', error);
			toast.error('Failed to save education details. Please try again later.', {
				position: 'top-center',
			});
		}
	};
	

	return (
		<>
			<section>
				<div className="form_data">
					<div className="form_heading">
						<h1>Education Details</h1>
						<p style={{ textAlign: 'center' }}>Please provide your education information below.</p>
					</div>

					<form>
						{educationList.map((education, index) => (
							<div key={index}>
								<div className="form_input">
									<label htmlFor={`institution${index}`}>Institution</label>
									<input
										type="text"
										onChange={(e) => handleChange(e, index)}
										value={education.institution}
										name="institution"
										id={`institution${index}`}
										placeholder="Enter Institution"
									/>
								</div>
								<div className="form_input">
									<label htmlFor={`degree${index}`}>Degree</label>
									<input
										type="text"
										onChange={(e) => handleChange(e, index)}
										value={education.degree}
										name="degree"
										id={`degree${index}`}
										placeholder="Enter Degree"
									/>
								</div>
								<div className="form_input">
									<label htmlFor={`fieldOfStudy${index}`}>Field of Study</label>
									<input
										type="text"
										onChange={(e) => handleChange(e, index)}
										value={education.fieldOfStudy}
										name="fieldOfStudy"
										id={`fieldOfStudy${index}`}
										placeholder="Enter Field of Study"
									/>
								</div>
								<div className="form_input">
									<label htmlFor={`startDate${index}`}>Start Date</label>
									<input
										type="date"
										onChange={(e) => handleChange(e, index)}
										value={education.startDate}
										name="startDate"
										id={`startDate${index}`}
									/>
								</div>
								<div className="form_input">
									<label htmlFor={`endDate${index}`}>End Date</label>
									<input
										type="date"
										onChange={(e) => handleChange(e, index)}
										value={education.endDate}
										name="endDate"
										id={`endDate${index}`}
									/>
								</div>
							</div>
						))}

						<button type="button" className="btn" onClick={handleAddMore}>
							Add More
						</button>

						<button className="btn" onClick={saveEducationDetails}>
							Save Details
						</button>

					</form>
					<ToastContainer />
				</div>
			</section>
		</>
	);
};

export default EducationDetails;
