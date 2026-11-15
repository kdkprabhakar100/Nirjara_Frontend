// pm2 process config for the production SSR server on the VPS.
// Started/reloaded by .github/workflows/deploy-frontend.yml
module.exports = {
  apps: [
    {
      name: "nirjara-frontend",
      script: "server.mjs",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "3000",
        API_URL: "https://api.nirjarabeautysalon.com",
      },
      max_memory_restart: "400M",
    },
  ],
};
