const Joi = require('joi');
const { objectId } = require('./custom.validation');

const saveMessage = Joi.object().keys({
    senderId: Joi.string().required().custom(objectId),
    receiverId: Joi.string().required().custom(objectId),
    isGroup: Joi.boolean().required(),
    text: Joi.string().required(),
});


const createGroup = Joi.object().keys({
  name: Joi.string().required(),
  participants: Joi.array().items(Joi.custom(objectId))
});

module.exports = {
  saveMessage,
  createGroup,
};
