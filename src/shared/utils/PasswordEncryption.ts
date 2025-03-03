import * as bcrypt from 'bcrypt';
export class PasswordEncryption {
    async hashPassword(pass: any): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(pass, salt);
        return hashedPassword;
    }

    async comparePassword(
        newPassword: string,
        currPassword: string,
    ): Promise<boolean> {
        const result = await bcrypt.compare(newPassword, currPassword);
        return result;
    }
}
