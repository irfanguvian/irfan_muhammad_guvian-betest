import { UserRepository } from "../../../application/repository/user.repository.js";
import { UserUsecase } from "../../../application/usecases/user.usecase.js";
import { userModelHandler } from "../../database/mongoDB/user.model.js";
import { UserController } from "../controllers/user.controller.js";
import { UserMiddleware } from "../middleware/user.middleware.js";

export function userRouter(diHash) {
    const {express, mongoose, clientRedis, lodash, uuidv4, axios} = diHash;
    const router = express.Router();

    const userModel = userModelHandler(mongoose);

    const userRepository = new UserRepository({userModel, clientRedis })
    const userUsecase = new UserUsecase({userRepository, lodash, uuidv4, axios});
    const userController = new UserController({userUsecase});
    const userMiddleware = new UserMiddleware({userUsecase});

    router.post('/create', userController.createUserHandler.bind(userController));
    router.put('/update',userMiddleware.validateUserTokenHandler.bind(userMiddleware) ,userController.updateUserHandler.bind(userController));
    router.delete('/delete',userMiddleware.validateUserTokenHandler.bind(userMiddleware) ,userController.deleteUserHandler.bind(userController));
    router.get('/all',userMiddleware.validateUserTokenHandler.bind(userMiddleware) ,userController.getAllUserHandler.bind(userController));
    router.get('/account-number/:accountNumber', userController.getUserByAccountNumberHandler.bind(userController));
    router.get('/identity-number/:identityNumber', userController.getUserByIdentityNumberHandler.bind(userController));

    return router;
}