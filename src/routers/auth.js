import { Router } from "express";
import authController from "../controllers/auth.js";
import { validate, authRegisterSchema, authLoginSchema, authSendOTPSchema, authRefreshSchema } from "../validation/validation.js";

const router = Router();

router.post("/send-otp", validate(authSendOTPSchema), authController.sendOTP);
router.post("/register", validate(authRegisterSchema), authController.register);
router.post("/login", validate(authLoginSchema), authController.login);
router.post("/resend-otp", validate(authSendOTPSchema), authController.resendOTP);
router.post("/refresh", validate(authRefreshSchema), authController.refreshToken);

export default router;
