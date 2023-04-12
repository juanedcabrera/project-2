'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', [
      { name: 'Accomplishment', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Adventure', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Comfort', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Contentment', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Creativity', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Empowered', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Excitement', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Family', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Friendship', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Gracious', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Grateful', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Growth', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Health', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Hopeful', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Inspired', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Joyful', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Learning', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Love', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Mindfulness', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Nature', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Nostalgic', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Overwhelmed', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Peaceful', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Positivity', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Reflection', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Relationships', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Sadded', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Spiritual', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'Success', "createdAt": new Date(), "updatedAt": new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tags', null, {});
  }
};
