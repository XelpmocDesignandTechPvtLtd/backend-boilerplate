module.exports = {
  apps: [
    {
      name: "citest",
      script: "./index.js"
    }
  ],
  deploy: {
    production: {
      user: "ubuntu",
      host: "ec2-18-217-71-221.us-east-2.compute.amazonaws.com",
      key: "~/.ssh/tutorial.pem",
      ref: "origin/master",
      repo: "git@github.com:prakashsanker/api-express-boilerplate.git",
      path: "/home/ubuntu/citest",
      "post-deploy": "yarn install && pm2 startOrRestart ecosystem.config.js"
    }
  }
};
