import { Identifier } from "../../../interfaces/internal/io/Database";
import { User } from "../../../interfaces/internal/data-models/fantasy";
import crypto from "node:crypto";
import { inject } from "../dependency-injection/inject";
import { UserService } from "../UserService";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";

export abstract class Authorization {
  private static userService = inject(UserService);

  public static async authorize(
    userId: Identifier<User>,
    password: string
  ): Promise<boolean> {
    if (password.length < 8) {
      throw new NotAuthorizedException(
        "Password too short. 8 characters required."
      );
    }
    const hash = Authorization.hash(password);
    const user = await Authorization.userService.get(userId);
    if (!user) {
      await Authorization.userService.save({
        id: userId,
        timestamp: Date.now(),
        authorizationHash: hash,
        strikes: 0,
        selections: [],
      });
      return true;
    }

    return hash === user.authorizationHash;
  }

  public static hash(s: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(s, salt, 1000, 64, "sha512").toString("hex");

    return hash;
  }
}
