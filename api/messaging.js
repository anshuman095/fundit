import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { storeError } from "./helper/general.js";
import { makeDb } from "./db-config.js";

const db = makeDb();

const handleConnection = (io) => async (socket) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.auth;
        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_KEY);
            const { id } = decodedToken;
            console.log(`User ${id} connected`);
            socket.user = decodedToken;
            await db.query("UPDATE users SET socket_id = ? WHERE id = ?", [
                socket.id,
                id,
            ]);
        } else {
            socket.emit("error", "Token is required, please login again");
            return;
        }
    } catch (error) {
        storeError(error);
        socket.emit("error", error);
        return;
    }

    socket.on("disconnect", async () => {
        try {
            const { id } = socket.user;
            await db.query("UPDATE users SET socket_id = NULL WHERE id = ?", [
                id,
            ]);
            console.log(`User ${socket.user.id} disconnected`);

            const checkOnlineUsers = await db.query(
                "SELECT id FROM users WHERE deleted = 0 AND socket_id IS NOT NULL"
            );
            const onlineUsers =
                checkOnlineUsers.length > 0
                    ? checkOnlineUsers.map((user) => user.id)
                    : [];
            io.emit("onlineUsers", onlineUsers);
        } catch (error) {
            storeError(error);
        }
    });
};

const initializeSocket = (server, app) => {
    try {
        const io = new Server(server, {
            cors: {
                origin: "*",
            },
        });

        io.on("connection", handleConnection(io));
        app.set("io", io);
        global.io = io;
    } catch (error) {
        storeError(error);
    }
};

export default initializeSocket;