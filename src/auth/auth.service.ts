import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthUser } from "./interfaces/auth-user.interface";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  private readonly users: AuthUser[] = [];
  private nextId = 1;

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    if (this.users.find((u) => u.email === dto.email)) {
      throw new ConflictException("Email already registered");
    }
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user: AuthUser = {
      id: this.nextId++,
      email: dto.email,
      hashedPassword,
    };
    this.users.push(user);
    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = this.users.find((u) => u.email === dto.email);
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
