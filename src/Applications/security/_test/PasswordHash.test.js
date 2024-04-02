const PasswordHash = require('../PasswordHash');

describe('PasswordHash Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const passwordHash = new PasswordHash();

        // Action and Assert
        await expect(passwordHash.hash('dummy_password')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
        await expect(passwordHash.compare('dummy_password', 'hashed_password')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
    });
});
