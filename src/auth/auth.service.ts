import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException("Email already registered");
    }
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email: dto.email, hashedPassword },
    });
    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const valid = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}
