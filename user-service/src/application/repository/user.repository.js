export class UserRepository {
    constructor({ userModel, clientRedis }) {
        this.userModel = userModel;
        this.clientRedis = clientRedis;
    }
    
    async createUser(user) {
        return this.userModel.create(user);
    }
    
    async updateUserWithIdentityNumber(args) {
        return this.userModel.updateOne({ identityNumber: args.identityNumber }, { userName: args.userName, emailAddress: args.emailAddress });
    }
    
    async deleteUserWithIdentityNumber(identityNumber) {
        return this.userModel.deleteOne({ identityNumber });
    }

    async getUserWithAccountNumber(accountNumber) {
        return this.userModel.findOne({ accountNumber })
    }

    async getUserWithIdentityNumber(identityNumber) {
        return this.userModel.findOne({ identityNumber })
    }

    async getAllUser() {
        return this.userModel.find();
    }

    // setter

    async setCacheData(key, value, expired) {
        return this.clientRedis.set(key, value, expired);
    }

    async getCacheData(key) {
        return this.clientRedis.get(key);
    }

    
}