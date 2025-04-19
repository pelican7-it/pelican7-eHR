import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// 환경 변수 로드
dotenv.config();

// 라우트 임포트
import authRoutes from './api/routes/auth.routes';
import employeeRoutes from './api/routes/employee.routes';
import departmentRoutes from './api/routes/department.routes';
import attendanceRoutes from './api/routes/attendance.routes';
import leaveRoutes from './api/routes/leave.routes';
import payrollRoutes from './api/routes/payroll.routes';
import performanceRoutes from './api/routes/performance.routes';

// 미들웨어 임포트
import { errorHandler } from './api/middlewares/error.middleware';
import { logger } from './utils/logger';

// Swagger 설정
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pelican7 e-HR API',
      version: '1.0.0',
      description: 'e-HR 시스템 API 문서',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: '개발 서버',
      },
    ],
  },
  apis: ['./src/api/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Express 앱 생성
const app = express();
const port = process.env.PORT || 5000;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(cors()); // CORS 설정
app.use(compression()); // 응답 압축
app.use(morgan('dev')); // 로깅
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩

// API 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/performance', performanceRoutes);

// Swagger 문서 라우트
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 루트 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Pelican7 e-HR API' });
});

// 없는 라우트에 대한 처리
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 서버 시작
let server: Server;

const startServer = (): Server => {
  server = app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
    logger.info(`Swagger docs available at http://localhost:${port}/api-docs`);
  });

  // 예상치 못한 에러 처리
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // 심각한 에러 발생시 서버 종료
    process.exit(1);
  });

  return server;
};

// 서버 종료 함수
const stopServer = async (): Promise<void> => {
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        logger.info('Server stopped');
        resolve();
      });
    });
  }
};

// 테스트를 위한 export
export { app, startServer, stopServer };

// 직접 실행시에만 서버 시작
if (require.main === module) {
  startServer();
}
