import * as argon2 from 'argon2';

export class PasswordUtility {
  /** Хэшировать пароль. **/
  public static hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}
