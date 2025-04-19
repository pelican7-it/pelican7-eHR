# Pelican7 e-HR 백엔드

Node.js/Express 기반의 e-HR 시스템 백엔드 애플리케이션입니다.

## 기술 스택

- **Node.js**: JavaScript 런타임
- **Express**: 웹 애플리케이션 프레임워크
- **TypeScript**: 타입 안정성을 위한 JavaScript 수퍼셋
- **PostgreSQL**: 관계형 데이터베이스
- **MongoDB**: 비관계형 데이터베이스
- **Redis**: 캐싱 및 세션 관리
- **Prisma**: ORM (Object-Relational Mapping)
- **JWT**: 인증 토큰
- **Jest**: 테스팅 프레임워크
- **Swagger/OpenAPI**: API 문서화

## 시작하기

### 개발 환경 설정

```bash
# 프로젝트 클론
git clone https://github.com/pelican7-it/pelican7-eHR.git
cd pelican7-eHR/backend

# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npm run prisma:migrate

# 개발 서버 실행
npm run dev
```

서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

### 주요 npm 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: TypeScript 컴파일 및 프로덕션 빌드
- `npm run start`: 프로덕션 모드로 서버 실행
- `npm run test`: 테스트 실행
- `npm run prisma:migrate`: 데이터베이스 마이그레이션
- `npm run prisma:generate`: Prisma 클라이언트 생성
- `npm run seed`: 시드 데이터 생성

## 폴더 구조

```
backend/
├── src/
│   ├── api/                  # API 관련 코드
│   │   ├── controllers/      # 컨트롤러 로직
│   │   │   ├── auth.controller.ts
│   │   │   ├── employee.controller.ts
│   │   │   └── ...
│   │   ├── middlewares/      # 미들웨어
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── ...
│   │   ├── routes/           # API 라우트 정의
│   │   │   ├── auth.routes.ts
│   │   │   ├── employee.routes.ts
│   │   │   └── ...
│   │   └── validators/       # 요청 검증 로직
│   │       ├── auth.validator.ts
│   │       ├── employee.validator.ts
│   │       └── ...
│   ├── config/               # 설정 파일
│   │   ├── database.ts       # 데이터베이스 설정
│   │   ├── app.ts            # Express 앱 설정
│   │   └── ...
│   ├── db/                   # 데이터베이스 관련 코드
│   │   ├── prisma/           # Prisma 스키마 및 마이그레이션
│   │   │   ├── schema.prisma # Prisma 스키마
│   │   │   └── migrations/   # 마이그레이션 파일
│   │   ├── models/           # 데이터 모델
│   │   ├── repositories/     # 데이터 접근 계층
│   │   └── seeds/            # 시드 데이터
│   ├── services/             # 비즈니스 로직
│   │   ├── auth.service.ts
│   │   ├── employee.service.ts
│   │   └── ...
│   ├── utils/                # 유틸리티 함수
│   │   ├── logger.ts
│   │   ├── jwt.ts
│   │   └── ...
│   ├── types/                # TypeScript 타입 정의
│   │   ├── employee.types.ts
│   │   ├── request.types.ts
│   │   └── ...
│   ├── app.ts                # Express 앱 설정
│   └── server.ts             # 서버 진입점
├── tests/                    # 테스트 파일
│   ├── unit/                 # 단위 테스트
│   ├── integration/          # 통합 테스트
│   └── fixtures/             # 테스트 데이터
├── prisma/                   # Prisma 설정
│   └── schema.prisma         # 데이터베이스 스키마
├── dist/                     # 컴파일된 JavaScript 코드
├── .env.example              # 환경 변수 예시
├── tsconfig.json             # TypeScript 설정
├── jest.config.js            # Jest 설정
└── package.json              # 패키지 정보
```

## API 개요

API는 RESTful 원칙을 따르며 다음과 같은 엔드포인트를 제공합니다:

- **인증**: `/api/auth` - 로그인, 로그아웃, 토큰 갱신
- **직원**: `/api/employees` - 직원 정보 관리
- **부서**: `/api/departments` - 부서 정보 관리
- **근태**: `/api/attendance` - 근태 기록 관리
- **휴가**: `/api/leaves` - 휴가 신청 및 관리
- **급여**: `/api/payroll` - 급여 정보 관리
- **성과**: `/api/performance` - 성과 평가 관리
- **채용**: `/api/recruitment` - 채용 정보 관리
- **교육**: `/api/training` - 교육 과정 관리
- **보고서**: `/api/reports` - 통계 및 보고서

자세한 API 명세는 `/api-docs` 엔드포인트에서 Swagger UI를 통해 확인할 수 있습니다.

## 데이터베이스 설계

데이터베이스는 Prisma ORM을 통해 관리되며, 스키마는 `prisma/schema.prisma` 파일에 정의되어 있습니다. 주요 모델은 다음과 같습니다:

- **Employee**: 직원 정보
- **Department**: 부서 정보
- **Position**: 직급/직책 정보
- **AttendanceRecord**: 출퇴근 기록
- **LeaveRequest**: 휴가 신청
- **LeaveBalance**: 휴가 할당량
- **SalaryInfo**: 급여 정보
- **PayrollRecord**: 급여 지급 내역
- **PerformanceReview**: 성과 평가
- **User**: 사용자 계정

자세한 스키마 설계는 [데이터베이스 설계 문서](../docs/database/README.md)를 참조하세요.

## 인증 및 권한 관리

인증은 JWT(JSON Web Token)를 기반으로 구현되어 있으며, 권한 관리는 역할 기반 접근 제어(RBAC)를 사용합니다. 주요 역할은 다음과 같습니다:

- **admin**: 시스템 관리자 (모든 권한)
- **hr_manager**: 인사 관리자 (인사 관련 모든 권한)
- **department_manager**: 부서 관리자 (해당 부서 관련 권한)
- **employee**: 일반 직원 (본인 정보 관련 권한)

모든 API 요청은 `auth.middleware.ts`에서 인증 및 권한 검증을 거칩니다.

## 에러 처리

에러 처리는 중앙 집중식으로 `error.middleware.ts`에서 관리되며, 다음과 같은 구조로 클라이언트에 반환됩니다:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  },
  "statusCode": 400
}
```

## 로깅

로깅은 Winston 라이브러리를 사용하여 구현되어 있으며, 로그 레벨과 포맷은 환경에 따라 다르게 설정됩니다:

- **개발 환경**: 콘솔에 상세 로그 출력
- **테스트 환경**: 최소한의 로그 출력
- **프로덕션 환경**: 파일 및 중앙 로깅 시스템에 구조화된 로그 저장

## 테스트

테스트는 Jest를 사용하여 작성되며, 다음과 같은 명령으로 실행할 수 있습니다:

```bash
# 모든 테스트 실행
npm run test

# 단위 테스트만 실행
npm run test:unit

# 통합 테스트만 실행
npm run test:integration

# 특정 파일 테스트
npm run test -- services/employee.service
```

## 배포

배포는 Docker 및 CI/CD 파이프라인을 통해 자동화되어 있습니다:

```bash
# Docker 이미지 빌드
docker build -t pelican7-ehr-backend .

# Docker 컨테이너 실행
docker run -p 5000:5000 -e NODE_ENV=production pelican7-ehr-backend
```

## 문제 해결

개발 중 자주 발생하는 문제와 해결 방법은 [문제 해결 가이드](../docs/troubleshooting.md)를 참조하세요.

## 기여 가이드

기여 방법에 대한 자세한 내용은 [개발 가이드](../docs/development-guide.md)를 참조하세요.
