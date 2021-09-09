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

// Get All Students service
    exports.getAllStudent = functions.https.onRequest( async ( req , res ) => {
        try {
            const student_query_snapshot = await database.collection(userCollection).get();
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
    });

// Get Specific Student services
    exports.getSpecificStudent = functions.https.onRequest( async ( req , res ) => {
        try {
            const Id = req.query.id
            database.collection(userCollection).doc(Id).get()
            .then( student => { 
                if(!student.exists) throw new Error('Student not found');
                res.status(200).json({ id : student.id , data : student.data() })
            })
        } catch (error) {
            res.status(500).send(error)
        }
    });      

// Add New Student service
    exports.addStudent = functions.https.onRequest( async ( req , res ) => {
        try {
            const student = {
                name : req.body['name'],
                phonenumber : req.body['phonenumber'],
                age : req.body['age'],
                retire : req.body['retire']
            }

            const new_doc = await database.collection(userCollection).add(student);
            res.status(201).send(`Create a new user : ${new_doc}`)
        } catch (error) {
            res.status(400).send('User should contain all things!')
        }
    });

// Update Specific Student service
    exports.updateSpecificStudent = functions.https.onRequest( async ( req , res ) => {
        const Id = req.query.id;
        await database.collection(userCollection).doc(Id).set(req.body,{ merge :true })
        .then( () => res.json({ id : Id }) )
        .catch( (error) => res.status(500).send(error) )
    });

// Delete Specific Student service
    exports.deleteSpecificStudent = functions.https.onRequest( async ( req , res ) => {
        const Id = req.query.id
        database.collection(userCollection).doc(Id).delete()
        .then( () => res.status(204).send("Document successfully deleted!"))
        .catch( function (error) {
            res.status(500).send(error);
        })
    });