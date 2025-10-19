import type { ServerWebSocket } from "elysia/ws/bun";
import Elysia, { type TSchema } from "elysia";
import type { TypeCheck } from "elysia/type-system";
import { logger } from "./logger";

const app = new Elysia();

const handlers = new Map<string, (data: object) => void>();
const socketsConnected = new Map<
  string,
  ServerWebSocket<{
    id?: string;
    validator?: TypeCheck<TSchema>;
  }>
>();

function parseJsonToBuffer(data: object): Buffer {
  const jsonString = JSON.stringify(data);
  const buffer = Buffer.from(jsonString);
  return buffer;
}

function parseBufferToJson(arrayBuffer: any) {
  const decoder = new TextDecoder("utf-8");
  const jsonString = decoder.decode(arrayBuffer);
  const obj = JSON.parse(jsonString);
  return obj;
}

function addHandler(event: string, callback: (data: object) => void) {
  handlers.set(event, callback);
}

type SocketMessage = {
  event: string;
  body: any;
};

app.ws("/ws", {
  open(client) {
    socketsConnected.set(client.id, client.raw);
    client.send(
      parseJsonToBuffer({ event: "message", body: { message: "Hello World" } }),
    );
    logger.info(`New socket connected: ${client.id}`);
  },
  async message(ws, body) {
    logger.info(`${ws.id} => ${(body as any).event}`);
  },
  close(client) {
    socketsConnected.delete(client.id);
  },
});

/* setInterval(() => {
  socketsConnected.forEach(client => {
    client.send(parseJsonToBuffer({ event: "ping", data: { message: "hello client!"}}))
  }, 5000)
  console.log(`Clients connected: `, socketsConnected.size)
}) */

console.log("Running Web Socket");
app.listen(3000);
