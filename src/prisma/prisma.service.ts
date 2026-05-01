import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.getOrThrow<string>("DATABASE_URL"),
    });
    this.client = new PrismaClient({ adapter });
  }

  get user() {
    return this.client.user;
  }

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
