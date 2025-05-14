let webPort = process.env.WEB_PORT !== undefined ? +process.env.WEB_PORT : 80;

export const config = {
  webPort,
};
