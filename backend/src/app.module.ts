import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { ChildrenModule } from './modules/children/children.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { AdminModule } from './modules/admin/admin.module';
import { DietModule } from './modules/diet/diet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/wings',
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    UsersModule,
    AuthModule,
    OnboardingModule,
    ChildrenModule,
    AssessmentModule,
    AdminModule,
    DietModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
