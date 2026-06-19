import mysql from 'mysql2/promise';
export declare const db: mysql.Pool;
export declare const testConnection: () => Promise<void>;
