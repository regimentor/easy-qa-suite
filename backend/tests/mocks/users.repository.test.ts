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
  mockVerify: ReturnType<typeof mock>;
  restoreOriginal: () => void;
} {
  // Сохраняем оригинальный метод хеширования пароля
  const originalHash = Bun.password.hash;
  const originalVerify = Bun.password.verify;

  // Создаем мок для метода хеширования пароля
  const mockHash = mock(() => Promise.resolve("mocked-password-hash"));
  const mockVerify = mock(() => Promise.resolve(true));

  // Заменяем оригинальный метод мок-функцией
  Object.defineProperty(Bun.password, "hash", {
    value: mockHash,
    configurable: true,
  });
  
  Object.defineProperty(Bun.password, "verify", {
    value: mockVerify,
    configurable: true,
  });

  // Возвращаем объект с моком и функцией для восстановления оригинала
  return {
    mockHash,
    mockVerify,
    restoreOriginal: () => {
      Object.defineProperty(Bun.password, "hash", {
        value: originalHash,
        configurable: true,
      });
      Object.defineProperty(Bun.password, "verify", {
        value: originalVerify,
        configurable: true,
      });
    },
  };
}

// Helper function to mock password verification
export function mockPasswordVerification(isValid: boolean = true) {
  const originalVerify = Bun.password.verify;
  const mockVerify = mock(() => Promise.resolve(isValid));
  
  Object.defineProperty(Bun.password, "verify", {
    value: mockVerify,
    configurable: true,
  });
  
  return {
    mockVerify,
    restoreOriginal: () => {
      Object.defineProperty(Bun.password, "verify", {
        value: originalVerify,
        configurable: true,
      });
    }
  };
}
