import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

type SafeUser = Omit<User, "hashedPassword">;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitize(user: User): SafeUser {
    const { hashedPassword: _hashedPassword, ...safe } = user;
    return safe;
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });
    return users.map((u) => this.sanitize(u));
  }

  async findOne(id: number): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.sanitize(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<SafeUser> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    return this.sanitize(updated);
  }
}
