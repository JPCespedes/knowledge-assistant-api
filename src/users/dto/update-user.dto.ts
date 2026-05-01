import { IsString, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Pablo" })
  @IsOptional()
  @IsString()
  name?: string;
}
