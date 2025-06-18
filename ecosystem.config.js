export default {
  apps: [
    {
      name: 'kamba-app',
      script: () => {
        const env = process.env.NODE_ENV
        if (env === 'production') {
          return './server.js'
        }
        return './ace.js'
      },
      args: () => {
        const env = process.env.NODE_ENV
        if (env === 'production') {
          return []
        }
        return ['--', 'serve', '--hmr']
      },
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: '.',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  // deploy: {
  //   production: {
  //     user: 'SSH_USERNAME',
  //     host: 'SSH_HOSTMACHINE',
  //     ref: 'origin/master',
  //     repo: 'GIT_REPOSITORY',
  //     path: 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
}
