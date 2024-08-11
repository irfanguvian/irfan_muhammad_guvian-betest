export class AuthRepository {
    constructor({accessTokenModel, refreshTokenModel}) {
        this.accessTokenModel = accessTokenModel;
        this.refreshTokenModel = refreshTokenModel;
    }

    async createAccessToken(args) {
        return this.accessTokenModel.create(args);
    }

    async createRefreshToken(args) {
        return this.refreshTokenModel.create(args);
    }

    async deleteAccessToken(identityNumber) {
        return this.accessTokenModel.deleteOne({identityNumber});
    }

    async deleteRefreshToken(identityNumber) {
        return this.refreshTokenModel.deleteOne({identityNumber});
    }
}