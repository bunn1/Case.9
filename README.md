##Tweet Application##
A simple application where you have the opportunity to share tweets if you have created a account. You can share public or private tweets. Here you also have the possibility to edit or remove your post!

**How to setup application**

1. Clone git repo branch
2. CD into project "cd Case.9"
3. Install dependencies `npm i`
4. Copy file `.env-example` to file named `.env`
5. Use `.env` file to set application secrets | variables. 
6. 5.1: if you don't have an accout on Mongo DB you need   to  create one and after that create a database so you get the MongoDB Connection string
   
**How to run application**

1. Start server `node server` 
2. Open a browser and visit localhost:3000

___


### MongoDB

Set MongoDB URL and MongoDB database name (collection) in `.env file`
- MONGODB_URL="mongodb+srv://...?retryWrites=true&w=majority"
- MONGODB_NAME=""

