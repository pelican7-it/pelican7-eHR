# Pelican7 e-HR 프론트엔드

Next.js 기반의 e-HR 시스템 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Next.js 14+**: React 프레임워크
- **TypeScript**: 타입 안정성을 위한 JavaScript 수퍼셋
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **React Query**: 서버 상태 관리
- **Zod**: 스키마 검증
- **Recharts**: 데이터 시각화 라이브러리
- **date-fns**: 날짜 처리 라이브러리

## 시작하기

### 개발 환경 설정

```bash
# 프로젝트 클론
git clone https://github.com/pelican7-it/pelican7-eHR.git
cd pelican7-eHR/frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

이제 `http://localhost:3000`에서 애플리케이션에 접속할 수 있습니다.

### 주요 npm 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션용 빌드
- `npm run start`: 프로덕션 모드로 서버 실행
- `npm run lint`: 린트 검사
- `npm run test`: 테스트 실행

## 폴더 구조

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router 구조
│   │   ├── (auth)/          # 인증 관련 라우트
│   │   │   ├── login/       # 로그인 페이지
│   │   │   ├── register/    # 회원가입 페이지
│   │   │   └── layout.tsx   # 인증 레이아웃
│   │   ├── (dashboard)/     # 대시보드 라우트
│   │   │   ├── dashboard/   # 메인 대시보드
│   │   │   ├── employees/   # 직원 관리
│   │   │   ├── attendance/  # 근태 관리
│   │   │   ├── payroll/     # 급여 관리
│   │   │   └── ...          # 기타 모듈
│   │   ├── api/             # API 라우트
│   │   │   ├── auth/        # 인증 API
│   │   │   └── ...          # 기타 API
│   │   └── layout.tsx       # 루트 레이아웃
│   ├── components/          # 공통 컴포넌트
│   │   ├── ui/              # UI 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── forms/           # 폼 컴포넌트
│   │   ├── tables/          # 테이블 컴포넌트
│   │   ├── charts/          # 차트 컴포넌트
│   │   └── layouts/         # 레이아웃 컴포넌트
│   ├── hooks/               # 커스텀 훅
│   │   ├── use-auth.ts
│   │   ├── use-employees.ts
│   │   └── ...
│   ├── lib/                 # 유틸리티 함수
│   │   ├── api.ts           # API 클라이언트
│   │   ├── date.ts          # 날짜 유틸리티
│   │   └── ...
│   ├── services/            # API 서비스
│   │   ├── auth-service.ts
│   │   ├── employee-service.ts
│   │   └── ...
│   ├── store/               # 상태 관리
│   │   ├── queries/         # React Query 쿼리
│   │   └── context/         # React Context
│   ├── types/               # TypeScript 타입
│   │   ├── employee.ts
│   │   ├── department.ts
│   │   └── ...
│   └── styles/              # 글로벌 스타일
│       └── globals.css
├── public/                  # 정적 파일
├── tsconfig.json            # TypeScript 설정
├── tailwind.config.js       # Tailwind CSS 설정
├── next.config.js           # Next.js 설정
└── package.json             # 패키지 정보
```

## 주요 기능

- **반응형 디자인**: 모든 디바이스 지원
- **다크 모드**: 시스템 설정 또는 사용자 선호도에 따른 테마 변경
- **다국어 지원**: 한국어, 영어, 일본어 지원
- **접근성**: WCAG 2.1 지침 준수
- **오프라인 지원**: PWA(Progressive Web App) 기능

## 컴포넌트 개발 가이드

### UI 컴포넌트

모든 UI 컴포넌트는 `components/ui` 디렉토리에 위치합니다. 각 컴포넌트는 다음 구조를 따릅니다:

```tsx
// components/ui/button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        // ... 추가 변형
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

### 데이터 페칭

데이터 페칭은 React Query를 사용하여 처리합니다:

```tsx
// hooks/use-employees.ts
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/services/employee-service';

export function useEmployees(options = {}) {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getEmployees(),
    ...options,
  });
}
```

## 인증 및 권한 관리

인증은 JWT 기반으로 구현되어 있으며, `lib/auth.ts`에서 관련 로직을 확인할 수 있습니다. 권한 관리는 역할 기반 접근 제어(RBAC)를 사용합니다.

## 테스트

테스트는 Jest와 React Testing Library를 사용합니다:

```bash
# 모든 테스트 실행
npm run test

# 특정 파일 테스트
npm run test -- components/ui/button
```

## 배포

배포는 CI/CD 파이프라인을 통해 자동화되어 있습니다:

1. `develop` 브랜치에 병합 시 개발 환경에 자동 배포
2. `main` 브랜치에 병합 시 프로덕션 환경에 자동 배포

## 문제 해결

개발 중 자주 발생하는 문제와 해결 방법은 [문제 해결 가이드](../docs/troubleshooting.md)를 참조하세요.

## 기여 가이드

기여 방법에 대한 자세한 내용은 [개발 가이드](../docs/development-guide.md)를 참조하세요.
