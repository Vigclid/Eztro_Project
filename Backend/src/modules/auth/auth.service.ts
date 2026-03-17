import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../../config/jwt";
import { userService } from "../users/user.service";
import { IUser } from "../users/user.model";
import { IRole } from "../roles/role.model";
import { IGoogleUserInfo } from "./auth.model";
import { uploadImage } from "../../utils/imageUtils";

export class AuthService {
  static async login(email: string, password: string, selectedRole?: string) {
    const users: IUser[] = await new userService().getAllPopulated();

    const user = users.find((u: IUser) => u.email === email);
    if (!user) return { status: 0, message: "Email not exists" };

    if (!user.statusActive) return { status: 0, message: "Your account has been disabled" };

    if (user.loginFailedTime && user.loginFailedTime > new Date()) {
      const timeDifference = user.loginFailedTime.getTime() - new Date().getTime();
      const timeRemaining = Math.abs(timeDifference) / 1000;
      return { status: 0, message: `Your account has been locked for ${timeRemaining} seconds` };
    }
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      user.accessFailedCount = user.accessFailedCount + 1;
      if (user.accessFailedCount % 3 === 0) {
        user.loginFailedTime = new Date(Date.now() + 15 * 1000);
      }
      await user.save();
      return { status: 0, message: "Wrong password" };
    }

    const roleName =
      typeof user.roleId === "string" ? user.roleId : (user.roleId as IRole)?.name;

    if (selectedRole && roleName !== selectedRole) {
      return {
        status: 0,
        message: "Vai trò đăng nhập không đúng với tài khoản",
      };
    }

    user.accessFailedCount = 0;
    user.loginFailedTime = null;
    await user.save();

    // Ensure roleId is populated before encoding JWT
    const role = typeof user.roleId === "string" 
      ? user.roleId 
      : (user.roleId as IRole)?.name;

    if (!role) {
      return { status: 0, message: "User role not found" };
    }

    const accessToken = jwt.sign(
      { id: user.id, role: role },
      jwtConfig.secret as Secret,
      { expiresIn: jwtConfig.expiresIn } as SignOptions
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      jwtConfig.secret as Secret,
      { expiresIn: jwtConfig.refreshExpiresIn } as SignOptions
    );

    return { status: 1, accessToken, refreshToken, user };
  }

  static signByUser(user: IUser) {
    const accessToken = jwt.sign(
      { id: user.id, role: (user.roleId as IRole).name },
      jwtConfig.secret as Secret,
      { expiresIn: jwtConfig.expiresIn } as SignOptions
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      jwtConfig.secret as Secret,
      { expiresIn: jwtConfig.refreshExpiresIn } as SignOptions
    );
    return { accessToken, refreshToken, user };
  }

  static refresh(token: string) {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as { id: number };
      const newAccessToken = jwt.sign(
        { id: decoded.id },
        jwtConfig.secret as Secret,
        {
          expiresIn: jwtConfig.expiresIn,
        } as SignOptions
      );
      return newAccessToken;
    } catch {
      return null;
    }
  }

  static async loginWithGoogle(googleUserInfo: IGoogleUserInfo) {
    try {
      const userServiceInstance = new userService();
      let user = await userServiceInstance.getByEmail(googleUserInfo.email);
      if (!user) {
        await userServiceInstance.create({
          profilePicture: (await uploadImage(googleUserInfo.picture, 1, false)).url,
          firstName: googleUserInfo.family_name,
          lastName: googleUserInfo.given_name,
          phoneNumber: "",
          dateOfBirth: new Date(),
          password: Math.random().toString(36).slice(-8),
          email: googleUserInfo.email,
          statusActive: true,
          accessFailedCount: 0,
          loginFailedTime: null,
        });
        user = await userServiceInstance.getByEmail(googleUserInfo.email);
      }
      return user;
    } catch (error: any) {
      return null;
    }
  }
}
