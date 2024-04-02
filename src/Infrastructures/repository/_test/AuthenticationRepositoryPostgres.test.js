const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
    afterEach(async () => {
        await AuthenticationsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addToken function', () => {
        it('should add token to authentications table', async () => {
            // Arrange
            const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
            const token = 'token';

            // Action
            await authenticationRepository.addToken(token);

            // Assert
            const tokens = await AuthenticationsTableTestHelper.findToken(token);
            expect(tokens).toHaveLength(1);
            expect(tokens[0].token).toBe(token);
        });
    });

    describe('checkAvailabilityToken function', () => {
        it('should throw InvariantError when token not available', async () => {
            // Arrange
            const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
            const token = 'token';

            // Action & Assert
            await expect(authenticationRepository.checkAvailabilityToken(token))
                .rejects
                .toThrow(InvariantError);
        });

        it('should not throw InvariantError when token available', async () => {
            // Arrange
            const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
            const token = 'token';
            await AuthenticationsTableTestHelper.addToken(token);

            // Action & Assert
            await expect(authenticationRepository.checkAvailabilityToken(token))
                .resolves.not.toThrow(InvariantError);
        });
    });

    describe('deleteToken function', () => {
        it('should delete token from authentications table', async () => {
            // Arrange
            const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
            const token = 'token';
            await AuthenticationsTableTestHelper.addToken(token);

            // Action
            await authenticationRepository.deleteToken(token);

            // Assert
            const tokens = await AuthenticationsTableTestHelper.findToken(token);
            expect(tokens).toHaveLength(0);
        });
    });
});
