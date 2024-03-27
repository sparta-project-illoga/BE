import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { TravelModule } from './travel/travel.module';
import { CategoryModule } from './category/category.module';
import { LocalModule } from './local/local.module';

@Module({
  imports: [UserModule, PlanModule, TravelModule, CategoryModule, LocalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
