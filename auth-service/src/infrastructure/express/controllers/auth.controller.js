import { RETURN_FAILED_MESSAGE } from "../../../domain/constant/constant.js";

export class AuthController {
    constructor({ authUsecase }) {
        this.authUsecase = authUsecase;
    }

    async generateTokenHandler(req, res) {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                accessToken: null,
                refreshToken: null
            }
        }
        try {
            const generateToken = await this.authUsecase.generateToken(req.body);
            result.success = generateToken.success;
            result.message = generateToken.message;
            result.data.accessToken = generateToken.data.accessToken;
            result.data.refreshToken = generateToken.data.refreshToken;
            return res.status(200).json(result);
        } catch (error) {
            result.message = error.message;
            return res.status(500).json(result);
        }
    }

    async verifyTokenHandler(req, res) {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: null
            }
        }
        try {
            const verifyToken = await this.authUsecase.verifyToken(req.body);
            result.success = verifyToken.success;
            result.message = verifyToken.message;
            result.data.user = verifyToken.data.user;
            return res.status(200).json(result);
        } catch (error) {
            result.message = error.message;
            return res.status(500).json(result);
        }
    }

    async generateTokenWithRefreshTokenHandler(req, res) {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                accessToken: null
            }
        }
        try {
            const generateToken = await this.authUsecase.generateTokenWithRefreshToken(req.body);
            result.success = generateToken.success;
            result.message = generateToken.message;
            result.data.accessToken = generateToken.data.accessToken;
            return res.status(200).json(result);
        } catch (error) {
            result.message = error.message;
            return res.status(500).json(result);
        }
    }
}