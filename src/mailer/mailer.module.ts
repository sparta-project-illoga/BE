import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
