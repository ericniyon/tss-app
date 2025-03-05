export declare class PasswordEncryption {
    hashPassword(pass: any): Promise<string>;
    comparePassword(newPassword: string, currPassword: string): Promise<boolean>;
}
