/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendAttendanceNotifications = functions.pubsub
  .schedule('5 12 * * *')
  .timeZone('WAT')
  .onRun(async (context) => {
    try {
      // Get today's date
      const today = new Date();

      // Reference to the "classes" collection
      const classesCollection = admin.firestore().collection('classes');

      // Query the classes collection to get all classes
      const classesQuery = await classesCollection.get();

      // Loop through the classes
      classesQuery.forEach(async (classDoc) => {
        const className = classDoc.id;
        const attendanceCollection = classDoc.ref.collection('attendance');
        const todayAttendanceDoc = attendanceCollection.doc(today.toISOString());
        const attendanceSnapshot = await todayAttendanceDoc.get();

        if (!attendanceSnapshot.exists) {
          // Attendance not marked for today; send notifications

          // Get the admin users and send notifications
          const adminCollection = admin.firestore().collection('Admin');
          const adminDocs = await adminCollection.get();

          adminDocs.forEach(async (adminDoc) => {
            const admindata = adminDoc.data();
            const existingNotifications = admindata.notifications || [];
      
            const notificationData = {
              title: 'Attendance Reminder',
              message: `Attendance has not been marked for ${today.toISOString()}.`,
              status: true,
              date: admin.firestore.FieldValue.serverTimestamp(),
            };

            const updatenotif = [...existingNotifications, notificationData];


            await updateDoc(adminDoc, {
              notifications: updatenotif,
              notificationactive: "true",
            });          });
        }
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
    }

    return null;
  });

