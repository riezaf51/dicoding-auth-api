class LogoutUserUseCase {
    constructor({ authenticationRepository }) {
        this._authenticationRepository = authenticationRepository;
    }

    _validatePayload(useCasePayload) {
        const { refreshToken } = useCasePayload;
        if (!refreshToken) {
            throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
        }

        if (typeof refreshToken !== 'string') {
            throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    async execute(useCasePayload) {
        this._validatePayload(useCasePayload);
        const { refreshToken } = useCasePayload;
        await this._authenticationRepository.checkAvailabilityToken(refreshToken);
        await this._authenticationRepository.deleteToken(refreshToken);
    }
}

module.exports = LogoutUserUseCase;
