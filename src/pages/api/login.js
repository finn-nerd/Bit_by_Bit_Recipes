import db, { withClient } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password." });
    }

    try {
        // Look up the user in the database
        const result = await withClient(async (client) => {
            const dbResult = await client.query("SELECT * FROM users WHERE username = $1", [username]);

            if (dbResult.rows.length === 0) {
                return { status: 401, data: { message: "Invalid credentials." } };
            }

            const user = dbResult.rows[0];
            // Compare the provided password with the stored encrypted password
            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                return { status: 401, data: { message: "Username or password is incorrect!" } };
            }

            // Sign a JWT
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "3hr" }, // Session lasts 3 hours
            );

            // Return the result with status, data and token
            return {
                status: 200,
                data: { message: "Login successful!" },
                token: token,
            };
        });

        // Set the JWT in a cookie
        res.setHeader(
            "Set-Cookie",
            serialize("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 3, // Cookie expires after 3 hours
            }),
        );

        // Return the response
        return res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
