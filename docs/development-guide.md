# Pelican7 e-HR 개발 가이드

이 문서는 Pelican7 e-HR 시스템 개발을 위한 가이드라인을 제공합니다. 개발자들이 일관된 방식으로 프로젝트에 기여할 수 있도록 코딩 표준, 개발 환경 설정, 작업 프로세스 등을 설명합니다.

## 1. 개발 환경 설정

### 1.1 필수 소프트웨어

- **Node.js**: v18.x 이상 (LTS 버전 권장)
- **npm**: v9.x 이상
- **PostgreSQL**: v15.x 이상
- **MongoDB**: v6.x 이상
- **Redis**: v7.x 이상
- **Docker**: 최신 안정 버전
- **Docker Compose**: 최신 안정 버전
- **Git**: 최신 안정 버전

### 1.2 개발 환경 설정 방법

#### 1.2.1 프로젝트 클론

```bash
git clone https://github.com/pelican7-it/pelican7-eHR.git
cd pelican7-eHR
```

#### 1.2.2 프론트엔드 설정

```bash
cd frontend
npm install
cp .env.example .env.local  # 환경 변수 설정
npm run dev  # 개발 서버 실행
```

#### 1.2.3 백엔드 설정

```bash
cd backend
npm install
cp .env.example .env  # 환경 변수 설정
npm run dev  # 개발 서버 실행
```

#### 1.2.4 Docker를 이용한 개발 환경 설정

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 1.3 IDE 설정 및 권장 플러그인

#### 1.3.1 Visual Studio Code 권장 플러그인

- ESLint
- Prettier
- TypeScript Vue Plugin
- GitLens
- Docker
- DotENV
- PostgreSQL

#### 1.3.2 VSCode 작업 공간 설정 (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "typescript", "vue"],
  "typescript.tsdk": "node_modules/typescript/lib",
  "prettier.singleQuote": true,
  "prettier.semi": true,
  "prettier.printWidth": 100
}
```

## 2. 프로젝트 구조

### 2.1 프론트엔드 구조 (Next.js)

```
frontend/
├── src/                      # 소스 코드
│   ├── app/                  # App Router 구조
│   │   ├── (auth)/           # 인증 관련 라우트 그룹
│   │   ├── (dashboard)/      # 대시보드 라우트 그룹
│   │   ├── api/              # API 라우트
│   │   └── layout.tsx        # 루트 레이아웃
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── ui/               # 기본 UI 컴포넌트
│   │   ├── forms/            # 폼 관련 컴포넌트
│   │   ├── tables/           # 테이블 관련 컴포넌트
│   │   ├── charts/           # 차트 관련 컴포넌트
│   │   └── layouts/          # 레이아웃 컴포넌트
│   ├── hooks/                # 커스텀 훅
│   ├── lib/                  # 유틸리티 함수
│   ├── services/             # API 서비스
│   ├── store/                # 상태 관리
│   │   ├── slices/           # 상태 슬라이스
│   │   └── index.ts          # 스토어 구성
│   ├── types/                # TypeScript 타입 정의
│   └── styles/               # 글로벌 스타일
├── public/                   # 정적 파일
├── next.config.js            # Next.js 설정
├── tailwind.config.js        # Tailwind CSS 설정
├── package.json              # 패키지 정보 및 스크립트
└── tsconfig.json             # TypeScript 설정
```

### 2.2 백엔드 구조 (Node.js/Express)

```
backend/
├── src/
│   ├── api/                  # API 라우트
│   │   ├── controllers/      # 컨트롤러
│   │   ├── middlewares/      # 미들웨어
│   │   ├── routes/           # 라우트 정의
│   │   └── validators/       # 입력 유효성 검사
│   ├── config/               # 설정 파일
│   ├── db/                   # 데이터베이스 연결 및 모델
│   │   ├── models/           # 데이터 모델
│   │   ├── migrations/       # 데이터베이스 마이그레이션
│   │   └── seeds/            # 시드 데이터
│   ├── services/             # 비즈니스 로직
│   ├── utils/                # 유틸리티 함수
│   └── app.js                # 앱 진입점
├── tests/                    # 테스트 파일
├── .env.example              # 환경 변수 예시
├── package.json              # 패키지 정보 및 스크립트
└── tsconfig.json             # TypeScript 설정
```

## 3. 코딩 표준

### 3.1 일반 규칙

- 모든 코드는 TypeScript로 작성
- 모든 파일은 UTF-8 인코딩 사용
- 들여쓰기는 2 spaces 사용
- 한 줄의 최대 길이는 100자
- 모든 문장 끝에 세미콜론(;) 사용
- 문자열은 작은따옴표(') 사용
- 모든 변수/함수는 camelCase 사용
- 모든 클래스/인터페이스는 PascalCase 사용
- 모든 상수는 UPPER_SNAKE_CASE 사용
- 모든 파일명은 kebab-case 사용

### 3.2 프론트엔드 코딩 표준

#### 3.2.1 컴포넌트 작성 규칙

- 함수형 컴포넌트와 React Hooks 사용
- 컴포넌트 파일명은 PascalCase 사용 (예: EmployeeList.tsx)
- Props와 State에 대한 타입 정의 필수
- 큰 컴포넌트는 작은 컴포넌트로 분해

```tsx
// 좋은 예
import React from 'react';
import { Employee } from '@/types';

interface EmployeeCardProps {
  employee: Employee;
  onClick: (id: number) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  return (
    <div className="p-4 border rounded shadow-sm" onClick={() => onClick(employee.id)}>
      <h3 className="text-lg font-medium">{employee.name}</h3>
      <p className="text-gray-600">{employee.position}</p>
      <p className="text-gray-500">{employee.department}</p>
    </div>
  );
};
```

#### 3.2.2 스타일링 규칙

- Tailwind CSS 사용
- 컴포넌트별 스타일은 Tailwind 클래스로 관리
- 전역 스타일은 글로벌 CSS 파일에서 관리
- 테마 관련 설정은 tailwind.config.js에서 관리

### 3.3 백엔드 코딩 표준

#### 3.3.1 API 설계 규칙

- RESTful API 설계 원칙 준수
- URL 경로는 복수형 명사 사용 (예: /api/employees)
- 요청/응답 본문은 JSON 형식 사용
- 적절한 HTTP 상태 코드 사용

#### 3.3.2 컨트롤러 작성 규칙

```typescript
// 좋은 예
import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  async getEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await this.employeeService.findAll();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.findById(parseInt(id, 10));
      
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
```

## 4. 개발 워크플로우

### 4.1 Git 브랜치 전략

- **main**: 제품 배포용 브랜치
- **develop**: 개발 통합 브랜치
- **feature/[feature-name]**: 기능 개발 브랜치
- **bugfix/[bug-name]**: 버그 수정 브랜치
- **release/[version]**: 릴리스 준비 브랜치
- **hotfix/[fix-name]**: 긴급 수정 브랜치

### 4.2 커밋 메시지 규칙

```
<유형>: <제목>

<본문>

<푸터>
```

- **유형**:
  - feat: 새로운 기능 추가
  - fix: 버그 수정
  - docs: 문서 수정
  - style: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
  - refactor: 코드 리팩토링
  - test: 테스트 코드 추가 또는 수정
  - chore: 빌드 프로세스, 라이브러리 업데이트 등

예시:
```
feat: 직원 목록 페이지네이션 기능 추가

- 직원 목록에 페이지네이션 기능 추가
- 페이지당 10/20/50명씩 볼 수 있는 옵션 추가
- 페이지 번호 클릭 시 해당 페이지로 이동

Closes #123
```

### 4.3 Pull Request 프로세스

1. 기능 개발 또는 버그 수정을 위한 브랜치 생성
2. 작업 완료 후 develop 브랜치로 Pull Request 생성
3. 코드 리뷰 요청 (최소 1명의 승인 필요)
4. 자동화된 테스트 통과 확인
5. 코드 리뷰 승인 후 develop 브랜치에 병합
6. 해당 브랜치 삭제

### 4.4 코드 리뷰 가이드라인

- 모든 PR은 최소 1명 이상의 리뷰어가 필요
- 코드 스타일, 버그, 성능, 보안 측면에서 리뷰
- 리뷰 코멘트는 건설적이고 구체적이어야 함
- 리뷰어는 48시간 이내에 리뷰 완료

## 5. 테스트 가이드라인

### 5.1 단위 테스트

- 모든 비즈니스 로직에 대한 단위 테스트 작성
- Jest 프레임워크 사용
- 테스트 커버리지 80% 이상 유지
- 모킹과 스텁을 활용한 의존성 격리

```typescript
// 단위 테스트 예시
import { EmployeeService } from '../services/employee.service';
import { EmployeeRepository } from '../repositories/employee.repository';

jest.mock('../repositories/employee.repository');

describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  let employeeRepository: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    employeeRepository = new EmployeeRepository() as jest.Mocked<EmployeeRepository>;
    employeeService = new EmployeeService(employeeRepository);
  });

  it('should return all employees', async () => {
    const mockEmployees = [{ id: 1, name: '홍길동' }, { id: 2, name: '김철수' }];
    employeeRepository.findAll.mockResolvedValue(mockEmployees);

    const result = await employeeService.findAll();
    
    expect(result).toEqual(mockEmployees);
    expect(employeeRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
```

### 5.2 통합 테스트

- API 엔드포인트에 대한 통합 테스트 작성
- Supertest 라이브러리 사용
- 테스트 데이터베이스 환경 구성
- 테스트 전후 데이터베이스 초기화

### 5.3 E2E 테스트

- 핵심 사용자 시나리오에 대한 E2E 테스트 작성
- Cypress 또는 Playwright 사용
- CI/CD 파이프라인에 E2E 테스트 통합

## 6. 배포 프로세스

### 6.1 개발 환경 배포

- develop 브랜치 변경 시 자동 배포
- 테스트 서버에 배포

### 6.2 스테이징 환경 배포

- release 브랜치 생성 시 자동 배포
- QA 테스트를 위한 환경

### 6.3 프로덕션 환경 배포

- main 브랜치에 병합 시 자동 배포
- 배포 전 승인 프로세스 적용

### 6.4 롤백 절차

- 배포 이슈 발생 시 롤백 절차
- 이전 안정 버전으로 즉시 롤백
- 장애 분석 및 수정 후 재배포

## 7. 성능 최적화 가이드라인

### 7.1 프론트엔드 성능 최적화

- 이미지 최적화 (Next.js Image 컴포넌트 사용)
- 코드 분할 및 지연 로딩
- 메모이제이션을 통한 불필요한 리렌더링 방지
- 번들 크기 최소화

### 7.2 백엔드 성능 최적화

- 데이터베이스 쿼리 최적화
- 적절한 인덱싱
- 캐싱 전략 구현
- 비동기 처리를 통한 응답 시간 개선

## 8. 보안 가이드라인

### 8.1 인증 및 권한 부여

- JWT 기반 인증 구현
- 역할 기반 접근 제어(RBAC) 적용
- 토큰 만료 및 갱신 전략

### 8.2 데이터 보안

- 민감 정보 암호화 저장
- HTTPS 통신 적용
- SQL 인젝션 방지
- XSS 및 CSRF 방지

### 8.3 보안 헤더

- 적절한 보안 헤더 설정
  - Content-Security-Policy
  - X-XSS-Protection
  - X-Content-Type-Options
  - Strict-Transport-Security

## 9. 문서화 가이드라인

### 9.1 코드 주석

- 복잡한 로직에 대한 주석 추가
- JSDoc 스타일 사용
- 공개 API 및 함수에 대한 주석 필수

```typescript
/**
 * 주어진 조건에 맞는 직원 목록을 검색합니다.
 * 
 * @param {SearchEmployeeDto} searchDto - 검색 조건
 * @returns {Promise<Employee[]>} 검색된 직원 목록
 * @throws {NotFoundException} 검색 결과가 없을 경우
 */
async searchEmployees(searchDto: SearchEmployeeDto): Promise<Employee[]> {
  // 구현 내용
}
```

### 9.2 API 문서화

- Swagger/OpenAPI 사용
- 모든 엔드포인트, 요청/응답 스키마, 예제 포함
- API 버전 관리

## 10. 트러블슈팅 및 문제 해결

### 10.1 로깅 전략

- 구조화된 로깅 사용 (Winston/Pino)
- 로그 레벨 적절히 사용 (debug, info, warn, error)
- 중앙 집중식 로그 수집 (ELK 스택)

### 10.2 모니터링

- 애플리케이션 성능 모니터링 (APM)
- 서버 및 인프라 모니터링
- 알림 설정 (임계값 초과 시)

### 10.3 디버깅 가이드

- 개발 환경에서의 디버깅 방법
- 프로덕션 이슈 분석 방법
- 문제 해결 체크리스트

---

이 개발 가이드는 프로젝트가 발전함에 따라 지속적으로 업데이트됩니다. 모든 개발자는 최신 버전의 가이드를 참조해야 합니다.

최종 업데이트: 2025년 4월
