module.exports = {
  apps: [
    {
      name: 'hono-dev',
      script: 'npm',
      args: 'run dev',
      watch: true,
      ignore_watch: ['node_modules', '.git', '*.log'],
      watch_options: {
        followSymlinks: false
      }
    }
  ]
}
