import {clientPrisma} from "db/db";

Bun.serve({
    port:8081,
    fetch(req,server){
        if (server.upgrade(req)){
            return;
        }
        return new Response("Upgrade failed", { status: 500 });
    },

    websocket:{
        message(ws,message){
            clientPrisma.user.create({
                data:{
                    email: Math.random().toString()+"@gmail.com",
                    password: Math.random().toString(),
                    name: Math.random().toString()
                }
            });
            ws.send(message);
        }
    }

})