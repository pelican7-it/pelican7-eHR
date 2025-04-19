# Pelican7 e-HR API 문서

이 문서는 Pelican7 e-HR 시스템의 API를 설명합니다. 모든 API는 RESTful 원칙을 따르며, JSON 형식으로 요청 및 응답을 처리합니다.

## 1. API 개요

### 1.1 기본 URL

```
https://api.pelican7.com/v1
```

### 1.2 인증

모든 API 요청은 JWT(JSON Web Token) 기반 인증이 필요합니다. 토큰은 Authorization 헤더에 Bearer 형식으로 포함되어야 합니다.

```http
Authorization: Bearer {token}
```

### 1.3 응답 형식

모든 응답은 다음 구조를 따릅니다:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "statusCode": 200
}
```

오류 발생 시:

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

### 1.4 공통 HTTP 상태 코드

- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 부족
- `404 Not Found`: 리소스를 찾을 수 없음
- `409 Conflict`: 리소스 충돌
- `500 Internal Server Error`: 서버 오류

## 2. 인증 API

### 2.1 로그인

사용자 인증 및 JWT 토큰 발급

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": 1,
      "username": "user@example.com",
      "name": "홍길동",
      "role": "hr_manager"
    }
  },
  "message": "로그인 성공",
  "statusCode": 200
}
```

### 2.2 토큰 갱신

만료된 액세스 토큰 갱신

**Endpoint:** `POST /auth/refresh-token`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "토큰 갱신 성공",
  "statusCode": 200
}
```

### 2.3 로그아웃

**Endpoint:** `POST /auth/logout`

**Request:** 헤더에 액세스 토큰만 포함

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "로그아웃 성공",
  "statusCode": 200
}
```

## 3. 인사 정보 API

### 3.1 직원 목록 조회

**Endpoint:** `GET /employees`

**Query Parameters:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10, 최대: 100)
- `search`: 검색어
- `department`: 부서 ID
- `status`: 고용 상태 (active, terminated, on_leave)
- `sortBy`: 정렬 기준 (name, hire_date, department)
- `sortOrder`: 정렬 순서 (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "employeeNumber": "EMP001",
        "firstName": "길동",
        "lastName": "홍",
        "email": "hong.gildong@example.com",
        "phoneNumber": "010-1234-5678",
        "hireDate": "2023-01-15",
        "employmentStatus": "active",
        "employmentType": "full_time",
        "department": {
          "id": 1,
          "name": "인사팀"
        },
        "position": {
          "id": 1,
          "name": "팀장"
        }
      },
      // ... 추가 직원 정보
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 150,
      "totalPages": 15
    }
  },
  "message": "직원 목록 조회 성공",
  "statusCode": 200
}
```

### 3.2 직원 상세 조회

**Endpoint:** `GET /employees/{employeeId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employeeNumber": "EMP001",
    "firstName": "길동",
    "lastName": "홍",
    "email": "hong.gildong@example.com",
    "phoneNumber": "010-1234-5678",
    "birthDate": "1990-05-15",
    "gender": "male",
    "address": "서울시 강남구 테헤란로 123",
    "hireDate": "2023-01-15",
    "terminationDate": null,
    "employmentStatus": "active",
    "employmentType": "full_time",
    "department": {
      "id": 1,
      "name": "인사팀"
    },
    "position": {
      "id": 1,
      "name": "팀장"
    },
    "manager": {
      "id": 2,
      "firstName": "철수",
      "lastName": "김",
      "position": "부장"
    },
    "bankAccount": {
      "bankName": "신한은행",
      "accountNumber": "110-123-456789"
    }
  },
  "message": "직원 상세 조회 성공",
  "statusCode": 200
}
```

### 3.3 직원 등록

**Endpoint:** `POST /employees`

**Request:**
```json
{
  "employeeNumber": "EMP002",
  "firstName": "영희",
  "lastName": "김",
  "email": "kim.younghee@example.com",
  "phoneNumber": "010-9876-5432",
  "birthDate": "1992-08-25",
  "gender": "female",
  "address": "서울시 서초구 서초대로 456",
  "hireDate": "2023-03-01",
  "employmentStatus": "active",
  "employmentType": "full_time",
  "departmentId": 2,
  "positionId": 3,
  "managerId": 1,
  "bankAccount": {
    "bankName": "국민은행",
    "accountNumber": "111-22-333333"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "employeeNumber": "EMP002",
    "firstName": "영희",
    "lastName": "김",
    // ... 기타 직원 정보
  },
  "message": "직원 등록 성공",
  "statusCode": 201
}
```

### 3.4 직원 정보 수정

**Endpoint:** `PUT /employees/{employeeId}`

**Request:**
```json
{
  "phoneNumber": "010-1111-2222",
  "address": "서울시 송파구 올림픽로 123",
  "departmentId": 3,
  "positionId": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "employeeNumber": "EMP002",
    "firstName": "영희",
    "lastName": "김",
    "phoneNumber": "010-1111-2222",
    "address": "서울시 송파구 올림픽로 123",
    "department": {
      "id": 3,
      "name": "마케팅팀"
    },
    "position": {
      "id": 2,
      "name": "대리"
    },
    // ... 기타 직원 정보
  },
  "message": "직원 정보 수정 성공",
  "statusCode": 200
}
```

### 3.5 직원 퇴사 처리

**Endpoint:** `PUT /employees/{employeeId}/terminate`

**Request:**
```json
{
  "terminationDate": "2023-12-31",
  "reason": "자발적 퇴사",
  "note": "타 회사 이직"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "employeeNumber": "EMP002",
    "firstName": "영희",
    "lastName": "김",
    "employmentStatus": "terminated",
    "terminationDate": "2023-12-31",
    // ... 기타 직원 정보
  },
  "message": "직원 퇴사 처리 성공",
  "statusCode": 200
}
```

## 4. 부서 API

### 4.1 부서 목록 조회

**Endpoint:** `GET /departments`

**Query Parameters:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10, 최대: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "departmentName": "인사팀",
        "departmentCode": "HR",
        "manager": {
          "id": 1,
          "firstName": "길동",
          "lastName": "홍"
        },
        "employeeCount": 15,
        "parentDepartment": null
      },
      // ... 추가 부서 정보
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 25,
      "totalPages": 3
    }
  },
  "message": "부서 목록 조회 성공",
  "statusCode": 200
}
```

### 4.2 부서 상세 조회

**Endpoint:** `GET /departments/{departmentId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "departmentName": "개발팀",
    "departmentCode": "DEV",
    "description": "소프트웨어 개발 및 유지보수 담당",
    "manager": {
      "id": 5,
      "firstName": "철수",
      "lastName": "김",
      "position": "팀장"
    },
    "parentDepartment": {
      "id": 1,
      "departmentName": "IT본부",
      "departmentCode": "IT"
    },
    "childDepartments": [
      {
        "id": 8,
        "departmentName": "백엔드팀",
        "departmentCode": "DEV-BE"
      },
      {
        "id": 9,
        "departmentName": "프론트엔드팀",
        "departmentCode": "DEV-FE"
      }
    ],
    "employees": [
      {
        "id": 5,
        "firstName": "철수",
        "lastName": "김",
        "position": "팀장"
      },
      // ... 추가 직원 정보
    ]
  },
  "message": "부서 상세 조회 성공",
  "statusCode": 200
}
```

### 4.3 부서 생성

**Endpoint:** `POST /departments`

**Request:**
```json
{
  "departmentName": "디자인팀",
  "departmentCode": "DESIGN",
  "description": "UI/UX 디자인 및 브랜딩 담당",
  "managerId": 10,
  "parentDepartmentId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "departmentName": "디자인팀",
    "departmentCode": "DESIGN",
    "description": "UI/UX 디자인 및 브랜딩 담당",
    "manager": {
      "id": 10,
      "firstName": "민지",
      "lastName": "박"
    },
    "parentDepartment": {
      "id": 1,
      "departmentName": "IT본부"
    }
  },
  "message": "부서 생성 성공",
  "statusCode": 201
}
```

## 5. 근태 관리 API

### 5.1 출퇴근 기록 조회

**Endpoint:** `GET /attendance`

**Query Parameters:**
- `employeeId`: 직원 ID
- `startDate`: 시작일 (YYYY-MM-DD)
- `endDate`: 종료일 (YYYY-MM-DD)
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10, 최대: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "employee": {
          "id": 1,
          "firstName": "길동",
          "lastName": "홍"
        },
        "checkIn": "2023-05-15T09:00:00Z",
        "checkOut": "2023-05-15T18:00:00Z",
        "workHours": 8,
        "overtimeHours": 0,
        "status": "normal"
      },
      // ... 추가 근태 기록
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 120,
      "totalPages": 12
    }
  },
  "message": "근태 기록 조회 성공",
  "statusCode": 200
}
```

### 5.2 출근 기록

**Endpoint:** `POST /attendance/check-in`

**Request:**
```json
{
  "employeeId": 1,
  "note": "재택근무"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 150,
    "employee": {
      "id": 1,
      "firstName": "길동",
      "lastName": "홍"
    },
    "checkIn": "2023-05-16T08:55:00Z",
    "checkOut": null,
    "note": "재택근무"
  },
  "message": "출근 기록 성공",
  "statusCode": 201
}
```

### 5.3 퇴근 기록

**Endpoint:** `PUT /attendance/{recordId}/check-out`

**Request:**
```json
{
  "note": "업무 완료"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 150,
    "employee": {
      "id": 1,
      "firstName": "길동",
      "lastName": "홍"
    },
    "checkIn": "2023-05-16T08:55:00Z",
    "checkOut": "2023-05-16T18:05:00Z",
    "workHours": 9.17,
    "overtimeHours": 0.17,
    "status": "normal",
    "note": "재택근무, 업무 완료"
  },
  "message": "퇴근 기록 성공",
  "statusCode": 200
}
```

### 5.4 휴가 신청

**Endpoint:** `POST /leaves`

**Request:**
```json
{
  "employeeId": 1,
  "leaveType": "annual",
  "startDate": "2023-06-01",
  "endDate": "2023-06-02",
  "reason": "개인 사유",
  "contactNumber": "010-1234-5678"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 25,
    "employee": {
      "id": 1,
      "firstName": "길동",
      "lastName": "홍"
    },
    "leaveType": "annual",
    "startDate": "2023-06-01",
    "endDate": "2023-06-02",
    "totalDays": 2,
    "reason": "개인 사유",
    "status": "pending",
    "contactNumber": "010-1234-5678"
  },
  "message": "휴가 신청 성공",
  "statusCode": 201
}
```

### 5.5 휴가 승인/거절

**Endpoint:** `PUT /leaves/{leaveId}/status`

**Request:**
```json
{
  "status": "approved",
  "note": "승인합니다"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 25,
    "employee": {
      "id": 1,
      "firstName": "길동",
      "lastName": "홍"
    },
    "leaveType": "annual",
    "startDate": "2023-06-01",
    "endDate": "2023-06-02",
    "totalDays": 2,
    "status": "approved",
    "approvedBy": {
      "id": 5,
      "firstName": "철수",
      "lastName": "김"
    },
    "approvalDate": "2023-05-20T10:15:00Z",
    "note": "승인합니다"
  },
  "message": "휴가 승인 성공",
  "statusCode": 200
}
```

## 6. 급여 관리 API

### 6.1 급여 정보 조회

**Endpoint:** `GET /payroll/employees/{employeeId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": 1,
      "firstName": "길동",
      "lastName": "홍",
      "department": "인사팀",
      "position": "팀장"
    },
    "baseSalary": 5000000,
    "bankInfo": {
      "bankName": "신한은행",
      "accountNumber": "110-123-456789"
    },
    "salaryHistory": [
      {
        "id": 12,
        "paymentDate": "2023-05-25",
        "periodStart": "2023-05-01",
        "periodEnd": "2023-05-31",
        "baseSalary": 5000000,
        "allowances": 500000,
        "deductions": 200000,
        "tax": 430000,
        "netSalary": 4870000
      },
      // ... 추가 급여 내역
    ]
  },
  "message": "급여 정보 조회 성공",
  "statusCode": 200
}
```

### 6.2 급여 명세서 생성

**Endpoint:** `POST /payroll/records`

**Request:**
```json
{
  "employeeId": 1,
  "paymentPeriodStart": "2023-06-01",
  "paymentPeriodEnd": "2023-06-30",
  "paymentDate": "2023-06-25",
  "baseSalary": 5000000,
  "allowances": 500000,
  "deductions": 200000,
  "tax": 430000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 13,
    "employee": {
      "id": 1,
      "firstName": "길동",
      "lastName": "홍"
    },
    "paymentPeriodStart": "2023-06-01",
    "paymentPeriodEnd": "2023-06-30",
    "paymentDate": "2023-06-25",
    "baseSalary": 5000000,
    "allowances": 500000,
    "deductions": 200000,
    "tax": 430000,
    "netSalary": 4870000,
    "status": "draft"
  },
  "message": "급여 명세서 생성 성공",
  "statusCode": 201
}
```

## 7. 성과 관리 API

### 7.1 성과 평가 생성

**Endpoint:** `POST /performance-reviews`

**Request:**
```json
{
  "employeeId": 1,
  "reviewerId": 5,
  "reviewPeriodStart": "2023-01-01",
  "reviewPeriodEnd": "2023-06-30",
  "reviewType": "semi_annual",
  "goals": [
    {
      "title": "신규 직원 온보딩 프로세스 개선",
      "description": "신규 직원 온보딩 만족도 10% 향상",
      "weight": 30
    },
    {
      "title": "인사 시스템 도입",
      "description": "클라우드 기반 인사 시스템 도입 및 안정화",
      "weight": 40
    },
    {
      "title": "직원 교육 프로그램 개발",
      "description": "직무별 교육 체계 수립 및 교육 과정 개발",
      "weight": 30
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 8,
    "employee": {
      "id": 1,
      "firstName": "길동",
      "lastName": "홍"
    },
    "reviewer": {
      "id": 5,
      "firstName": "철수",
      "lastName": "김"
    },
    "reviewPeriodStart": "2023-01-01",
    "reviewPeriodEnd": "2023-06-30",
    "reviewType": "semi_annual",
    "status": "in_progress",
    "goals": [
      {
        "id": 1,
        "title": "신규 직원 온보딩 프로세스 개선",
        "description": "신규 직원 온보딩 만족도 10% 향상",
        "weight": 30,
        "rating": null
      },
      // ... 추가 목표
    ]
  },
  "message": "성과 평가 생성 성공",
  "statusCode": 201
}
```

## 8. AI 챗봇 API

### 8.1 질의 응답

**Endpoint:** `POST /ai/chat`

**Request:**
```json
{
  "query": "연차 신청은 어떻게 하나요?",
  "employeeId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "연차 신청은 e-HR 시스템의 '근태 관리 > 휴가 신청' 메뉴에서 가능합니다. 휴가 유형, 시작일, 종료일, 사유를 입력하여 신청할 수 있으며, 부서장의 승인 후 확정됩니다. 추가 도움이 필요하시면 인사팀(내선 1234)으로 문의해 주세요.",
    "relatedLinks": [
      {
        "title": "휴가 신청 가이드",
        "url": "/docs/leave-guide"
      },
      {
        "title": "휴가 정책",
        "url": "/docs/leave-policy"
      }
    ]
  },
  "message": "질의 응답 성공",
  "statusCode": 200
}
```

## 9. 보고서 API

### 9.1 인사 통계 보고서

**Endpoint:** `GET /reports/hr-statistics`

**Query Parameters:**
- `startDate`: 시작일 (YYYY-MM-DD)
- `endDate`: 종료일 (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "headcount": {
      "total": 150,
      "byDepartment": [
        {
          "name": "인사팀",
          "count": 15
        },
        {
          "name": "개발팀",
          "count": 45
        },
        // ... 추가 부서별 인원
      ],
      "byEmploymentType": [
        {
          "type": "full_time",
          "count": 130
        },
        {
          "type": "part_time",
          "count": 10
        },
        {
          "type": "contract",
          "count": 10
        }
      ]
    },
    "turnover": {
      "rate": 5.2,
      "newHires": 12,
      "terminations": 8
    },
    "leaveUtilization": {
      "averageUtilizationRate": 65.3,
      "byDepartment": [
        {
          "name": "인사팀",
          "rate": 70.2
        },
        // ... 추가 부서별 휴가 사용률
      ]
    }
  },
  "message": "인사 통계 보고서 조회 성공",
  "statusCode": 200
}
```

---

이 API 문서는 시스템 개발 과정에서 지속적으로 업데이트됩니다. 최신 API 명세를 위해 개발팀에 문의하거나 Swagger 문서를 참조하세요.

최종 업데이트: 2025년 4월
