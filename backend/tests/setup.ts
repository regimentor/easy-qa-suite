import { beforeEach, mock } from "bun:test";
console.log("Setup tests");

export const loggerMock = {
  debug: mock(() => {}),
  info: mock(() => {}),
  warn: mock(() => {}),
  error: mock(() => {}),
};

mock.module("../src/logger/logger", () => ({
  logger: loggerMock,
}));

beforeEach(() => {
  loggerMock.debug.mockReset();
  loggerMock.info.mockReset();
  loggerMock.warn.mockReset();
  loggerMock.error.mockReset();
});
