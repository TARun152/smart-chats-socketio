const PORT=process.env.PORT||8800
const io=require('socket.io')(PORT,{
    cors:{
        origin:"*"
    }
});
let users=[]
const addUser=(socketId,userId)=>{
    // checking if user already exist or not
    !users.some(user=>user.userId===userId)&&users.push({socketId,userId})
}
// removing a user
const removeUser=(socketId)=>{
   users=users.filter(user=>user?.socketId!==socketId)
}
// getting  user
const getUser=(recieverId)=>{
    return users.find(user=>user?.userId===recieverId)
}
// on connect
io.on("connection", (socket) => {
    console.log("heyyoooo")
    // taking something from client
    socket.on("addUser",userId=>{
        addUser(socket.id,userId)
        // sending to client
        io.emit("getUser",users)
    })
    // on discconect
    socket.on("disconnect",()=>{
console.log("disconnected")
removeUser(socket.id)
io.emit("getUser",users)
    })
    // send and get msg
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        console.log(receiverId)
        const user1=getUser(receiverId)
        console.log(user1)
        if(user1)
        {
        io.to(user1.socketId).emit("getMessage",{
            senderId,
            text
        })
    }
    })
});