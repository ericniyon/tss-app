export default interface JwtConfig {
    privateKey: string;
    publicKey: string;
    expiresIn: string | number;
}
