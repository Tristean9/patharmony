import {JwtPayload} from 'jsonwebtoken';
import {Role} from './Role';

export interface DecodedToken extends JwtPayload {
    id: string;
    role: Role;
}
