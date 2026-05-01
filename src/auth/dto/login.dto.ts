import { IsEmail, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Str0ng!Password12" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
