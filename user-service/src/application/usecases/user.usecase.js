import { RETURN_FAILED_MESSAGE, RETURN_FAILED_NOT_FOUND_TOKEN, RETURN_SUCCESS_MESSAGE } from "../../domain/constant/constant.js";
import { User } from "../../domain/entities/user.entity.js";

export class UserUsecase {
    constructor({ userRepository, lodash , uuidv4, axios}) {
        this.userRepository = userRepository;
        this.lodash = lodash;
        this.uuidv4 = uuidv4;
        this.axios = axios;
    }
    
    async createUser(args) {
        const {isNil, isEmpty} = this.lodash;

        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: null
            }
        }
        try {
            if(
                (isNil(args.userName) || isEmpty(args.userName)) ||
                (isNil(args.emailAddress) || isEmpty(args.emailAddress))
            ) {
                throw new Error("Please fill all the fields");
            }

            const argument = {
                accountNumber: Math.floor(100000 + Math.random() * 900000), // 6 digit random number
                identityNumber: this.uuidv4(), // uuid
                userName: args.userName,
                emailAddress: args.emailAddress
            }
    
            const prepareArgumentUser = new User(argument);
    
            const createUser = await this.userRepository.createUser(prepareArgumentUser);

            result.success = true;
            result.message = RETURN_SUCCESS_MESSAGE;
            result.data.user = createUser;
            return result
        } catch (error) {
            if(!isNil(error.errorResponse)) {
                throw new Error(error.errorResponse.errmsg);
            } else {
                throw new Error(error.message);
            }
        }
    }
    
    async updateUser(args) {
        const {isNil, isEmpty} = this.lodash;

        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE
        }
        try {
            if(
                (isNil(args.userName) || isEmpty(args.userName)) ||
                (isNil(args.emailAddress) || isEmpty(args.emailAddress)) ||
                (isNil(args.identityNumber) || isEmpty(args.identityNumber))
            ) {
                throw new Error("Please fill all the fields");
            }

            const checkUser = await this.getUserByIdentityNumber(args);
            if(checkUser.success === false || checkUser.data.user === null) {
                throw new Error("User not found");
            }

            const argumentUpdate = {
                identityNumber: args.identityNumber,
                userName: args.userName,
                emailAddress: args.emailAddress
            }

            const userUpdated = await this.userRepository.updateUserWithIdentityNumber(argumentUpdate);
            const deleteKeyRedis = await this.userRepository.deleteCacheData([`${checkUser.data.user.accountNumber}`, `${checkUser.data.user.identityNumber}`]);

            result.success = true;
            result.message = RETURN_SUCCESS_MESSAGE;
            return result
        } catch (error) {
            if(!isNil(error.errorResponse)) {
                throw new Error(error.errorResponse.errmsg);
            } else {
                throw new Error(error.message);
            }       
        }

    }

    async deleteUser(args) {
        const {isNil, isEmpty} = this.lodash;

        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE
        }
        try {
            if(
                (isNil(args.identityNumber) || isEmpty(args.identityNumber))
            ) {
                throw new Error("Please fill all the fields");
            }

            const checkUser = await this.getUserByIdentityNumber(args);
            if(checkUser.success === false || checkUser.data.user === null) {
                throw new Error("User not found");
            }

            const userDeleted = await this.userRepository.deleteUserWithIdentityNumber(args.identityNumber);
            const deleteKeyRedis = await this.userRepository.deleteCacheData([`${checkUser.data.user.accountNumber}`, `${checkUser.data.user.identityNumber}`]);

            result.success = true;
            result.message = RETURN_SUCCESS_MESSAGE;
            return result
        } catch (error) {
            if(!isNil(error.errorResponse)) {
                throw new Error(error.errorResponse.errmsg);
            } else {
                throw new Error(error.message);
            }       
        }
    }

    async getUserByAccountNumber(args) {
        const {isNil, isEmpty} = this.lodash;

        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: null
            }
        }
        try {
            if(
                (isNil(args.accountNumber) || isEmpty(args.accountNumber))
            ) {
                throw new Error("Please fill all the fields");
            }

            const getUserByCacheWithAccountNumber = await this.userRepository.getCacheData(`${args.accountNumber}`);

            if(!isNil(getUserByCacheWithAccountNumber)) {
                result.success = true;
                result.message = RETURN_SUCCESS_MESSAGE;
                result.data.user = JSON.parse(getUserByCacheWithAccountNumber);
                return result
            }

            const user = await this.userRepository.getUserWithAccountNumber(args.accountNumber);

            if(!isNil(user)) {
                await this.userRepository.setCacheData(`${args.accountNumber}`, JSON.stringify(user), {EX: 60 * 5});
            } else {
                throw new Error("User not found");
            }

            result.success = true;
            result.message = RETURN_SUCCESS_MESSAGE;
            result.data.user = user;
            return result
        } catch (error) {
            if(!isNil(error.errorResponse)) {
                throw new Error(error.errorResponse.errmsg);
            } else {
                throw new Error(error.message);
            }       
        }
    }

    async getUserByIdentityNumber(args) {
        const {isNil, isEmpty} = this.lodash;

        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: null
            }
        }
        try {
            if(
                (isNil(args.identityNumber) || isEmpty(args.identityNumber))
            ) {
                throw new Error("Please fill all the fields");
            }

            const getUserByCacheWithIdentityNumber= await this.userRepository.getCacheData(`${args.identityNumber}`);

            if(!isNil(getUserByCacheWithIdentityNumber)) {
                result.success = true;
                result.message = RETURN_SUCCESS_MESSAGE;
                result.data.user = JSON.parse(getUserByCacheWithIdentityNumber);
                return result
            }

            const user = await this.userRepository.getUserWithIdentityNumber(args.identityNumber);

            if(!isNil(user)) {
                await this.userRepository.setCacheData(`${args.accountNumber}`, JSON.stringify(user), {EX: 60 * 5});
            } else {
                throw new Error("User not found");
            }

            result.success = true;
            result.message = RETURN_SUCCESS_MESSAGE;
            result.data.user = user;
            return result
        } catch (error) {
            if(!isNil(error.errorResponse)) {
                throw new Error(error.errorResponse.errmsg);
            } else {
                throw new Error(error.message);
            }       
        }
    }

    async getAllUser() {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: []
            }
        }
        try {
            const user = await this.userRepository.getAllUser();

            result.success = true;
            result.message = RETURN_SUCCESS_MESSAGE;
            result.data.user = user;
            return result
        } catch (error) {
            if(!isNil(error.errorResponse)) {
                throw new Error(error.errorResponse.errmsg);
            } else {
                throw new Error(error.message);
            }
        }
    }

    async authMiddleware(accessToken) {
        const {isNil, isEmpty} = this.lodash;
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE
        }
       try {
        if(isNil(accessToken) || isEmpty(accessToken)) {
            throw new Error("Token is required");
        }

        const getUser = await this.axios.post(`${process.env.AUTH_SERVICE_URL}/auth/verify-token`, {
            accessToken: accessToken
        });

        if(getUser.data.data.success == false ) {
            return res.status(401).json({ message: RETURN_FAILED_NOT_FOUND_TOKEN});
        }
        result.success = true;
        result.message = RETURN_SUCCESS_MESSAGE;
        return result
       } catch (error) {
        if(!isNil(error.response) && !isNil(error.response.data.message)) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.message);
        }
       }
    }

}