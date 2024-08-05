import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config'
import { UserModule } from './user/user.module';
import { User } from './entities/user.entity/user.entity';
import { Business } from './entities/business.entity/business.entity';
import { BusinessModule } from './business/business.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      url: process.env.POSTGRES_URL,
      entities: [User, Business],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User, Business]),
    UserModule,
    BusinessModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
