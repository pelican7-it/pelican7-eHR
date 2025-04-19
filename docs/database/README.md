# Pelican7 e-HR 데이터베이스 설계

이 문서는 Pelican7 e-HR 시스템의 데이터베이스 설계를 설명합니다. 시스템은 관계형 데이터베이스(PostgreSQL)를 주 데이터 저장소로 사용하며, 비정형 데이터는 MongoDB에 저장됩니다.

## 1. 데이터베이스 아키텍처

### 1.1 데이터베이스 기술 선택

- **PostgreSQL**: 주요 관계형 데이터(직원 정보, 급여, 근태 등)
  - 트랜잭션 지원
  - 복잡한 쿼리 및 조인 지원
  - 강력한 데이터 무결성

- **MongoDB**: 비정형 데이터(문서, 로그, 설정 등)
  - 유연한 스키마
  - 문서 기반 저장
  - 확장성 우수

- **Redis**: 캐싱 및 세션 관리
  - 빠른 읽기/쓰기 성능
  - 데이터 만료 기능
  - Pub/Sub 패턴 지원

- **ElasticSearch**: 검색 및 로그 분석
  - 전문 검색 기능
  - 로그 분석
  - 실시간 데이터 분석

### 1.2 데이터베이스 샤딩 및 복제 전략

- **수평적 샤딩**: 대규모 데이터 처리를 위한 수평적 데이터 분할
- **읽기 복제본**: 읽기 성능 향상을 위한 복제본 사용
- **고가용성 구성**: 장애 대비를 위한 다중 인스턴스 구성

## 2. 관계형 데이터베이스 스키마 (PostgreSQL)

### 2.1 인사 정보 관련 테이블

#### 직원 정보 테이블(employees)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| employee_id | SERIAL | 직원 ID | PRIMARY KEY |
| employee_number | VARCHAR(20) | 직원 번호 | UNIQUE, NOT NULL |
| first_name | VARCHAR(50) | 이름 | NOT NULL |
| last_name | VARCHAR(50) | 성 | NOT NULL |
| email | VARCHAR(100) | 이메일 | UNIQUE, NOT NULL |
| phone_number | VARCHAR(20) | 전화번호 | |
| birth_date | DATE | 생년월일 | |
| gender | VARCHAR(10) | 성별 | |
| national_id | VARCHAR(20) | 주민등록번호/외국인등록번호 | UNIQUE |
| address | TEXT | 주소 | |
| hire_date | DATE | 입사일 | NOT NULL |
| termination_date | DATE | 퇴사일 | |
| employment_status | VARCHAR(20) | 고용 상태 | NOT NULL |
| employment_type | VARCHAR(20) | 고용 형태 | NOT NULL |
| department_id | INTEGER | 부서 ID | FOREIGN KEY |
| position_id | INTEGER | 직급/직책 ID | FOREIGN KEY |
| manager_id | INTEGER | 관리자 ID | FOREIGN KEY, SELF REFERENCE |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 부서 테이블(departments)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| department_id | SERIAL | 부서 ID | PRIMARY KEY |
| department_name | VARCHAR(100) | 부서명 | NOT NULL |
| department_code | VARCHAR(20) | 부서 코드 | UNIQUE, NOT NULL |
| parent_department_id | INTEGER | 상위 부서 ID | FOREIGN KEY, SELF REFERENCE |
| manager_id | INTEGER | 부서장 ID | FOREIGN KEY |
| description | TEXT | 부서 설명 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 직급/직책 테이블(positions)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| position_id | SERIAL | 직급/직책 ID | PRIMARY KEY |
| position_name | VARCHAR(100) | 직급/직책명 | NOT NULL |
| position_level | INTEGER | 직급 레벨 | |
| job_description | TEXT | 직무 설명 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

### 2.2 근태 관련 테이블

#### 근태 기록 테이블(attendance_records)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| record_id | SERIAL | 기록 ID | PRIMARY KEY |
| employee_id | INTEGER | 직원 ID | FOREIGN KEY |
| check_in | TIMESTAMP | 출근 시간 | |
| check_out | TIMESTAMP | 퇴근 시간 | |
| work_hours | DECIMAL(5,2) | 근무 시간 | |
| overtime_hours | DECIMAL(5,2) | 초과 근무 시간 | |
| status | VARCHAR(20) | 상태 | |
| note | TEXT | 비고 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 휴가 신청 테이블(leave_requests)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| leave_id | SERIAL | 휴가 ID | PRIMARY KEY |
| employee_id | INTEGER | 직원 ID | FOREIGN KEY |
| leave_type | VARCHAR(50) | 휴가 유형 | NOT NULL |
| start_date | DATE | 시작일 | NOT NULL |
| end_date | DATE | 종료일 | NOT NULL |
| total_days | DECIMAL(5,2) | 총 일수 | NOT NULL |
| reason | TEXT | 사유 | |
| status | VARCHAR(20) | 상태 | NOT NULL |
| approved_by | INTEGER | 승인자 ID | FOREIGN KEY |
| approval_date | TIMESTAMP | 승인일시 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 휴가 할당 테이블(leave_balances)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| balance_id | SERIAL | 할당 ID | PRIMARY KEY |
| employee_id | INTEGER | 직원 ID | FOREIGN KEY |
| leave_type | VARCHAR(50) | 휴가 유형 | NOT NULL |
| year | INTEGER | 연도 | NOT NULL |
| allocated_days | DECIMAL(5,2) | 할당 일수 | NOT NULL |
| used_days | DECIMAL(5,2) | 사용 일수 | DEFAULT 0 |
| remaining_days | DECIMAL(5,2) | 잔여 일수 | |
| expire_date | DATE | 만료일 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

### 2.3 급여 관련 테이블

#### 급여 정보 테이블(salary_info)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| salary_id | SERIAL | 급여 정보 ID | PRIMARY KEY |
| employee_id | INTEGER | 직원 ID | FOREIGN KEY |
| base_salary | DECIMAL(12,2) | 기본급 | NOT NULL |
| currency | VARCHAR(3) | 통화 | DEFAULT 'KRW' |
| effective_date | DATE | 적용 시작일 | NOT NULL |
| end_date | DATE | 적용 종료일 | |
| salary_type | VARCHAR(20) | 급여 유형 | |
| bank_name | VARCHAR(100) | 은행명 | |
| bank_account | VARCHAR(50) | 계좌번호 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 급여 지급 내역 테이블(payroll_records)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| payroll_id | SERIAL | 급여 지급 ID | PRIMARY KEY |
| employee_id | INTEGER | 직원 ID | FOREIGN KEY |
| payment_period_start | DATE | 지급 기간 시작일 | NOT NULL |
| payment_period_end | DATE | 지급 기간 종료일 | NOT NULL |
| payment_date | DATE | 지급일 | NOT NULL |
| base_salary | DECIMAL(12,2) | 기본급 | NOT NULL |
| allowances | DECIMAL(12,2) | 수당 | DEFAULT 0 |
| deductions | DECIMAL(12,2) | 공제 | DEFAULT 0 |
| tax | DECIMAL(12,2) | 세금 | DEFAULT 0 |
| net_salary | DECIMAL(12,2) | 실수령액 | NOT NULL |
| status | VARCHAR(20) | 상태 | NOT NULL |
| note | TEXT | 비고 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

### 2.4 성과 관리 관련 테이블

#### 성과 평가 테이블(performance_reviews)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| review_id | SERIAL | 평가 ID | PRIMARY KEY |
| employee_id | INTEGER | 직원 ID | FOREIGN KEY |
| reviewer_id | INTEGER | 평가자 ID | FOREIGN KEY |
| review_period_start | DATE | 평가 기간 시작일 | NOT NULL |
| review_period_end | DATE | 평가 기간 종료일 | NOT NULL |
| review_date | DATE | 평가일 | |
| review_type | VARCHAR(50) | 평가 유형 | |
| overall_rating | DECIMAL(3,2) | 종합 평가 | |
| strengths | TEXT | 강점 | |
| areas_for_improvement | TEXT | 개선 사항 | |
| goals | TEXT | 목표 | |
| employee_comments | TEXT | 직원 의견 | |
| status | VARCHAR(20) | 상태 | NOT NULL |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

### 2.5 채용 관련 테이블

#### 채용 정보 테이블(recruitment)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| recruitment_id | SERIAL | 채용 ID | PRIMARY KEY |
| job_title | VARCHAR(100) | 직무명 | NOT NULL |
| department_id | INTEGER | 부서 ID | FOREIGN KEY |
| position_id | INTEGER | 직급/직책 ID | FOREIGN KEY |
| vacancy_count | INTEGER | 채용 인원 | DEFAULT 1 |
| job_description | TEXT | 직무 설명 | |
| qualifications | TEXT | 자격 요건 | |
| responsibilities | TEXT | 담당 업무 | |
| employment_type | VARCHAR(20) | 고용 형태 | |
| status | VARCHAR(20) | 상태 | NOT NULL |
| opening_date | DATE | 공고 시작일 | |
| closing_date | DATE | 공고 마감일 | |
| hiring_manager_id | INTEGER | 채용 담당자 ID | FOREIGN KEY |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 지원자 정보 테이블(candidates)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| candidate_id | SERIAL | 지원자 ID | PRIMARY KEY |
| recruitment_id | INTEGER | 채용 ID | FOREIGN KEY |
| first_name | VARCHAR(50) | 이름 | NOT NULL |
| last_name | VARCHAR(50) | 성 | NOT NULL |
| email | VARCHAR(100) | 이메일 | NOT NULL |
| phone_number | VARCHAR(20) | 전화번호 | |
| resume_url | TEXT | 이력서 URL | |
| cover_letter | TEXT | 자기소개서 | |
| application_date | DATE | 지원일 | NOT NULL |
| status | VARCHAR(20) | 상태 | NOT NULL |
| source | VARCHAR(50) | 지원 경로 | |
| notes | TEXT | 비고 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 면접 정보 테이블(interviews)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| interview_id | SERIAL | 면접 ID | PRIMARY KEY |
| candidate_id | INTEGER | 지원자 ID | FOREIGN KEY |
| interviewer_id | INTEGER | 면접관 ID | FOREIGN KEY |
| interview_date | TIMESTAMP | 면접일시 | NOT NULL |
| interview_type | VARCHAR(50) | 면접 유형 | |
| duration | INTEGER | 소요 시간(분) | |
| location | VARCHAR(100) | 장소 | |
| feedback | TEXT | 피드백 | |
| rating | INTEGER | 평가 점수 | |
| status | VARCHAR(20) | 상태 | NOT NULL |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

### 2.6 교육 관련 테이블

#### 교육 과정 테이블(training_courses)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| course_id | SERIAL | 과정 ID | PRIMARY KEY |
| course_name | VARCHAR(100) | 과정명 | NOT NULL |
| course_code | VARCHAR(20) | 과정 코드 | UNIQUE |
| description | TEXT | 과정 설명 | |
| course_type | VARCHAR(50) | 과정 유형 | |
| duration | INTEGER | 소요 시간 | |
| provider | VARCHAR(100) | 교육 제공자 | |
| cost | DECIMAL(10,2) | 비용 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 교육 참여 테이블(training_enrollments)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| enrollment_id | SERIAL | 등록 ID | PRIMARY KEY |
| employee_id | INTEGER | 직원 ID | FOREIGN KEY |
| course_id | INTEGER | 과정 ID | FOREIGN KEY |
| start_date | DATE | 시작일 | |
| end_date | DATE | 종료일 | |
| completion_status | VARCHAR(20) | 이수 상태 | |
| completion_date | DATE | 이수일 | |
| certification | VARCHAR(100) | 자격증/수료증 | |
| feedback | TEXT | 피드백 | |
| rating | INTEGER | 평가 점수 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

### 2.7 복리후생 관련 테이블

#### 복리후생 항목 테이블(benefits)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| benefit_id | SERIAL | 복리후생 ID | PRIMARY KEY |
| benefit_name | VARCHAR(100) | 복리후생명 | NOT NULL |
| benefit_type | VARCHAR(50) | 복리후생 유형 | |
| description | TEXT | 설명 | |
| eligibility_criteria | TEXT | 자격 기준 | |
| start_date | DATE | 시작일 | |
| end_date | DATE | 종료일 | |
| is_active | BOOLEAN | 활성 여부 | DEFAULT TRUE |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 직원 복리후생 수혜 테이블(employee_benefits)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| emp_benefit_id | SERIAL | 직원 복리후생 ID | PRIMARY KEY |
| employee_id | INTEGER | 직원 ID | FOREIGN KEY |
| benefit_id | INTEGER | 복리후생 ID | FOREIGN KEY |
| start_date | DATE | 시작일 | NOT NULL |
| end_date | DATE | 종료일 | |
| amount | DECIMAL(10,2) | 금액 | |
| status | VARCHAR(20) | 상태 | NOT NULL |
| notes | TEXT | 비고 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

### 2.8 시스템 관리 테이블

#### 사용자 계정 테이블(users)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| user_id | SERIAL | 사용자 ID | PRIMARY KEY |
| employee_id | INTEGER | 직원 ID | FOREIGN KEY |
| username | VARCHAR(50) | 사용자명 | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | 비밀번호 해시 | NOT NULL |
| email | VARCHAR(100) | 이메일 | UNIQUE, NOT NULL |
| role | VARCHAR(50) | 역할 | NOT NULL |
| is_active | BOOLEAN | 활성 여부 | DEFAULT TRUE |
| last_login | TIMESTAMP | 마지막 로그인 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 권한 테이블(permissions)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| permission_id | SERIAL | 권한 ID | PRIMARY KEY |
| permission_name | VARCHAR(100) | 권한명 | NOT NULL |
| permission_code | VARCHAR(100) | 권한 코드 | UNIQUE, NOT NULL |
| description | TEXT | 설명 | |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

#### 역할-권한 매핑 테이블(role_permissions)

| 컬럼명 | 데이터 타입 | 설명 | 제약 조건 |
|--------|------------|------|----------|
| role_permission_id | SERIAL | 역할-권한 ID | PRIMARY KEY |
| role | VARCHAR(50) | 역할 | NOT NULL |
| permission_id | INTEGER | 권한 ID | FOREIGN KEY |
| created_at | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP |

## 3. 비관계형 데이터베이스 컬렉션 (MongoDB)

### 3.1 문서 저장소

#### 문서 컬렉션 (documents)
```json
{
  "_id": ObjectId("..."),
  "document_type": "employment_contract",
  "title": "고용 계약서",
  "content": "Base64 encoded content or URL",
  "employee_id": 12345,
  "metadata": {
    "version": "1.0",
    "created_by": "admin",
    "tags": ["contract", "hr", "employment"]
  },
  "status": "active",
  "created_at": ISODate("2025-01-01T00:00:00Z"),
  "updated_at": ISODate("2025-01-01T00:00:00Z")
}
```

#### 알림 컬렉션 (notifications)
```json
{
  "_id": ObjectId("..."),
  "user_id": 12345,
  "title": "휴가 승인 완료",
  "message": "귀하의 휴가가 승인되었습니다.",
  "type": "leave_approval",
  "reference_id": "leave_123",
  "is_read": false,
  "created_at": ISODate("2025-01-01T00:00:00Z")
}
```

#### 시스템 설정 컬렉션 (settings)
```json
{
  "_id": ObjectId("..."),
  "setting_key": "default_leave_days",
  "setting_value": 15,
  "description": "신규 입사자 기본 연차 일수",
  "scope": "global",
  "created_at": ISODate("2025-01-01T00:00:00Z"),
  "updated_at": ISODate("2025-01-01T00:00:00Z")
}
```

### 3.2 로그 저장소

#### 시스템 로그 컬렉션 (system_logs)
```json
{
  "_id": ObjectId("..."),
  "level": "INFO",
  "message": "사용자 로그인",
  "user_id": 12345,
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "details": {
    "action": "login",
    "status": "success"
  },
  "timestamp": ISODate("2025-01-01T00:00:00Z")
}
```

#### 감사 로그 컬렉션 (audit_logs)
```json
{
  "_id": ObjectId("..."),
  "action": "update",
  "entity_type": "employee",
  "entity_id": 12345,
  "user_id": 789,
  "old_values": {
    "department_id": 10
  },
  "new_values": {
    "department_id": 20
  },
  "reason": "부서 이동",
  "timestamp": ISODate("2025-01-01T00:00:00Z")
}
```

## 4. 데이터 마이그레이션 및 버전 관리

### 4.1 마이그레이션 전략

- **점진적 마이그레이션**: 시스템 운영 중 데이터 손실 없이 점진적으로 마이그레이션
- **다운타임 최소화**: 마이그레이션 중 다운타임 최소화 전략
- **롤백 계획**: 마이그레이션 실패 시 롤백 계획

### 4.2 스키마 버전 관리

- **버전 관리**: 데이터베이스 스키마 버전 관리
- **변경 이력**: 스키마 변경 이력 관리
- **호환성 확보**: 하위 호환성 확보

## 5. 데이터 보안

### 5.1 암호화 전략

- **전송 암호화**: TLS/SSL을 통한 데이터 전송 암호화
- **저장 암호화**: 민감 정보 저장 시 암호화 (주민등록번호, 계좌번호 등)
- **백업 암호화**: 백업 데이터 암호화

### 5.2 접근 제어

- **최소 권한 원칙**: 필요한 최소한의 권한만 부여
- **역할 기반 접근 제어**: 사용자 역할에 따른 접근 제어
- **감사 추적**: 모든 데이터 접근 및 변경에 대한 감사 로그

## 6. 성능 최적화

### 6.1 인덱싱 전략

- **성능 인덱스**: 자주 조회되는 필드에 대한 인덱스 생성
- **복합 인덱스**: 자주 함께 조회되는 필드에 대한 복합 인덱스
- **인덱스 모니터링**: 인덱스 사용 현황 모니터링 및 최적화

### 6.2 쿼리 최적화

- **쿼리 분석**: 성능 병목 쿼리 분석
- **쿼리 튜닝**: 성능 개선을 위한 쿼리 튜닝
- **실행 계획**: 쿼리 실행 계획 분석 및 최적화

### 6.3 캐싱 전략

- **애플리케이션 레벨 캐싱**: 자주 사용되는 데이터 인메모리 캐싱
- **데이터베이스 레벨 캐싱**: 데이터베이스 쿼리 결과 캐싱
- **분산 캐싱**: Redis를 활용한 분산 캐싱

---

**참고 사항**: 이 데이터베이스 설계는 초기 설계이며, 실제 구현 시 비즈니스 요구사항에 따라 조정될 수 있습니다. 또한, 성능 최적화를 위해 일부 테이블이 비정규화될 수 있습니다.
