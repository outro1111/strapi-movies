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
        ctx.response.status = 400; // 상태 코드를 400 Bad Request로 설정
        return ctx.response.body = { error: 'already review' }; // 에러 메시지 return
        // return { error: 'already review' }; // 에러 메시지 return 다른 방법
      } 
      const response = await super.create(ctx); // 중복 리뷰가 없을 시 리뷰 작성
      return response;
    } catch(error) {
      return ctx.badRequest('Failed to create review');
    }
  },
}));
