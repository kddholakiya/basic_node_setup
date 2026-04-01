import { Socket } from "socket.io";
import CommanController from "./common";
const { getEpoch } = new CommanController();

var count = 0;
 let ioInstance : any;
const rootSocket = (io: any) => {
  ioInstance = io;
  io.on('connection', (socket: any) => {
    console.log(socket.id , "socket id");
    
    socket.on('disconnect', () => {
      count = count - 1
    });

    socket.on("Joinroom", (roomId: any) => {
      console.log(roomId , "in oin room");
      
      socket.join(roomId);
    })

    socket.on("leaveRoom", (roomId: any) => {
      socket.leave(roomId);
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected.');
    });
  });
}

const emitToRoom = (roomId : String,eventName :  String,data : any) => {
  
  ioInstance ? ioInstance.to(roomId).emit(eventName,data) : null
} 
const emitToChannel = (channelName: String,data : any) => {
  ioInstance ? ioInstance.emit(channelName,data) : null

}
export { emitToRoom,emitToChannel };
export default rootSocket;




