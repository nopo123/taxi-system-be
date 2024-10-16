import { IsString } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    readonly password: string;

    @IsString()
    readonly confirmPassword: string;
}