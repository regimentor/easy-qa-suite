import { mock } from "bun:test";

// Определяем тип для моков репозитория
export type UsersRepositoryMock = {
  findBy: ReturnType<typeof mock>;
  firstFindBy: ReturnType<typeof mock>;
  create: ReturnType<typeof mock>;
};

// Создаем и экспортируем моки для репозитория пользователей
export const usersRepositoryMock: UsersRepositoryMock = {
  findBy: mock(() => Promise.resolve([])),
  firstFindBy: mock(() => Promise.resolve(null)),
  create: mock(() => Promise.resolve({})),
};

// Функция для мокирования репозитория пользователей
export function mockUsersRepository() {
  // Мокируем репозиторий пользователей
  mock.module("../../src/repositories/users.repository", () => {
    return {
      usersRepository: usersRepositoryMock,
    };
  });
}

// Функция для создания мока хеширования паролей
export function mockPasswordHashing(): {
  mockHash: ReturnType<typeof mock>;
  restoreOriginal: () => void;
} {
  // Сохраняем оригинальный метод хеширования пароля
  const originalHash = Bun.password.hash;

  // Создаем мок для метода хеширования пароля
  const mockHash = mock(() => Promise.resolve("mocked-password-hash"));

  // Заменяем оригинальный метод мок-функцией
  Object.defineProperty(Bun.password, "hash", {
    value: mockHash,
    configurable: true,
  });

  // Возвращаем объект с моком и функцией для восстановления оригинала
  return {
    mockHash,
    restoreOriginal: () => {
      Object.defineProperty(Bun.password, "hash", {
        value: originalHash,
        configurable: true,
      });
    },
  };
}
