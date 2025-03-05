import admin from "firebase-admin";

// Initialize Firebase Admin SDK
import serviceAccount from "path/to/serviceAccountKey.json";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Function to send multicast notifications using async/await
async function sendMulticastNotification(title, messageBody, registrationTokens) {
  try {
    // Define your message payload
    const message = {
      notification: {
        title: title || 'Title of Notification',
        body: messageBody
      }
    };

    // Send the notification using sendMulticast
    const response = await admin.messaging().sendMulticast({ tokens: registrationTokens, notification: message.notification });
    console.log('Successfully sent multicast notification:', response);
    return true;
  } catch (error) {
    console.error('Error sending multicast notification:', error);
    return false;
  }
}