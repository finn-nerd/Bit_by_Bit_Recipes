import db, { withClient } from "./db";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

// Extract and verify JWT from cookie or Authorization header
export default async function getUserFromReq(req) {
    let token = null;
    // Check Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.slice(7);
    } else if (req.headers.cookie) {
        // Check cookie
        const cookies = parse(req.headers.cookie);
        token = cookies.token;
    }

    if (!token) {
        const err = new Error("Not authenticated");
        err.status = 401;
        throw err;
    }

    // Verify token
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        const err = new Error("Invalid or expired token");
        err.status = 401;
        throw err;
    }

    // Fetch user record using withClient
    try {
        const userData = await withClient(async (client) => {
            const { rows } = await client.query("SELECT id, username FROM users WHERE id = $1", [payload.userId]);

            if (!rows.length) {
                const err = new Error("User not found");
                err.status = 401;
                throw err;
            }

            return rows[0];
        });

        return { id: userData.id, username: userData.username };
    } catch (error) {
        // If the error already has a status, pass it through
        if (error.status) {
            throw error;
        }

        // Otherwise wrap in a standard error
        console.error("Database error in getUserFromReq:", error);
        const err = new Error("Authentication error");
        err.status = 500;
        throw err;
    }
}
