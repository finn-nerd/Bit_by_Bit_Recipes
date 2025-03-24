export default function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        console.log('Received:', username);
        console.log('Received:', password);
    
        // add backend logic here for login

        // temporary response
        res.status(200).json({ message: 'SERVER RECEIVED: ' + username + ' / ' + password });
    }
    else { res.status(405).json({ message: 'Method Not Allowed' }); }
}