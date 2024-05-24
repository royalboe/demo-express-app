#!/bin/bash

# Install Nodemon to help restart server
# It is a development package dependency
npm install nodemon --save-dev
npm install --save express
npm install body-parser --save

# For HTML templating
npm install --save ejs pug

# Install version 3 due to a breaking change
npm install --save express-handlebars@3.0

# Install mysql2
npm install --save mysql2

# Install sequelize
npm install --save sequelize

# Install mongoose
npm install mongoose --save

# Install express session
npm install --save express-session

# Install mogodb session
npm install --save connect-mongodb-session

# Install bcrpyt
npm install --save bcrypt

# Install bcryptjs
npm install --save bcryptjs

# Install csrf for protection
npm install --save csurf

# For a mailling server
npm install --save nodemailer nodemailer-sendgrid-transport