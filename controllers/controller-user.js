// import database
import{ connectDatabase } from '../configurations/mongodb.js';
let db = await connectDatabase();

// models | Schemas
import {
    UserSchema
} from '../models/UserSchema.js';
import bcrypt from 'bcrypt';

import Tweet from '../models/tweets.js'
import {
    ObjectId
} from 'mongodb'

const saltRounds = 10;
// Hitta specifik user i databasen och sen returneras den.
async function listUsers() {
    let users = await db.collection("users").find({}).toArray();

    return users;
}

// Lägg till användare
async function addUser(obj) {

    // check if obj passes schema validation
    // https://www.npmjs.com/package/validate
    // Kollar om rätt antal bokstäver 
    const errors = UserSchema.validate(obj);

    // console.log("errors", errors);
    // big no-no to store password in plain text....
    // https://www.npmjs.com/package/bcrypt

    // return
    if (errors.length > 0) {
        return {
            error: errors[0].message
        };
    }

    // Funktionen getUsername används för att kontrollera om användarnamnnet redan finns i systemet.
    const user = await getUsername(obj.username);

    // Om inte användar namnet finns krypteras lösenordet.
    if (!user) {

        // hash
        const hash = bcrypt.hashSync(obj.password, saltRounds);
        obj.password = hash;

        // Om det inte är några fel - sparas till databasen och returnera resultat   
        return await db.collection("users").insertOne(obj);

    } else {
        return {
            error: "Användare finns redan!"
        };
    }
}

// E. Funktion körs av route-user - kollar om lösenord är rätt - går tillbaka till route-user när funktionen är färdig.
async function loginUser(obj) {

    // check if users exists
    const user = await getUsername(obj.username);

    if (!user) {
        return {
            error: "Login fail"
        };
    }

    // compare hashed obj.password | hashed password in database
    const matchPassword = bcrypt.compareSync(obj.password, user.password);

    if (!matchPassword) {
        return {
            error: "Login fail"
        };
    } else {
        return {
            result: "success",
            message: "Password match",
            user: user
        }
    }
}

async function getUsername(username) {
    return await db.collection("users").findOne({
        username: username
    });
};


export {
    listUsers,
    addUser,
    loginUser, 
    getUsername , 
    Tweet
};