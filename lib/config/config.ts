import path from "path";

// import .env variables
require("dotenv-safe").config({
  path: path.join(__dirname, "./../../.env"),
  sample: path.join(__dirname, "./../../.env.example")
});

const config = {
  app: {
    name: process.env.APP_NAME,
    service: process.env.APP_SERVICE,
    version: process.env.APP_VERSION,
    env: process.env.NODE_ENV,
    host: process.env.APP_HOST,
    clientHost: process.env.APP_CLIENT_HOST,
    shutdown: process.env.APP_SHUTDOWN,
    port: process.env.PORT || 3000
  },
  api: {
    base_url: process.env.API_BASE_URL
  },
  db: {
    system: {
      uri: [
        "postgres://",
        process.env.POSTGRES_USER,
        ":",
        encodeURIComponent(process.env.POSTGRES_PASS || ""),
        "@",
        process.env.POSTGRES_HOST,
        ":",
        process.env.POSTGRES_PORT,
        "/",
        process.env.POSTGRES_DB
      ].join("")
    }
  }
};

export default config;
