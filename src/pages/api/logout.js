import { serialize } from "cookie";

export default function handler(req, res) {
    // Clear the token cookie
    res.setHeader(
        "Set-Cookie",
        serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
        }),
    );
    res.status(200).json({ message: "Logged out" });
}
