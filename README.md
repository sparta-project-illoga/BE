## illoga (일로가)

<p align="center">
  <img src="https://file.notion.so/f/f/83c75a39-3aba-4ba4-a792-7aefe4b07895/cd3747fe-4d4d-44a7-bee6-3e044cb280cd/_9899f63f-3c94-4a28-9bea-7b4b9beccec8.jpg?id=b981c25a-93ca-4771-affd-3315683b4673&table=block&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&expirationTimestamp=1714636800000&signature=AyJtz2WjxIEAFJBok6O8xRplBIC9EGH_pcxBLpsdZIs&downloadName=_9899f63f-3c94-4a28-9bea-7b4b9beccec8.jpg" width="400" alt="illoga Logo" /></a>
</p>

<div align="center">
  <a href="https://illoga.store/">
    <img src="https://file.notion.so/f/f/83c75a39-3aba-4ba4-a792-7aefe4b07895/cd3747fe-4d4d-44a7-bee6-3e044cb280cd/_9899f63f-3c94-4a28-9bea-7b4b9beccec8.jpg?id=b981c25a-93ca-4771-affd-3315683b4673&table=block&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&expirationTimestamp=1714636800000&signature=AyJtz2WjxIEAFJBok6O8xRplBIC9EGH_pcxBLpsdZIs&downloadName=_9899f63f-3c94-4a28-9bea-7b4b9beccec8.jpg" width="90px" alt="Site Logo" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.notion.so/teamsparta/illoga-d985f4411d694774bace7b83722dc16e?pvs=4">
    <img src="https://camo.githubusercontent.com/8d237e7d7ba690deb35eca1765cb47779a080471efb16ef76672aca7b7c26a9f/68747470733a2f2f63646e2d69636f6e732d706e672e666c617469636f6e2e636f6d2f3531322f323632382f323632383835392e706e67" width="90px" alt="Brochure Logo" />
  </a>
</div>

<div align="center">
  <span>사이트 바로가기</span>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;
  <span>illoga 브로셔</span>
</div>


## 프로젝트 소개



여행계획을 지인들과 함께 작성하거나 원하는 조건의 여행계획을 추천받아보세요!

- 메인 페이지에서 새로 올라온 여행계획, 인기 있는 계획, 새로운 지역 정보를 확인할 수 있습니다.
- 원하는 지역 또는 키워드로 여행 장소 정보를 검색할 수 있습니다.


### ⭐ 여행계획을 직접 짜고 싶은 p
- 사이트에서 제공하는 여행 장소 정보를 활용하여 자신의 여행계획을 작성할 수 있습니다.
- 친구들과 함께 여행을 계획하고 싶다면, 친구들을 **초대**하여 공동 작성 및 **채팅**을 통해 소통할 수 있습니다.


### ⭐ 여행은 가고 싶지만 계획은 짜기 싫은 j
- 원하는 **지역, 예산, 기간** 등의 조건을 입력하여 **여행계획을 추천**받을 수 있습니다.
- 추천된 여행계획 중 마음에 드는 일정으로 쉽게 여행을 떠나보세요!


### ⭐ 자신의 지역을 알리고 싶은 사용자
- 현재 위치를 기반으로 **지역 인증을 받고 지역 게시판**에 나만의 장소를 추천해보세요!


## 프로젝트 멤버

### 김진성 ([🔗 깃허브](https://github.com/jskim4695))

🔨 **주요 작업**
- 백엔드 User 부분
- 프론트엔드 User, main, Board, like, geoLocation 커스텀 훅을 이용한 지역인증

🪄 **사용 기술**
| Nest.js | Redis | nodemailer | S3 Bucket | React |

---

### 김민건 ([🔗 깃허브](https://github.com/gimmingeon))

🔨 **주요 작업**
- 백엔드 Plan, Schedule
- 프론트엔드 Plan, Profile, Category, Member, myplan 페이지 커스텀

🪄 **사용 기술**
| Nest.js | Redis | S3 Bucket | React |

---

### 이윤민 ([🔗 깃허브](https://github.com/llyymm23))

🔨 **주요 작업**
- 백엔드 category, member, 채팅
- 프론트엔드 플랜과 스케줄 등록 및 조회, 채팅, 지역 정보 페이지

🪄 **사용 기술**
| Nest.js | Socket.io | React |

---

### 조완희 ([🔗 깃허브](https://github.com/wanhee27))

🔨 **주요 작업**
- 백엔드 post, post-comment, location
- TourAPI를 통한 기본 DB 데이터 수집
- Puppeteer를 통한 DB 데이터 보충
- GeoLocation을 이용한 사용자 위치정보 인증
- 서버 환경 구축 및 배포: Router 53 > ACM > ALB > EC2 > PM2 > Docker

🪄 **사용 기술**
| Router 53 | ACM | EC2 | Docker | PM2 |





## 사용 기술 스택




| 사용 기술   | 도입 이유                                                                                                             |
|-------------|--------------------------------------------------------------------------------------------------------------------|
| Nest.js     | Express의 기능을 확장하여 보다 체계적이고 모듈화된 구조를 제공합니다. HTTP 요청 및 응답을 처리하고, 미들웨어를 통해 요청-응답 주기를 조작할 수 있습니다. |
| TypeOrm     | TypeScript를 강력하게 지원하며, 엔티티, 레파지토리 등 다양한 기능을 제공합니다.                                                  |
| Redis       | 온메모리 데이터 저장소로, 키-밸류 형태에 기반한 다양한 자료구조를 제공합니다. 주로 캐시 서버로 사용되며, 빠른 처리 속도가 장점입니다.                                |
| MySql       | 오픈 소스 RDBMS로, 확장성이 뛰어나 웹 기반 데이터베이스를 쉽게 구축할 수 있습니다.                                               |
| Socket.io   | 서버와 클라이언트가 실시간으로 양방향 소통을 할 수 있습니다.                                                             |
| Puppeteer   | 추가적인 DB 데이터를 모으기 위해 웹 크롤링 자동화를 사용합니다.                                                           |




## 프로젝트 아키텍처


![스크린샷(193)](https://github.com/sparta-project-illoga/BE/assets/101691327/9bcf4ccc-4126-42b4-a41e-feaa5205c726)


## 기술적 의사결정

Redis / Memcached
| 구분       | 내용                                                                                                                                                                   |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 장점       | Memcached에 비해 다양한 자료형을 지원하고, 레플리카, 클러스터링 등 여러 기능을 제공합니다. 또한, 한 개의 키에 저장할 수 있는 데이터 범위가 더 커서 확장성 및 조작 측면에서 유리합니다.                   |
| 단점       | 트래픽이 급증하면 응답 속도가 불안정할 수 있고, Memcached에 비해 메모리 사용량이 많습니다. 또한, 데이터 변경이 잦은 경우 메모리 파편화가 발생하기 쉽습니다.                                                        |
| 선택 이유  | 1. 회원가입 로직 중 이메일 인증 코드를 저장하기 위해 사용했습니다. Nodemailer를 사용하여 응답속도 저하가 발생했지만, Redis의 빠른 처리 속도로 이를 개선했습니다.                                            |
|            | 2. 빠른 추천 시스템을 구현하기 위해 메모리 기반의 Redis를 사용했습니다. 이미 추천된 플랜을 Redis에 저장하고, 각 키에 만료 시간을 설정하여 일정 기간 후 다시 추천할 수 있도록 했습니다.                      |

socket.io
| 구분       | 내용                                                                                                                                                                   |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 장점       | 웹소켓 기반으로 서버와 클라이언트 간에 실시간 양방향 통신이 가능합니다. 또한, 룸과 네임스페이스를 구분하여 특정 룸에만 메시지를 전달하는 등 다양한 채널 관리가 가능합니다.                                                  |
| 단점       | 코드의 복잡성 증가 및 오버헤드 발생이 있을 수 있습니다. 룸, 네임스페이스, 이벤트 관리 등 다양한 기능을 관리해야 하기 때문입니다.                                                                           |
| 선택 이유  | 채팅 기능을 구현하기 위해 실시간 통신이 필요했습니다. 프로젝트 특성상 각 플랜에 해당하는 멤버들 간의 채팅방을 생성하기 위해 여러 채팅방을 구분하여 메시지를 보낼 수 있는 socket.io가 필요했습니다.       |

Puppeteer / Selenium
| 구분       | 내용                                                                                                                                                                   |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 장점       | Puppeteer는 Node.js 기반으로 작동하며 Chromium 브라우저를 대상으로 합니다. Selenium은 다양한 언어와 여러 브라우저를 지원합니다.                                                                          |
| 선택 이유  | 두 도구 모두 필요한 크롤링 기능을 제공하지만, 속도 측면에서 Puppeteer가 더 빠르고 프로젝트의 언어가 Node.js이므로 Puppeteer를 선택했습니다.                                                |



## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
# BE
