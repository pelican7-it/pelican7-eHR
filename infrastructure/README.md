# Pelican7 e-HR 인프라 구성

이 디렉토리에는 Pelican7 e-HR 시스템의 인프라 구성 관련 코드가 포함되어 있습니다. Infrastructure as Code (IaC) 원칙을 따라 인프라 구성을 코드로 관리합니다.

## 기술 스택

- **Docker**: 애플리케이션 컨테이너화
- **Docker Compose**: 로컬 개발 환경 구성
- **Kubernetes**: 컨테이너 오케스트레이션
- **Terraform**: 클라우드 인프라 프로비저닝
- **AWS** 또는 **Azure**: 클라우드 인프라 제공 업체
- **GitHub Actions**: CI/CD 파이프라인

## 폴더 구조

```
infrastructure/
├── docker/                 # Docker 구성 파일
│   ├── frontend/           # 프론트엔드 Docker 구성
│   │   └── Dockerfile
│   ├── backend/            # 백엔드 Docker 구성
│   │   └── Dockerfile
│   └── docker-compose.yml  # 로컬 개발 환경 구성
├── kubernetes/             # Kubernetes 매니페스트
│   ├── frontend/           # 프론트엔드 K8s 구성
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── backend/            # 백엔드 K8s 구성
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── database/           # 데이터베이스 K8s 구성
│   │   ├── statefulset.yaml
│   │   └── service.yaml
│   └── ingress.yaml        # 인그레스 구성
├── terraform/              # Terraform 스크립트
│   ├── environments/       # 환경별 구성
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   ├── modules/            # 재사용 가능한 모듈
│   │   ├── vpc/
│   │   ├── eks/
│   │   ├── rds/
│   │   └── ...
│   └── main.tf             # 메인 Terraform 구성
└── scripts/                # 유틸리티 스크립트
    ├── setup.sh            # 초기 환경 설정
    ├── deploy.sh           # 배포 스크립트
    └── backup.sh           # 백업 스크립트
```

## 로컬 개발 환경 설정

### Docker Compose를 사용한 개발 환경

로컬 개발 환경은 Docker Compose를 사용하여 쉽게 설정할 수 있습니다:

```bash
# 개발 환경 실행
docker-compose -f docker/docker-compose.yml up -d

# 개발 환경 중지
docker-compose -f docker/docker-compose.yml down
```

이 명령은 다음 서비스를 실행합니다:

- **프론트엔드**: Next.js 애플리케이션 (포트: 3000)
- **백엔드**: Node.js/Express API 서버 (포트: 5000)
- **PostgreSQL**: 관계형 데이터베이스 (포트: 5432)
- **MongoDB**: 비관계형 데이터베이스 (포트: 27017)
- **Redis**: 캐싱 및 세션 저장소 (포트: 6379)

## Kubernetes 배포

### 프로덕션 환경 배포

프로덕션 환경은 Kubernetes를 사용하여 배포됩니다. Kubernetes 매니페스트는 `kubernetes/` 디렉토리에 있습니다:

```bash
# Kubernetes 클러스터에 배포
kubectl apply -f kubernetes/

# 특정 컴포넌트만 배포
kubectl apply -f kubernetes/backend/
```

### Kubernetes 구성 요소

- **Deployment**: 백엔드 및 프론트엔드 애플리케이션
- **StatefulSet**: 데이터베이스 (PostgreSQL, MongoDB)
- **Service**: 서비스 디스커버리 및 로드 밸런싱
- **Ingress**: 외부 트래픽 라우팅
- **ConfigMap** 및 **Secret**: 구성 및 기밀 정보
- **PersistentVolume**: 데이터 지속성

## 클라우드 인프라 프로비저닝

### Terraform을 사용한 인프라 구성

클라우드 인프라는 Terraform을 사용하여 프로비저닝됩니다:

```bash
# 초기화
cd terraform/environments/prod
terraform init

# 계획 확인
terraform plan

# 인프라 적용
terraform apply
```

### 지원되는 클라우드 제공업체

- **AWS**: Amazon Web Services
- **Azure**: Microsoft Azure

## CI/CD 파이프라인

CI/CD 파이프라인은 GitHub Actions를 사용하여 구현되어 있습니다:

```yaml
# .github/workflows/main.yml 예시
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      # 빌드 단계
  
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      # 테스트 단계
  
  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      # 배포 단계
```

## 모니터링 및 로깅

### 모니터링 스택

- **Prometheus**: 메트릭 수집
- **Grafana**: 메트릭 시각화
- **Alertmanager**: 알림 관리

### 로깅 스택

- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Fluentd**: 로그 수집기

## 보안 및 규정 준수

### 보안 모범 사례

- 모든 통신은 TLS/SSL을 통해 암호화
- 비밀 정보는 Kubernetes Secrets 또는 AWS/Azure Key Vault에 저장
- 네트워크 정책을 통한 서비스 간 통신 제한
- 컨테이너 이미지 취약점 스캔

### 규정 준수

- GDPR
- SOC2
- ISMS

## 재해 복구 및 백업

### 백업 전략

- 데이터베이스 일일 백업
- 백업 데이터 암호화
- 다중 지역 백업 저장

### 재해 복구

- RTO(복구 시간 목표): 4시간
- RPO(복구 지점 목표): 1시간
- 다중 가용 영역 배포

## 문제 해결

일반적인 인프라 문제 해결 방법은 [문제 해결 가이드](../docs/troubleshooting.md)를 참조하세요.

## 기여 가이드

인프라 구성에 기여하려면 [개발 가이드](../docs/development-guide.md)를 참조하세요.
