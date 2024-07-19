import { Server, Socket } from "socket.io";
import {socket_helper} from '../helpers';
import { DefaultEventsMap} from "socket.io/dist/typed-events";

/** for audio-visual-calling 
 * keep track of connected client sockets by storing and linking them to a uniquely generated random ID
 * 
*/
export default (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    let id: any;
    console.log(`socket ${socket.id} connected for calling`);
    /**
     * when new caller ID is requested
     * create unique ID/token, store connected socket, broadcasts ID to connected socket*/
    socket.on('new token', async () => {
      id = await socket_helper.create(socket); 
      if (id) {
        console.log('new token', id)
        socket.emit('new token', { id });
      } else {
        socket.emit('error', { error: 'Token generation failed' });
      }
    })
    /**
     * When caller starts a call using call receiver's token(data.to)
     * get call receiver's socket (if still connected) based on their socket id. Broadcast caller's ID to connected call receiver socket 
     * */
    socket.on('request', (data) => {
      const receiver = socket_helper.get(data.to); 
      if (receiver) {
        console.log('request', receiver)
        receiver.emit('request', { from: id }); 
      }
    })
    /**
     * When call receiver answers the call from a caller of token data.to
     * get caller's socket (now receiver) and broadcast to it, call receiver's ID and initial Local Session Description(...data) for PeerConnection
     * */
    socket.on('call', (data) => {
      const receiver = socket_helper.get(data.to);
      if (receiver) {
        console.log('call', receiver)
        receiver.emit('call', { ...data, from: id });
      } else {
          socket.emit('error', {error: `Invalid token ${data.to}. Token Invalid or expired.`});
      }
    })
    /**
     * When the call is stopped by caller
     * get socket of the called and notify them that the call has ended 
     * */
    socket.on('end', (data) => {
      const receiver = socket_helper.get(data.to);
      if (receiver) {
        console.log('end')
        receiver.emit('end');
      }
    })
    /**remove socket associated with id when it has disconnected or failed to connect*/
    socket.on('disconnect', (reason) => {
      socket_helper.remove(id);
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
}