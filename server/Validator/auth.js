const Joi = require('joi');

// Define the validation schema for the parameters
const registerValidationSchema = Joi.object({
  fname: Joi.string().pattern(/^([A-Z]+\s)*[A-Z]+$/).required()
	.messages({
    'string.pattern.base': 'First name must contain only capital letters and spaces'
  }),
  email: Joi.string().email().required()
	.messages({
    'string.email': 'Invalid email address'
  }),
  password: Joi.string().min(6).required()
	.messages({
    'string.min': 'Password must be at least 6 characters long'
  })
});

const educationValidationSchema = Joi.array().items(
  Joi.object({
    institution: Joi.string().required(),
    degree: Joi.string().required(),
    fieldOfStudy: Joi.string().required(),
		startDate: Joi.date().iso().max('now').required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
  })
);

const experienceValidationSchema = Joi.array().items(
  Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string().required(),
    startDate: Joi.date().iso().max('now').required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
  })
);

const skillsValidationSchema = Joi.array().items(
  Joi.object({
		skillName: Joi.string().required(),
		proficiency: Joi.string().required(),
	})
);

const certificationsValidationSchema = Joi.array().items(
  Joi.object({
    certificationName: Joi.string().required().trim(),
    issuedBy: Joi.string().required().trim(),
    issueDate: Joi.date().iso().max('now').required()
  })
);

const interestsValidationSchema = Joi.array().items(
  Joi.string().min(1).max(100).required()
);


module.exports = { registerValidationSchema, educationValidationSchema, experienceValidationSchema , skillsValidationSchema , certificationsValidationSchema, interestsValidationSchema, interestsValidationSchema}

