const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');
const config = require('../../../Commons/config');

describe('JwtTokenManager', () => {
    describe('createAccessToken function', () => {
        it('should create access token correctly', async () => {
            // Arrange
            const payload = {
                username: 'dicoding',
            };
            const mockJwtToken = {
                generate: jest.fn().mockImplementation(() => 'mock_token'),
            };
            const tokenManager = new JwtTokenManager(mockJwtToken);

            // Action
            const accessToken = await tokenManager.createAccessToken(payload);

            // Assert
            expect(mockJwtToken.generate).toBeCalledWith(payload, config.auth.accessTokenKey);
            expect(accessToken).toEqual('mock_token');
        });
    });

    describe('createRefreshToken function', () => {
        it('should create refresh token correctly', async () => {
            // Arrange
            const payload = {
                username: 'dicoding',
            };
            const mockJwtToken = {
                generate: jest.fn().mockImplementation(() => 'mock_token'),
            };
            const tokenManager = new JwtTokenManager(mockJwtToken);

            // Action
            const refreshToken = await tokenManager.createRefreshToken(payload);

            // Assert
            expect(mockJwtToken.generate).toBeCalledWith(payload, config.auth.refreshTokenKey);
            expect(refreshToken).toEqual('mock_token');
        });
    });

    describe('verifyRefreshToken function', () => {
        it('should throw InvariantError when verification failed', async () => {
            // Arrange
            const tokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await tokenManager.createAccessToken({ username: 'dicoding' });

            // Action & Assert
            await expect(tokenManager.verifyRefreshToken(accessToken))
                .rejects
                .toThrow(InvariantError);
        });

        it('should not throw InvariantError when verification success', async () => {
            // Arrange
            const tokenManager = new JwtTokenManager(Jwt.token);
            const refreshToken = await tokenManager.createRefreshToken({ username: 'dicoding' });

            // Action
            await expect(tokenManager.verifyRefreshToken(refreshToken))
                .resolves
                .not.toThrow(InvariantError);
        });
    });

    describe('decodePayload function', () => {
        it('should decode payload correctly', async () => {
            // Arrange
            const tokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await tokenManager.createAccessToken({ username: 'dicoding' });

            // Action
            const { username: expectedUsername } = await tokenManager.decodePayload(accessToken);

            // Assert
            expect(expectedUsername).toEqual('dicoding');
        });
    });
});
