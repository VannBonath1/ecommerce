import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import * as dotenv from 'dotenv';
import { Role } from './modules/role/role.entity';
import { Repository } from 'typeorm';
import { ShopController } from './modules/shop/shop.controller';
import { ShopService } from './modules/shop/shop.service';
import { ShopModule } from './modules/shop/shop.module';
import { FoodModule } from './modules/food/food.module';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config module globally available
      envFilePath: '.env', // Path to the .env file
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.DATABASE_PASSWORD,
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
      dropSchema: true,
    }),
    UserModule,
    AuthModule,
    RoleModule,
    ShopModule,
    FoodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>, // Inject Role repository to interact with the database
  ) {}

  // This method will run automatically when the application starts
  async onModuleInit() {
    // Roles to check and create if they don't exist
    const roles = ['Admin', 'Customer', 'Merchant'];

    for (const roleName of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleName },
      });

      if (!existingRole) {
        // If the role doesn't exist, create and save it
        const role = new Role();
        role.name = roleName;
        await this.roleRepository.save(role);
        console.log(`Role "${roleName}" created.`);
      } else {
        console.log(`Role "${roleName}" already exists.`);
      }
    }
  }
}
