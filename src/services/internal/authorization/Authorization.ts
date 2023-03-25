import { Identifier } from "../../../interfaces/internal/io/Database";
import { User } from "../../../interfaces/internal/data-models/fantasy";
import bcrypt from "bcrypt";
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
    const user = await Authorization.userService.get(userId);

    if (!user) {
      const hash = Authorization.hash(password);
      await Authorization.userService.save({
        id: userId,
        timestamp: Date.now(),
        authorizationHash: hash,
        strikes: 0,
        selections: [],
      });
      return true;
    }

    return Authorization.compare(password, user.authorizationHash);
  }

  public static hash(s: string): string {
    const hash = bcrypt.hashSync(s, 10);
    return hash;
  }

  private static compare(s: string, hash: string): boolean {
    return bcrypt.compareSync(s, hash);
  }
}
