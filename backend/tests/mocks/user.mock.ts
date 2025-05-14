import type { User } from "@prisma/client";

export type IUser = {} & User;

// Определяем тип для создания пользователя
export type TCreateUserMock = {
  username: string;
  password: string;
};

// Функция для создания мок-пользователя с заданными параметрами
export function createMockUser(partialUser?: Partial<IUser>): IUser {
  return {
    id: partialUser?.id ?? BigInt(1),
    username: partialUser?.username ?? "testuser",
    password_hash: partialUser?.password_hash ?? "mocked-password-hash",
    full_name: partialUser?.full_name ?? null,
    email: partialUser?.email ?? null,
    created_at: partialUser?.created_at ?? new Date(),
    updated_at: partialUser?.updated_at ?? new Date(),
  };
}

// Предопределенные тестовые пользователи
export const mockUsers = [
  createMockUser({
    id: BigInt(1),
    username: "user1",
    full_name: "First User",
    email: "user1@example.com",
  }),
  createMockUser({
    id: BigInt(2),
    username: "user2",
    full_name: "Second User",
    email: "user2@example.com",
  }),
];

// Функция для создания тестового пользователя для входных данных
export function createUserInput(partial?: Partial<TCreateUserMock>): TCreateUserMock {
  return {
    username: partial?.username ?? "newuser",
    password: partial?.password ?? "password123",
  };
}
