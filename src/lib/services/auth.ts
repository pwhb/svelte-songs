import { AUTH_SECRET_KEY, MONGODB_DATABASE } from '$env/static/private';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';
import { verify } from 'argon2';

const expirationTime = '1h';

// Generate a JWT token
export const generateToken = (user: any) =>
{
    const token = jwt.sign({ user }, AUTH_SECRET_KEY, { expiresIn: expirationTime });
    return token;
};

// Verify a JWT token
export const verifyToken = (token: string) =>
{
    try
    {
        const decoded = jwt.verify(token, AUTH_SECRET_KEY);
        return decoded;
    } catch (err)
    {
        return null;
    }
};

export const login = async ({ username, password }: { username: string; password: string; }) =>
{
    const error = { username: '', password: '' };
    const previous = { username };
    if (!username)
    {
        error.username = 'username cannot be empty';
    }
    if (!password)
    {
        error.password = 'password cannot be empty';
    }

    if (error.username || error.password)
    {
        return { error, previous };
    }

    const client = await clientPromise;
    const db = client.db(MONGODB_DATABASE);
    const col = db.collection('users');

    const user = (await col.findOne({ username })) as any;
    if (!user)
    {
        error.username = "user doesn't exist";
        return { error, previous };
    }

    const isCorrect = await verify(user.password, password as string);
    if (!isCorrect)
    {
        error.password = 'wrong password';
        return { error, previous };
    }
    const token = generateToken({
        username: user.username,
        role: user.role
    });

    return { token };
};