import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { ConfigModule } from '@nestjs/config';

//configModule을 import해 애플리케이션의 한경 설정정보
//ex) AWS 리전, 엑세스키, 시크릿키 등의 중요한 설정 정보를 관리함
//AwsService: S3에 이미지 업로드하는 기능 제공
//즉, AWS S3와 관련된 기능을 제공하는 서비스를 모아둔 집합체

@Module({
  imports: [ConfigModule],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
