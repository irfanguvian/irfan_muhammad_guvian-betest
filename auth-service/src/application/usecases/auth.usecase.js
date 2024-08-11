import { RETURN_FAILED_MESSAGE, RETURN_SUCCESS_MESSAGE } from "../../domain/constant/constant.js";
import { AccessToken } from "../../domain/entities/access_token.entity.js";
import { RefreshToken } from "../../domain/entities/refresh_token.entity.js";

export class AuthUsecase {
    constructor({authRepository, jwt, lodash, uuidv4, axios, jwtDecode}) {
        this.authRepository = authRepository;
        this.jwt = jwt;
        this.uuidv4 = uuidv4;
        this.lodash = lodash;
        this.axios = axios;
        this.jwtDecode = jwtDecode;
        this.urlUserService = process.env.USER_SERVICE_URL;
        this.expiredAccessToken = process.env.EXPIRED_ACCESS_TOKEN;
        this.expiredRefreshToken = process.env.EXPIRED_REFRESH_TOKEN;
    }

    async generateToken(args)  {
        const {isNil} = this.lodash;
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                accessToken: null,
                refreshToken: null
            }
        }

        try {
            const generateAccessToken = this.uuidv4();
            const generateRefreshToken = this.uuidv4();

            const getUserByIdentityNumber = await this.findByIdentityNumber(args.identityNumber);
            if(getUserByIdentityNumber.success === false || isNil(getUserByIdentityNumber.data.user)) {
                result.message = getUserByIdentityNumber.data.message;
                return result;
            }

            const deleteAccessToken = await this.authRepository.deleteAccessToken(args.identityNumber);
            const deleteRefreshToken = await this.authRepository.deleteRefreshToken(args.identityNumber);

            const argumentAccessToken = new AccessToken({accessId: generateAccessToken, identityNumber: args.identityNumber});
            const argumentRefreshToken = new RefreshToken({refreshId: generateRefreshToken, accessId: generateAccessToken,  identityNumber: args.identityNumber});

            const plainObjAccessToken = {
                accessId: argumentAccessToken.accessId,
                identityNumber: argumentAccessToken.identityNumber
            }

            const plainObjRefreshToken = {
                refreshId: argumentRefreshToken.refreshId,
                accessId: argumentRefreshToken.accessId,
                identityNumber: argumentRefreshToken.identityNumber
            }

            const accessTokenGeneration = this.jwt.sign(plainObjAccessToken, process.env.JWT_SECRET, { expiresIn: this.expiredAccessToken });
            const refreshTokenGeneration = this.jwt.sign(plainObjRefreshToken, process.env.JWT_SECRET, { expiresIn: this.expiredRefreshToken });

            const createAccessToken = await this.authRepository.createAccessToken(argumentAccessToken);
            const createRefreshToken = await this.authRepository.createRefreshToken(argumentRefreshToken);

            result.success = true;
            result.message = "Success to generate token";
            result.data.accessToken = accessTokenGeneration;
            result.data.refreshToken = refreshTokenGeneration;
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async verifyToken(args) {
        const {isNil} = this.lodash;
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: null
            }
        }
        try {
            const verifyAccessToken = this.jwt.verify(args.accessToken, process.env.JWT_SECRET);
            const getUserByIdentityNumber = await this.findByIdentityNumber(verifyAccessToken.identityNumber);
            if(getUserByIdentityNumber.data.success === false || isNil(getUserByIdentityNumber.data.user)) {
                result.message = getUserByIdentityNumber.data.message;
                return result;
            }

            result.success = true;
            result.message = RETURN_SUCCESS_MESSAGE;
            result.data.user = getUserByIdentityNumber.data.user;
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findByIdentityNumber(identityNumber) {
        const {isNil} = this.lodash;

        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: null
            }
        }
        try {
            const getUserByIdentityNumber = await this.axios.get(`${this.urlUserService}/users/identity-number/${identityNumber}`);
            if(getUserByIdentityNumber.data.success === false) {
                result.message = getUserByIdentityNumber.data.message;
                return result;
            } else {
                result.success = true;
                result.message = RETURN_SUCCESS_MESSAGE;
                result.data.user = getUserByIdentityNumber.data.data;
                return result;
            }
        } catch (error) {
            if(!isNil(error.response) && !isNil(error.response.data.message)) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error(error.message);
            }
        }
    }

    async generateTokenWithRefreshToken(args) {
        const {isNil} = this.lodash;
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                accessToken: null
            }
        }

        try {
            const verifyRefreshToken = this.jwt.verify(args.refreshToken, process.env.JWT_SECRET);
            const getUserByIdentityNumber = await this.findByIdentityNumber(verifyRefreshToken.identityNumber);
            if(getUserByIdentityNumber.data.success === false || isNil(getUserByIdentityNumber.data.user)) {
                result.message = getUserByIdentityNumber.data.message;
                return result;
            }

            const deleteAccessToken = await this.authRepository.deleteAccessToken(verifyRefreshToken.identityNumber);

            const generateAccessToken = this.uuidv4();

            const argumentAccessToken = new AccessToken({accessId: generateAccessToken, identityNumber: verifyRefreshToken.identityNumber});

            const plainObjAccessToken = {
                accessId: argumentAccessToken.accessId,
                identityNumber: argumentAccessToken.identityNumber
            }

            const accessTokenGeneration = this.jwt.sign(plainObjAccessToken, process.env.JWT_SECRET, { expiresIn: this.expiredAccessToken });

            const createAccessToken = await this.authRepository.createAccessToken(argumentAccessToken);

            result.success = true;
            result.message = RETURN_SUCCESS_MESSAGE;
            result.data.accessToken = accessTokenGeneration;
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}