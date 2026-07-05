import { app } from "./app";

import { ClientMessageType, ServerMessageType } from "@nexus/shared-types";

const ctx = "[AgentSidecar]"

app.on("connection", (socket) => {
    console.log(`${ctx} - Client connected!`);

    socket.on("message", (raw) => {
        const message: ClientMessageType = JSON.parse(Buffer.from(raw).toString());

        console.log(`${ctx} - Message received: ${JSON.stringify(message)}`)

        let response: ServerMessageType = {} as ServerMessageType;

        switch(message.type) {
            case 'get_metrics': {
                response = {
                    type: 'metrics_update',
                    payload: { cpu: 0, gpu: 0, ram: 0, temperature: 0, timestamp: 0 }
                }
            } break;
        }

        socket.send(JSON.stringify(response));
    })
})

console.log(`${ctx} - Application running on port 8181`);