import { RETURN_FAILED_MESSAGE } from "../../../domain/constant/constant.js";

export class UserController {
  constructor({ userUsecase }) {
    this.userUsecase = userUsecase;
  }

  async createUserHandler(req, res) {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: null
            }
        }
        try {
            const createUser = await this.userUsecase.createUser(req.body);
            result.success = createUser.success;
            result.message = createUser.message;
            result.data = createUser.data.user
            return res.status(200).json(result);
        } catch (error) {
            result.message = error.message;
            return res.status(500).json(result);
        }
    }

  async updateUserHandler(req, res) {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE
        }
        try {
            const updateUser = await this.userUsecase.updateUser(req.body);
            result.success = updateUser.success;
            result.message = updateUser.message;
            return res.status(200).json(result);
        } catch (error) {
            result.message = error.message;
            return res.status(500).json(result);
        }

    }

    async deleteUserHandler(req, res) {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE
        }
        try {
            const deleteUser = await this.userUsecase.deleteUser(req.body);
            result.success = deleteUser.success;
            result.message = deleteUser.message;
            return res.status(200).json(result);
        } catch (error) {
            result.message = error.message;
            return res.status(500).json(result);
        }
    }

    async getAllUserHandler(req, res) {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: []
            }
        }
        try {
            const getUser = await this.userUsecase.getAllUser();
            result.success = getUser.success;
            result.message = getUser.message;
            result.data = getUser.data.user
            return res.status(200).json(result);
        } catch (error) {
            result.message = error.message;
            return res.status(500).json(result);
        }
    }

    async getUserByAccountNumberHandler(req, res) {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: null
            }
        }
        try {
            const getUser = await this.userUsecase.getUserByAccountNumber(req.params);
            result.success = getUser.success;
            result.message = getUser.message;
            result.data = getUser.data.user
            return res.status(200).json(result);
        } catch (error) {
            result.message = error.message;
            return res.status(500).json(result);
        }
    }

    async getUserByIdentityNumberHandler(req, res) {
        const result = {
            success: false,
            message: RETURN_FAILED_MESSAGE,
            data: {
                user: null
            }
        }
        try {
            const getUser = await this.userUsecase.getUserByIdentityNumber(req.params);
            result.success = getUser.success;
            result.message = getUser.message;
            result.data = getUser.data.user
            return res.status(200).json(result);
        } catch (error) {
            result.message = error.message;
            return res.status(500).json(result);
        }
    }
}