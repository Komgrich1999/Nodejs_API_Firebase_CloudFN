const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use('/api/v1',app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended : false }));

const database = admin.firestore();
const userCollection = 'school';

let Student_obj = {
    name : "",
    phonenumber : "",
    age : 0,
    retire : false,

}
//exports const webApi = functions.https.onRequest(main);

exports.addStudent = functions.https.onRequest( async (req,res) => {
        try {
            const student = {
                name : req.body['name'],
                phonenumber : req.body['phonenumber'],
                age : req.body['age'],
                retire : req.body['retire']
            }

            const new_doc = await database.collection("school").add(student);
            res.status(201).send(`Create a new user : ${new_doc}`)
        } catch (error) {
            res.status(400).send('User should contain all things!')
        }
    });

exports.getAllStudent = functions.https.onRequest( async (req,res) => {
        try {
            const student_query_snapshot = await database.collection("school").get();
            const school = [];
            student_query_snapshot.forEach(
                (doc) => {
                    school.push({
                        id : doc.id,
                        data : doc.data()
                    });
                }
            );
            res.status(200).json(school);
        }catch (error) {
            res.status(500).send(error)
        }
    } )

