import getUserFromReq from './auth';

export default async function handler(req, res) {
  const user = await getUserFromReq(req);
  res.status(200).json({ id: user.id, username: user.username });
}