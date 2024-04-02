const ClientError = require('../ClientError');

describe('ClientError', () => {
    it('should throw error when directly use ClientError class', () => {
        expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class');
    });
});
