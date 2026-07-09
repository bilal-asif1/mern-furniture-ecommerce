import jwt from 'jsonwebtoken';

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export default createToken;
