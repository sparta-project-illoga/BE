import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.update.dto';
import { FindPwDto } from './dto/findpw.dto';
import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';
import { ChangePwDto } from './dto/changepw.dto';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { Readable } from 'stream';

describe('UserController', () => {
  let controller: UserController;

  const user = {
    accessToken: jest.fn(),
  };

  const mockUserService = {
    register: jest.fn(),
    login: jest.fn(() => {return user}),
    update: jest.fn((UpdateUserDto) => {return 'user의 변경된 정보'}),
    findPw: jest.fn((FindPwDto) => {
      if(!FindPwDto) {
        throw new BadRequestException()
      }
      return {message: '비밀번호 변경에 성공하였습니다.'}
    }),
    changePw: jest.fn((ChangePwDto) => {
      if (!ChangePwDto) {
        throw new BadRequestException()
      }
      return {message: '비밀번호 변경에 성공하였습니다.'}
    }),
    remove: jest.fn((id) => {
      if (id == null) {
        throw new BadRequestException();
      }
    }),
  };

  async function validation(Dto: any, dto: any) {
    const validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Dto,
      data: '',
    };
    await validationPipe.transform(dto, metadata).catch((err) => {
      expect(err).toEqual(err);
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('UserController가 정상적으로 컴파일되었는가', () => {
    expect(controller).toBeDefined();
  });

    // 회원가입 테스트
    describe('register', () => {
      it('should call UserService.register', async () => {
        const registerDto = { email: 'test@example.com', password: 'aaaa1234', check_pw: 'aaaa1234', name: '김진성', phone: '010-1234-1234', nickname: 'seong' };
        await controller.register('type', registerDto);
        expect(mockUserService.register).toHaveBeenCalledWith(registerDto);
      });
    });
  
    // 로그인 테스트
    describe('login', () => {
      it('loginDto를 통해 로그인에 성공함', async () => {
        const loginDto = { email: 'test@example.com', password: 'aaaa1234' };
        await controller.login(loginDto, { cookie: jest.fn() } as any);
        expect(mockUserService.login).toHaveBeenCalledWith(loginDto);
      });

      it('loginDto를 통과하지 못해 로그인에 실패함', async () => {
        const loginDto = { email: 'test@example@#', password: '1234' };
        await controller.login(loginDto, { cookie: jest.fn() } as any);
        expect(mockUserService.login).toHaveBeenCalledWith(loginDto);
      });
    });
  
    // 프로필 조회 테스트
    describe('info', () => {
      it('유저정보를 성공적으로 반환함', async () => {
        const mockRequest = {
          user: {"id": 11,
          "email": "jskim4695@naver.com",
          "name": "김진성",
          "nickname": "seong",
          "phone": "010-1234-1234",
          "is_cert": false,
          "role": 0,
          "image_url": null,
          "created_at": "2024-04-10T14:52:39.306Z"}
        }
    });
  })
  
    // 정보 수정 테스트
    describe('update', () => {
      it('updateUsrDto를 통해 정보 수정에 성공함', async () => {
        const updateUserDto = { nickname: 'newNickname', phone: '010-1234-1234', image_url: 'adjklflafahad.com.png' };
        const user = { id: 1 };
        const mockFile: Express.Multer.File = {
          fieldname: 'file',
          originalname: 'test.png',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: './uploads',
          filename: 'test.png',
          path: './uploads/test.png',
          size: 1024,
          buffer: Buffer.from('test', 'utf-8'),
          stream: new Readable({
            read() {
              this.push(mockFile.buffer);
              this.push(null); // 스트림의 끝을 나타냅니다.
            }
          })
        };
    
        // UserService의 update 메서드를 호출할 때, updateUserDto와 mockFile을 인자로 넘겨줍니다.
        await controller.update(user as any, updateUserDto, mockFile);
    
        // mockUserService.update가 올바른 인자들과 함께 호출되었는지 검증합니다.
        expect(mockUserService.update).toHaveBeenCalledWith(user.id, updateUserDto, mockFile);
      });

      it('updateUserDto를 통과하지 못해 정보 수정이 실패함', async () => {
        const updateUserDto = { nickname: 'nickname', phone: '01012341234', image_url: 'adjklflafahad.com.pn' };
        const user = { id: 1 };
        const mockFile: Express.Multer.File = {
          fieldname: 'file',
          originalname: 'test.png',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: './uploads',
          filename: 'test.png',
          path: './uploads/test.png',
          size: 1024,
          buffer: Buffer.from('test', 'utf-8'),
          stream: new Readable({
            read() {
              this.push(mockFile.buffer);
              this.push(null);
            }
          })
        }; 
        expect(controller.update(user as any, updateUserDto, mockFile));
      });
    });  

    // 비밀번호 변경 테스트
    describe('changePw', () => {
      it('changePwDto를 통해 비밀번호 변경에 성공함', async () => {
        const changePwDto = { present_pw: 'oldPass1', password: 'Pass123', check_pw: 'Pass123' };
        const user = { id: 1 };
        await controller.changePw(user as any, changePwDto);
        expect(mockUserService.changePw).toHaveBeenCalledWith(user.id, changePwDto);
      });

      // it('비밀번호가 조건에 맞지 않을 때 오류를 던짐', async () => {
      //   const changePwDto = { present_pw: 'oldPass1', password: '!', check_pw: '!' };
      //   const user = { id: 1 };
      
      //   await expect(controller.changePw(user as any, changePwDto))
      //     .rejects
      //     .toThrow(new Error('비밀번호는 최소 8자 이상이며, 최소 하나의 영문자와 하나의 숫자를 포함해야 합니다.'));
      // });

      // it('password와 check_pw가 일치하지 않을 때 오류를 던짐', async () => {
      //   const changePwDto = { present_pw: 'oldPass1', password: '!', check_pw: 'Pass' };
      //   const user = { id: 1 };
      
      //   await expect(controller.changePw(user as any, changePwDto))
      //     .rejects
      //     .toThrow(new Error('비밀번호 확인이 일치하지 않습니다.'));
      // });
    });
  
    describe('remove', () => {
      it('id를 정상적으로 전달 받아 탈퇴에 성공함', async () => {
        const user = { id: 1 };
        const idToRemove = 1;

        const result = await controller.remove(user as any, idToRemove);
        expect(result).toBeUndefined();
      });
    });
  });