import { IsInt, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "Pablo" })
  @IsString()
  name: string;

  @ApiProperty({ example: 32 })
  @IsInt()
  @Min(0)
  age: number;
}
