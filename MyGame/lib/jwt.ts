import jwt from 'jsonwebtoken';

// Using a fallback for development if JWT_SECRET is not provided in .env.local
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_jwt_key_fallback';

export interface JWTPayload {
    uid: string;
    email?: string;
}

/**
 * Signs a payload to generate a JWT token.
 * @param payload JWTPayload including uid and optionally email.
 * @returns Signed JWT string.
 */
export const signJWT = (payload: JWTPayload): string => {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: '1h',
    });
};

/**
 * Verifies a JWT token.
 * @param token The token string.
 * @returns The decoded payload if valid, null otherwise.
 */
export const verifyJWT = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
