import db, { withClient } from './db'
import bcrypt from 'bcrypt';
import getUserFromReq from './auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { oldPassword, newPassword } = req.body;
  
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required' });
  }
  
  try {
    // Authenticate the user
    const user = await getUserFromReq(req);
    
    const result = await withClient(async (client) => {
      // Get the current password hash
      const userResult = await client.query(
        'SELECT password FROM users WHERE id = $1',
        [user.id]
      );
      
      if (userResult.rows.length === 0) {
        return { status: 404, data: { message: 'User not found' } };
      }
      
      // Verify old password
      const currentPasswordHash = userResult.rows[0].password;
      const passwordMatch = await bcrypt.compare(oldPassword, currentPasswordHash);
      
      if (!passwordMatch) {
        return { status: 401, data: { message: 'Current password is incorrect' } };
      }
      
      // Hash the new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      
      // Update the password
      await client.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [newPasswordHash, user.id]
      );
      
      return { status: 200, data: { message: 'Password updated successfully' } };
    });
    
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(error.status || 500).json({ 
      message: error.message || 'Server error'
    });
  }
}