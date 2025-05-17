import { usersRepository } from "../repositories/users.repository";
import { UserAlreadyExistsError } from "../errors/user.errors";

export type TCreateUser = {
  username: string;
  password: string;
};
async function createUser(user: TCreateUser) {
  const userExists = await usersRepository.firstFindBy({
    username: user.username,
  });
  if (userExists) {
    throw new UserAlreadyExistsError(user.username);
  }
  const passwordHash = await Bun.password.hash(user.password, {
    algorithm: "bcrypt",
  });

  const newUser = await usersRepository.create({
    username: user.username,
    password_hash: passwordHash,
  });

  return newUser;
}

async function findUsers() {
  const users = await usersRepository.findBy({});
  return users;
}

async function userExists(username: string) {
  const user = await usersRepository.firstFindBy({ username });
  return !!user;
}

async function verifyUserPassword(
  username: string,
  password: string,
): Promise<boolean> {
  const user = await usersRepository.firstFindBy({ username });
  if (!user) {
    return false;
  }
  const isValid = await Bun.password.verify(
    password,
    user.password_hash,
    "bcrypt",
  );
  return isValid;
}

export const userService = {
  createUser,
  findUsers,
  userExists,
  verifyUserPassword,
};
