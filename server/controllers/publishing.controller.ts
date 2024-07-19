import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
/** real-time notifications about published/publishing items*/
export default (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    console.log(`socket ${socket.id} connected for publishing`);
    socket.on('join course room', data => {
        console.log('join course room', data)
        socket.join(data.room)
        joinCourseRoom(data)
    })
    socket.on('leave course room', data => {
        console.log('leave course room', data)
        socket.leave(data.room)
        leaveCourseRoom(data)
    })
    socket.on('publish course', data => { 
        console.log('publish course', data)
        addToPendingApproval(data)
    })
    const leaveCourseRoom = async (data) => {
        try {
            io.emit('left course room');
        } catch (err) {
            console.log(err);
            io.to(data.room).emit('error', {error: 'Failed to leave course room'});
        }
    }

    const joinCourseRoom = async (data) => {
        try {
            io.emit('joined course room');
        } catch (err) {
            console.log(err);
            io.to(data.room).emit('error', {error: 'Failed to join course room'});
        }
    }

    const addToPendingApproval = async (data) => {
        try {
            io.emit('course pending approval admin')
        } catch(err) {
          console.log(err)
          io.to(data.room).emit('error', {error: 'Failed course pending approval request'});
        }
    }
}

