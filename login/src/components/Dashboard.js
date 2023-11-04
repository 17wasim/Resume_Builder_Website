import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import "./Dashboard.css"

const Dashboard = () => {

	const { logindata, setLoginData } = useContext(LoginContext);

	const [data, setData] = useState(false);


	const history = useNavigate();

	const DashboardValid = async () => {
		let token = localStorage.getItem("usersdatatoken");

		const res = await fetch("/validuser", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": token
			}
		});

		const data = await res.json();

		if (data.status === 401 || !data) {
			history("*");
		} else {
			console.log("user verify");
			setLoginData(data)
			history("/dash");
		}
	}


	useEffect(() => {
		setTimeout(() => {
			DashboardValid();
			setData(true)
		}, 2000)

	}, [])

	const handleBuildResume = () => {
    history("/profile-details");
  };

	return (
    <>
      {data ? (
        <div id="home">
          <h1 style={{ marginTop: 20 }}>
            Build Your Resume:{logindata ? logindata.ValidUserOne.fname : ""}
          </h1>
          <Button
            variant="contained"
            className="btn"
            onClick={handleBuildResume}
            style={{ marginTop: 20 }}
          >
            Build Resume
          </Button>
        </div>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default Dashboard;