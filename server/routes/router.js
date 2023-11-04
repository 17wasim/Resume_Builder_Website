//Externsl Dependencies
const express = require("express");
let bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const multer = require('multer');

//Internal Dependencies
const userdb = require("../models/userSchema");
const authenticate = require("../middleware/authenticate");
const { registerValidationSchema, educationValidationSchema , experienceValidationSchema , skillsValidationSchema , certificationsValidationSchema, interestsValidationSchema } = require("../Validator/auth");


// email config
const keysecret = process.env.SECRET_KEY
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
})


const router = new express.Router();

// for user registration
router.post("/register", async (req, res) => {

	const { fname, email, password } = req.body;

	const { error } = registerValidationSchema.validate(req.body);
	if (error) {
		res.status(422).send({ status: "error", details: error.details[0].message })
		return
	}

	try {

		const preuser = await userdb.findOne({ email: email });

		if (preuser) {
			res.status(422).json({ error: "This Email is Already Exist" })
		} else {

			const hashedPassword = await bcrypt.hash(password, 12);

			const finalUser = new userdb({
				fname, email, password: hashedPassword
			});

			const storeData = await finalUser.save();

			// console.log(storeData);
			res.status(201).json({ status: 201, storeData, details: "User Created Successfully" })
			try {
				const mailOptions = {
					from: process.env.EMAIL,
					to: email,
					subject: "Sending Email For Registering Successfully",
					text: `You have been registered Successfully`
				}

				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						console.log("error", error);
						res.status(401).json({ status: 401, message: "email not send" })
					} else {
						console.log("Email sent", info.response);
						res.status(201).json({ status: 201, message: "Email sent Successfully" })
					}
				})
			} catch (error) {
				res.status(401).json({ status: 401, error });
				console.log("catch block");
			}
		}
	} catch (error) {
		res.status(422).json(error);
		console.log("catch block error");
	}

});


// user Login

router.post("/login", async (req, res) => {
	console.log(req.body);

	const { email, password } = req.body;

	if (!email || !password) {
		res.status(422).json({ error: "fill all the details" })
	}

	try {
		const userValid = await userdb.findOne({ email: email });

		if (userValid) {

			const isMatch = await bcrypt.compare(password, userValid.password);

			if (!isMatch) {
				res.status(422).json({ error: "invalid details" })
			} else {

				// token generate
				const token = await userValid.generateAuthtoken();

				// cookiegenerate
				res.cookie("usercookie", token, {
					expires: new Date(Date.now() + 9000000),
					httpOnly: true
				});

				const result = {
					userValid,
					token
				}
				res.status(201).json({ status: 201, result })
			}
		} else {
			res.status(401).json({ status: 401, message: "invalid details" });
		}

	} catch (error) {
		res.status(401).json({ status: 401, error });
		console.log("catch block");
	}
});



// user valid
router.get("/validuser", authenticate, async (req, res) => {
	try {
		const ValidUserOne = await userdb.findOne({ _id: req.userId });
		res.status(201).json({ status: 201, ValidUserOne });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});


// user logout

router.get("/logout", authenticate, async (req, res) => {
	try {
		req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
			return curelem.token !== req.token
		});

		res.clearCookie("usercookie", { path: "/" });

		req.rootUser.save();

		res.status(201).json({ status: 201 })

	} catch (error) {
		res.status(401).json({ status: 401, error })
	}
});



// send email Link For reset Password
router.post("/sendpasswordlink", async (req, res) => {
	console.log(req.body)

	const { email } = req.body;

	if (!email) {
		res.status(401).json({ status: 401, message: "Enter Your Email" })
	}

	try {
		const userfind = await userdb.findOne({ email: email });

		// token generate for reset password
		const token = jwt.sign({ _id: userfind._id }, keysecret, {
			expiresIn: "120s"
		});

		const setusertoken = await userdb.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token }, { new: true });


		if (setusertoken) {
			const mailOptions = {
				from: process.env.EMAIL,
				to: email,
				subject: "Sending Email For password Reset",
				text: `This Link Valid For 2 MINUTES http://localhost:3000/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
			}

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log("error", error);
					res.status(401).json({ status: 401, message: "email not send" })
				} else {
					console.log("Email sent", info.response);
					res.status(201).json({ status: 201, message: "Email sent Successfully" })
				}
			})

		}

	} catch (error) {
		res.status(401).json({ status: 401, message: "invalid user" })
	}

});


// verify user for forgot password time
router.get("/forgotpassword/:id/:token", async (req, res) => {
	const { id, token } = req.params;

	try {
		const validuser = await userdb.findOne({ _id: id, verifytoken: token });

		const verifyToken = jwt.verify(token, keysecret);

		console.log(verifyToken)

		if (validuser && verifyToken._id) {
			res.status(201).json({ status: 201, validuser })
		} else {
			res.status(401).json({ status: 401, message: "user not exist" })
		}

	} catch (error) {
		res.status(401).json({ status: 401, error })
	}
});


// change password

router.post("/:id/:token", async (req, res) => {
	const { id, token } = req.params;

	const { password } = req.body;

	try {
		const validuser = await userdb.findOne({ _id: id, verifytoken: token });

		const verifyToken = jwt.verify(token, keysecret);

		if (validuser && verifyToken._id) {
			const newpassword = await bcrypt.hash(password, 12);

			const setnewuserpass = await userdb.findByIdAndUpdate({ _id: id }, { password: newpassword });

			setnewuserpass.save();
			res.status(201).json({ status: 201, setnewuserpass })

		} else {
			res.status(401).json({ status: 401, message: "user not exist" })
		}
	} catch (error) {
		res.status(401).json({ status: 401, error })
	}
})

router.post('/modify-password', async (req, res) => {
	try {
		const { token } = req.params;
		const { oldPassword, newPassword } = req.body;

		// Find the user by the token
		const user = await userdb.findOne({ verifytoken: token });

		if (!user) {
			// If the user with the given token is not found, return an error response
			return res.status(404).json({ status: "error", message: "Invalid token" });
		}

		// Compare the old password provided by the user with the one stored in the database
		const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

		if (!isOldPasswordValid) {
			// If the old password is not valid, return an error response
			return res.status(401).json({ status: "error", message: "Invalid old password" });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 12);

		// Update the user's password with the new hashed password
		user.password = hashedPassword;
		user.verifytoken = ''; // Remove the verification token after password update

		// Save the updated user document
		await user.save();

		// Send a success response
		return res.status(201).json({ status: "success", message: "Password updated successfully" });
	} catch (error) {
		// If there is any error, return an error response
		console.error("Error updating password:", error);
		return res.status(500).json({ status: "error", message: "Internal server error" });
	}
});

const upload = multer({
	// Set the destination where uploaded files should be stored (you can change it based on your requirement)
	dest: 'uploads/',
	limits: {
		fileSize: 5 * 1024 * 1024, // Limit the file size to 5MB (you can change it based on your requirement)
	},
});

// Save profile details and profile picture for a user
router.post("/profile-details", authenticate, upload.single('profilePic'), async (req, res) => {
	const { firstName,lastName, phoneNumber, email, aboutMe } = req.body;

	try {
		const user = await userdb.findById(req.userId);

		if (!user) {
			return res.status(404).json({ status: 'error', message: 'User not found' });
		}

		// Update the user profile details
		user.firstName = firstName;
		user.lastName = lastName;
		user.phoneNumber = phoneNumber;
		user.OtherEmail = email;
		user.aboutMe = aboutMe;

		// If a profile picture was uploaded, store it in the user document
		if (req.file) {
			user.profilePic = req.file.buffer;
		}

		// Save the updated user document
		await user.save();

		// Return the updated user details
		return res.status(200).json({ status: 'success', user });
	} catch (error) {
		console.error('Error saving profile details:', error);
		return res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});

router.post('/education-details', authenticate, async (req, res) => {
	const { educationList } = req.body;

	const { error } = educationValidationSchema.validate(educationList);
  if (error) {
    return res.status(400).json({ status: "error", message: error.details[0].message });
  }

	try {
		const user = await userdb.findById(req.userId);

		if (!user) {
			return res.status(404).json({ status: 'error', message: 'User not found' });
		}

		// Add education details to the user document
		user.education = educationList;

		// Save the updated user document
		await user.save();

		// Return the updated user details
		return res.status(200).json({ status: 'success', user });
	} catch (error) {
		console.error('Error saving education details:', error);
		return res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});

// Add a new route to save experience details
router.post("/experience-details", authenticate, async (req, res) => {
	const { experienceList } = req.body;

	const { error } = experienceValidationSchema.validate(experienceList);
  if (error) {
    return res.status(400).json({ status: "error", message: error.details[0].message });
  }

	try {
		const user = await userdb.findById(req.userId);

		if (!user) {
			return res.status(404).json({ status: "error", message: "User not found" });
		}

		// Add the experience details to the user's document
		user.experience = experienceList;

		// Save the updated user document
		await user.save();

		// Return the updated user details
		return res.status(200).json({ status: "success", user });
	} catch (error) {
		console.error("Error saving experience details:", error);
		return res.status(500).json({ status: "error", message: "Internal server error" });
	}
});

// Save skills details for a user
router.post("/skills-details", authenticate, async (req, res) => {
	const { skillsList } = req.body;
	
	const { error } = skillsValidationSchema.validate(skillsList);
  if (error) {
    return res.status(400).json({ status: "error", message: error.details[0].message });
  }

	try {
		const user = await userdb.findById(req.userId);

		if (!user) {
			return res.status(404).json({ status: "error", message: "User not found" });
		}

		// Add the skills details to the user's document
		user.skills = skillsList;

		// Save the updated user document
		await user.save();

		// Return the updated user details
		return res.status(200).json({ status: "success", user });
	} catch (error) {
		console.error("Error saving skills details:", error);
		return res.status(500).json({ status: "error", message: "Internal server error" });
	}
});


router.post('/certifications-details', authenticate, async (req, res) => {
  const { certificationsList} = req.body;
	

	const { error } = certificationsValidationSchema.validate(certificationsList);
	if (error) {
    return res.status(400).json({ status: "error", message: error.details[0].message });
  }


  try {
    const user = await userdb.findById(req.userId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Add the certifications details to the user's document
    user.certifications = certificationsList ;

    // Save the updated user document
    await user.save();

    // Return the updated user details
    return res.status(200).json({ status: 'success', user });
  } catch (error) {
    console.error('Error saving certifications details:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post("/interests-details", authenticate, async (req, res) => {
  const { interestsListAsStrings } = req.body;
	
	const { error } = interestsValidationSchema.validate(interestsListAsStrings);
	if (error) {
    return res.status(400).json({ status: "error", message: error.details[0].message });
  }

  try {
    const user = await userdb.findById(req.userId);

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Update the user's interests with the new array of strings
    user.interests = interestsListAsStrings;

    // Save the updated user document
    await user.save();

    // Return the updated user details
    return res.status(200).json({ status: "success", user });
  } catch (error) {
    console.error("Error saving interests details:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

module.exports = router;



// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true