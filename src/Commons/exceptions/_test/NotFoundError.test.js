const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
    it('should create NotFoundError correctly', () => {
        const notFoundError = new NotFoundError('not found error!');

        expect(notFoundError.statusCode).toEqual(404);
        expect(notFoundError.message).toEqual('not found error!');
        expect(notFoundError.name).toEqual('NotFoundError');
    });
});
