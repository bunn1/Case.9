# WUDNodeAuthentication
Tutorial - authenticataion sessionbased application using Nodejs

**How to setup application**

1. Clone git repo branch
2. Install dependencies `npm i`
3. Copy file `.env-example` to file named `.env`
4. Use `.env` file to set application secrets | variables. 
   
**How to run application**

1. Start server `node server` 
2. Open a browser and visit localhost:3000

___

## Comments...

### Server event order
1. dependencies
2. middleware | sessions, handle posts
3. routes | endpoints: api response json, render page using template engine
4. static files
5. 404 not found - custom page | info
6. 500 server error
7. listen on server requests

### Template engine

EJS - Embedded JavaScript templating

Use Visual Studio Code extension EJS Language support 

https://ejs.co/

*folder structure*

- views
  - partials
    - header.ejs
    - footer.js
    - nav.ejs 
- index.ejs
- about.ejs
- user.ejs
- ...


### Routes

- routes
  - route-start.js
  - route-about.js

### MVC - Model View Controller

*folder structure*

- controllers
  - controller-user.js
- models
  <!-- model-user.js ... if class | schema - User.js  -->
  - User.js
  - UserSchema.js
- views
  - user.ejs
  - login.ejs
  - register.ejs
  - users.ejs
  - ...

### MongoDB

Set MongoDB URL and MongoDB database name (collection) in `.env file`
- MONGODB_URL="mongodb+srv://...?retryWrites=true&w=majority"
- MONGODB_NAME=""

