let webPort = Bun.env.WEB_PORT !== undefined ? +Bun.env.WEB_PORT : 80;

export const config = {
  webPort,
};
