import { Server } from "./server";

const port = parseInt(process.env.PORT ?? "5000");

const server = new Server(port);

server.listen(port => {
    console.log(`Server is listening on https://localhost:${port}`);
});