export class UserMiddleware {
    constructor({userUsecase}) {
        this.userUsecase = userUsecase;
    }

    async validateUserTokenHandler(req, res, next) {
        const accessToken = req.header('Authorization').replace('Bearer ', '');
        try {
            const validate = await this.userUsecase.authMiddleware(accessToken);
            if(validate.success === false) {
                return res.status(401).json({ success:false, message: validate.message });
            }
            return next();
        } catch (error) {
            return res.status(500).json({ success:false, message: error.message });
        }
    }
}