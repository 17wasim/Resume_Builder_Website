import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import PasswordReset from "./components/PasswordReset";
import ForgotPassword from "./components/ForgotPassword";
import ModifyPassword from './components/ModifyPassword';
import PersonalDetails from './components/PersonalDetails';
import EducationDetails from './components/EducationDetails';
import ViewDetails from "./components/ViewDetails";
import ExperienceDetails from "./components/ExperienceDetails";
import SkillsDetails from "./components/SkillsDetails";
import CertificationsDetails from "./components/CertificationDetails";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Routes, Route, useNavigate } from "react-router-dom"
import { useEffect, useContext, useState } from "react";
import { LoginContext } from "./components/ContextProvider/Context";
import InterestsDetails from "./components/IntersetsDetails";

function App() {

  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);


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

    if (data.status == 401 || !data) {
      console.log("user not valid");
    } else {
      console.log("user verify");
      setLoginData(data)
      history("/dash");
    }
  }

  useEffect(() => {
    setTimeout(()=>{
      DashboardValid();
      setData(true)
    },2000)

  }, [])

  return (
    <>
      {
        data ? (
          <>
            <Header />

            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dash" element={<Dashboard />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
							<Route path="/modify-password" element={<ModifyPassword />} />
							<Route path="/profile-details" element={<PersonalDetails />} />
							<Route path="/education-details" element={<EducationDetails />} />
							<Route path="/view-details" element={<ViewDetails />} />
							<Route path="/experience-details" element={<ExperienceDetails />} />
							<Route path="/skills-details" element={<SkillsDetails />} />
							<Route path="/certifications-details" element={<CertificationsDetails />} />
							<Route path="/interests-details" element={<InterestsDetails />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </>

        ) : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      }


    </>
  );
}

export default App;