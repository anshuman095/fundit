import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createQueryBuilder, storeError } from "./helper/general.js";
import { makeDb } from "./db-config.js";
import Visitor from "./sequelize/visitorSchema.js";

const db = makeDb();

const handleConnection = (io) => async (socket) => {
    try {
        if (socket.handshake.origin === "http://192.168.1.45:5173/") {
            const ip = socket.handshake.address || socket.handshake.headers["x-forwarded-for"];
            console.log('socket.handshake.address===========', socket.handshake.address);
            console.log('ip====================', ip);
            const socketId = socket.id;
            socket.visitorIp = ip;
            const visitor = await db.query("SELECT * FROM visitor WHERE ip_address = ? LIMIT 1", [ip]);
            console.log('visitor=======================', visitor);
            if (visitor.length > 0) {
                await db.query("UPDATE visitor SET socket_id = ?, status = 'Active' WHERE ip_address = ?", [
                    socketId,
                    ip,
                ]);
            } else {
                const { query, values } = createQueryBuilder(Visitor, {
                    ip_address: ip,
                    socket_id: socketId,
                    status: "Active",
                });
                await db.query(query, values);
            }
        }
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
            const visitorIp = socket.visitorIp;

            if (visitorIp) {
                await db.query("UPDATE visitor SET socket_id = NULL, status = 'Inactive' WHERE ip_address = ?", [
                    visitorIp,
                ]);
                console.log(`Visitor with IP ${visitorIp} disconnected.`);
            }
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