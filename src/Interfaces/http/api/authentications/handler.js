const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/RefreshAuthenticationUseCase');

class AuthenticationsHandler {
    constructor(container) {
        this._container = container;
    }

    async postAuthenticationHandler(request, h) {
        const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
        const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);

        const response = h.response({
            status: 'success',
            data: {
                accessToken,
                refreshToken,
            },
        });
        response.code(201);
        return response;
    }

    async deleteAuthenticationHandler(request) {
        const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase.name);
        await logoutUserUseCase.execute(request.payload);
        return {
            status: 'success',
        };
    }

    async putAuthenticationHandler(request) {
        const refreshAuthenticationUseCase = this._container
            .getInstance(RefreshAuthenticationUseCase.name);
        const accessToken = await refreshAuthenticationUseCase.execute(request.payload);
        return {
            status: 'success',
            data: {
                accessToken,
            },
        };
    }
}

module.exports = AuthenticationsHandler;
