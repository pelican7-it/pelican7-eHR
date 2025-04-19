import winston from 'winston';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// 로그 레벨 정의
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 로그 색상 정의
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// 현재 환경 확인
const environment = process.env.NODE_ENV || 'development';

// 로그 레벨 결정 (개발 환경에서는 debug, 프로덕션 환경에서는 warn)
const level = environment === 'production' ? 'warn' : 'debug';

// 로그 포맷 설정
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// 트랜스포트 설정 (콘솔 및 파일)
const transports = [
  // 항상 콘솔에 로그 출력
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
  }),
];

// 프로덕션 환경에서는 파일에도 로그 저장
if (environment === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

// Winston 로거 생성
const logger = winston.createLogger({
  level,
  levels: logLevels,
  format,
  transports,
});

// HTTP 요청 로깅을 위한 스트림
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export { logger, stream };
