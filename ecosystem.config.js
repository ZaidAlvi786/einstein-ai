module.exports = {
    apps : [{
      name: 'nextjs-app',
      script: 'npm',
      args: 'start  -- --port=80',
      cwd: '/home/ubuntu/home/app',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }]
  };
  