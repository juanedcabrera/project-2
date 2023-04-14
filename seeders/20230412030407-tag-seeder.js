'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', [
      { name: 'adventure', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'comfort', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'contentment', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'creativity', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'empowered', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'excitement', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'family', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'friendship', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'gracious', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'grateful', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'growth', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'health', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'hopeful', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'inspired', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'joyful', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'learning', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'love', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'mindfulness', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'nature', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'nostalgic', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'overwhelmed', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'peaceful', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'positivity', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'reflection', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'relationships', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'saddened', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'spiritual', "createdAt": new Date(), "updatedAt": new Date() },
      { name: 'success', "createdAt": new Date(), "updatedAt": new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tags', null, {});
  }
};
