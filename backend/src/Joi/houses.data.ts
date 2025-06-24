import * as Joi from 'joi';

export const schemaHouse = Joi.object({
  address: Joi.string().trim().min(3).max(30).required(),
  rental: Joi.number().min(100).max(100000).required(),
  area: Joi.number().min(25).max(10000).required(),
  rooms: Joi.number().min(1).max(100).required(),
  floors: Joi.number().min(1).max(50).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  managedBy: Joi.number().required(),
});

export const schemaEditHouse = Joi.object({
  address: Joi.string().trim().min(3).max(30).optional(),
  rental: Joi.number().min(100).max(100000).optional(),
  area: Joi.number().min(25).max(10000).optional(),
  rooms: Joi.number().min(1).max(100).optional(),
  floors: Joi.number().min(1).max(50).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  isAvailable:Joi.bool().optional()
});