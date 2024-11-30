// Client-side code
import { io } from 'socket.io-client';


(() => {
  const socket = io('http://localhost:8080/notifications');

  console.log('test');

  socket.on("connect", () => {
    console.log("connected");
    // updateUserInfo();
  });
  const userId = 'cf6b2203-d296-4846-9a8b-408b4c8ce8fe';
  socket.on(`newtask:${userId}`, (notification) => {
    console.log('Received notification:', notification);
    // Handle the notification in your UI
  });
})();
