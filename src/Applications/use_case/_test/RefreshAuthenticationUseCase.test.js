const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

describe('RefreshAuthenticationUseCase', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
        // Arrange
        const useCasePayload = {};
        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

        // Action & Assert
        await expect(refreshAuthenticationUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    });

    it('should throw error if refresh token not string', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: 123,
        };
        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

        // Action & Assert
        await expect(refreshAuthenticationUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the refresh authentication token action correctly', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: 'refreshToken',
        };
        const mockAuthenticationRepository = new AuthenticationRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        // Mocking
        mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.verifyRefreshToken = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({ username: 'dicoding' }));
        mockAuthenticationTokenManager.createAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve('some_new_token_access'));

        // Create Use Case Instance
        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
            authenticationRepository: mockAuthenticationRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
        });

        // Action
        const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

        // Assert
        expect(mockAuthenticationTokenManager.verifyRefreshToken)
            .toHaveBeenCalledWith(useCasePayload.refreshToken);
        expect(mockAuthenticationRepository.checkAvailabilityToken)
            .toHaveBeenCalledWith(useCasePayload.refreshToken);
        expect(mockAuthenticationTokenManager.decodePayload)
            .toHaveBeenCalledWith(useCasePayload.refreshToken);
        expect(mockAuthenticationTokenManager.createAccessToken)
            .toHaveBeenCalledWith({ username: 'dicoding' });
        expect(accessToken).toEqual('some_new_token_access');
    });
});
