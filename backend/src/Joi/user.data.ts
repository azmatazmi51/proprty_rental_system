import * as Joi from 'joi';


export const schemaRegister = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(30).required(),
  name: Joi.string().min(3).max(30).required(),
  role:Joi.string().valid('regular').valid('manager').required(),

});

export const schemaCreate = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(30).required(),
  name: Joi.string().min(3).max(30).required(),
  role:Joi.string().valid('regular').valid('admin').valid('manager').required(),

});

export const schemaLogin = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(30).required()
})

export const schemaEditFields=Joi.object({
  name:Joi.string().min(3).optional(),
  email:Joi.string().email({ tlds: { allow: false } }).optional(),
  role:Joi.string().valid('regular').valid('admin').valid('manager').optional(),
});