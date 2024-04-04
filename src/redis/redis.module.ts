import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}