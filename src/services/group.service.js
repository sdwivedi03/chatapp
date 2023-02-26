const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Group, Participant } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a group
 * @param {Object} groupBody
 * @returns {Promise<Group>}
 */
const createGroup = async (groupBody) => {
  const group = await Group.create(groupBody);
  await Participant.bulkCreate(groupBody.participants.map(userId => ({userId, GroupId: group.id, addedBy: groupBody.createdBy})));
  return await getGroupById(group.id);
};

/**
 * Get group by id
 * @param {UUID} id
 * @returns {Promise<Group>}
 */
const getGroupById = async (id) => {
  return Group.findByPk(id, {
    include: Participant
  });
};

/**
 * Change group name
 * @param {UUID} groupId
 * @param {string} name
 * @returns {Promise<GR>}
 */
const changeGroupName = async (groupId, name) => {
  const group = await getGroupById(groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  group.name = name;
  await group.save();
  return group;
};

/**
 * Add member in group
 * @param {ObjectId} groupId
 * @param {ObjectId} userId
 * @returns {Promise<Group>}
 */
const addMemberInGroup = async (groupId, userId) => {
  const group = await getGroupById(groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await group.addUser(user);
  return group;
};


/**
 * Can be used for both:
 * 1) remove member from group 
 * 2) exit from group
 * @param {ObjectId} groupId
 * @param {ObjectId} userId
 * @returns {Promise<Group>}
 */
const removeMemberFromGroup = async (groupId, userId) => {
    const group = await getGroupById(groupId);
    if (!group) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
    }
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await Participant.destroy({ where: { groupId, userId } });
    return group;
  };


/**
 * Delete group by id
 * @param {ObjectId} groupId
 * @returns {Promise<Group>}
 */
const deleteGroupById = async (userId) => {
    const group = await getGroupById(groupId);
    if (!group) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
    }
    await Group.destroy({ where: { id: groupId } });
    return group;
  };

module.exports = {
  createGroup,
  getGroupById,
  changeGroupName,
  addMemberInGroup,
  removeMemberFromGroup,
  deleteGroupById,
};
