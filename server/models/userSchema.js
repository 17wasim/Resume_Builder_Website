const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const keysecret = process.env.SECRET_KEY


const userSchema = new mongoose.Schema({
	fname: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("not valid email")
			}
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			}
		}
	],
	verifytoken: {
		type: String,
	},
	
	profilePic: {
		type: Buffer // We will store the image as a Buffer (binary data)
	},
	phoneNumber: {
		type: String
	},
	aboutMe: {
		type: String
	},
	education: [
		{
			institution: {
				type: String,
				required: true,
				trim: true
			},
			degree: {
				type: String,
				required: true,
				trim: true
			},
			fieldOfStudy: {
				type: String,
				required: true,
				trim: true
			},
			startDate: {
				type: Date,
				required: true
			},
			endDate: {
				type: Date,
				required: true
			}
		}
	],
	experience: [
		{
			title: {
				type: String,
				required: true,
				trim: true
			},
			company: {
				type: String,
				required: true,
				trim: true
			},
			location: {
				type: String,
				required: true,
				trim: true
			},
			startDate: {
				type: Date,
				required: true
			},
			endDate: {
				type: Date,
				required: true
			}
		}
	],
	skills: [
		{
			skillName: {
				type: String,
				required: true,
				trim: true,
			},
			proficiency: {
				type: String,
				required: true,
				trim: true,
			},
		},
	],
	certifications: [
		{
			certificationName: {
				type: String,
				required: true,
				trim: true
			},
			issuedBy: {
				type: String,
				required: true,
				trim: true
			},
			issueDate: {
				type: Date,
				required: true
			}
		}
	],
	interests: [
		{
			type: String,
			required: true,
		},
	],

});



// token generate
userSchema.methods.generateAuthtoken = async function () {
	try {
		let token23 = jwt.sign({ _id: this._id }, keysecret, {
			expiresIn: "1d"
		});

		this.tokens = this.tokens.concat({ token: token23 });
		await this.save();
		return token23;
	} catch (error) {
		res.status(422).json(error)
	}
}


// createing model
const userdb = new mongoose.model("users", userSchema);

module.exports = userdb;


// if (this.isModified("password")) {    }