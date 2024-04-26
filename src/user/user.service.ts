import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import *as generator from 'generate-password';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { ChangePwDto } from './dto/changepw.dto';
import { FindPwDto } from './dto/findpw.dto';
import { UtilsService } from 'src/utils/utils.service';
import { MailerService } from 'src/mailer/mailer.service';
import { AwsService } from 'src/aws/aws.service';
import { RedisService } from 'src/redis/redis.service';
import { Location } from '../location/entities/location.entity';
import { join } from 'path';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly utilsService: UtilsService,
    private readonly awsService: AwsService,
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService
  ) { }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다.',);
    }

    const redisClient = this.redisService.getClient()
    const key = `verification_code:${registerDto.email}:verified`
    console.log(registerDto.email)
    const storedCode = await redisClient.get(key)
    console.log(storedCode)

    if (!storedCode) {
      throw new BadRequestException('이메일 인증을 진행해주세요.')
    }

    const hashedPassword = await hash(registerDto.password, 10)

    await this.userRepository.save({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      nickname: registerDto.nickname,
      phone: registerDto.phone
    });

    return { message: '회원가입이 완료되었습니다.' }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'], // 유저 엔터티에서 id, email, password 필드만 선택
      where: { email: loginDto.email }, // userRepository에서 제공된 이메일로 사용자 찾음
    });
    if (!user) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    // 사용자가 일치하면 jwt 토큰 페이로드 구성
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '6h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File
  ) {

    // 유저 확인
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    let imageUrl = user.image_url;

    if (file) {
      //이미 입력된 이미지가 있다면 S3에서 기존 이미지 삭제
      if (user.image_url !== null) {
        await this.awsService.deleteUploadToS3(user.image_url);
      }
    }

    //S3에 이미지 업로드, url return
    const imageName = this.utilsService.getUUID();
    const ext = join(file.originalname).split('.').pop()

    if (ext) {
      imageUrl = await this.awsService.imageUploadToS3(
        `${imageName}.${ext}`,
        file,
        ext,
      );
    }

    // DB에 저장
    const modifiedUser = await this.userRepository.save({
      id: user.id,
      nickname: updateUserDto.nickname,
      phone: updateUserDto.phone,
      image_url: `${imageName}.${ext}`,
    })

    return modifiedUser
  }

  async changePw(id: number, changePwDto: ChangePwDto) {
    // select: false인 값을 조회하려면 이걸로
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id = :id", { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const isMatch = await compare(changePwDto.present_pw, user.password);

    if (isMatch === true) {
      const hashedPassword = await hash(changePwDto.password, 10);
      user.password = hashedPassword;
      await this.userRepository.update(user.id, { password: hashedPassword });
    } else {
      throw new NotFoundException('현재 비밀번호와 일치하지 않습니다.');
    }
  }

  async findPw(findPwDto: FindPwDto) {
    const user = await this.findByEmail(findPwDto.email)

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.')
    }

    if (user.name === findPwDto.name && user.phone === findPwDto.phone) {
      // 임시 비밀번호 생성
      const tempPassword = generator.generate({
        length: 8,
        numbers: true,
        uppercase: true,
        lowercase: false,
        excludeSimilarCharacters: true,
      });

      // 임시 비밀번호로 비밀번호 변경
      const hashedPassword = await hash(tempPassword, 10);
      user.password = hashedPassword;
      await this.userRepository.update(user.id, { password: hashedPassword });

      // 정보가 일치하면 임시 비밀번호 전송
      await this.mailerService.sendNewPass(user.email, tempPassword)
    } else {
      throw new NotFoundException('입력하신 정보와 일치하는 사용자가 없습니다.');
    }
  }

  async remove(userId: number, id: number) {
    const user = await this.findById(id)

    if (userId !== id) {
      throw new NotFoundException('유저를 찾을 수 없습니다.')
    }

    await this.userRepository.delete({ id: id })
    return { message: '회원탈퇴가 완료되었습니다.' }
  }

  async sendVerification(email: string) {
    await this.mailerService.sendVerifyToken(email)
  }

  async verifyUser(email: string, code: string) {
    const redisClient = this.redisService.getClient()
    const unverifiedKey = `verification_code:${email}:unverified`;
    const verifiedKey = `verification_code:${email}:verified`;
    const storedCode = await redisClient.get(unverifiedKey)

    if (!storedCode) {
      throw new BadRequestException('이메일 발송을 해주세요.')
    }

    if (code === storedCode) {
      // 인증코드가 일치하면 레디스 키의 이름 변경
      await redisClient.rename(unverifiedKey, verifiedKey);
      // 변경된 키의 만료 시간을 1시간으로 변경
      await redisClient.expire(verifiedKey, 3600);
      return { message: '인증이 완료되었습니다.' };
    }
    return { message: '인증번호가 일치하지 않습니다.' }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
  
  //유저 지역인증 정보
  async getRegion(userId: number) {
    const region = await this.locationRepository.findOneBy({ userId });
    if (!region) {
      return null;
    }
    return region.region_1depth_name;
  }
}
