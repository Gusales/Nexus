import { WebSocketServer } from 'ws'

export const app = new WebSocketServer({
    port: 8181
})