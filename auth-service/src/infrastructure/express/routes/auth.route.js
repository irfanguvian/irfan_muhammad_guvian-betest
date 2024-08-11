import { accessTokenModelHandler } from "../../database/mongoDB/access_token.model.js";
import { AuthRepository } from "../../../application/repository/auth.repository.js";
import { AuthUsecase } from "../../../application/usecases/auth.usecase.js";
import { AuthController } from "../controllers/auth.controller.js";
import { refreshTokenModelHandler } from "../../database/mongoDB/refresh_token.model.js";

export function authRouter(diHash) {
    const { express, mongoose, uuidv4, lodash, jwt, axios, jwtDecode } = diHash;
    const router = express.Router();

    const accessTokenModel = accessTokenModelHandler(mongoose);
    const refreshTokenModel = refreshTokenModelHandler(mongoose);
    

    const authRepository = new AuthRepository({ accessTokenModel, refreshTokenModel });
    const authUsecase = new AuthUsecase({ authRepository ,jwt,lodash, uuidv4 , axios, jwtDecode});
    const authController = new AuthController({ authUsecase });

    router.post('/generate-token', authController.generateTokenHandler.bind(authController));
    router.post('/refresh-token', authController.generateTokenWithRefreshTokenHandler.bind(authController));
    router.post('/verify-token', authController.verifyTokenHandler.bind(authController));

    return router;
}