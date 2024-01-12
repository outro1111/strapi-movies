'use strict';

/**
 * review controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::review.review', ({ strapi }) => ({
  async create(ctx) {
    const { user, movie } = ctx.request.body.data;
    try { // 리뷰 데이터에서 작성 user id를 검색 
      const existingReview = await strapi.entityService.findMany(
        'api::review.review',
        {
          filters: {
            movie: movie,
            user: user
          },
        }
      );
      if (existingReview.length > 0) { // 작성자가 쓴 리뷰가 있을 시
        return { error: 'already review' }; // 에러 메시지 return
      } 
      const response = await super.create(ctx); // 중복 리뷰가 없을 시 리뷰 작성
      return response;
    } catch(error) {
      return ctx.badRequest('Failed to create review');
    }
  },
}));
