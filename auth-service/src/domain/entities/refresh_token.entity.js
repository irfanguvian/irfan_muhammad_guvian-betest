export class RefreshToken {
    constructor({ refreshId, accessId ,identityNumber}) {
        this.refreshId = refreshId;
        this.accessTokenId = accessId;
        this.identityNumber = identityNumber;
    }
}