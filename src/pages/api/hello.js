const admin = require('firebase-admin');
const { updateDoc } = require("firebase/firestore"); // Import the updateDoc function

// Initialize Firebase Admin
admin.initializeApp();

module.exports = async (req, res) => {
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

          await updateDoc(adminDoc.ref, {
            notifications: updatenotif,
            notificationactive: "true",
          });
        });
      }
    });

    res.status(200).send('Notification job completed.');
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).send('Internal Server Error');
  }
};
