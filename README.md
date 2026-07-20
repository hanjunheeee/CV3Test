# 씨브이쓰리 기술과제

프론트엔드 : React + Zustand  
백엔드 : Express + Sequelize 
데이터베이스 : MySQL

## 폴더 구조

```
├── client/     # React 프론트엔드
└── server/     # Express 백엔드 + 크롤러
```

## 사전 준비

- Node.js 18+
- MySQL 8.x (Windows: MySQL80 서비스)

## 설치 및 실행

> **PowerShell**을 열고, `package.json`이 있는 **프로젝트 최상위 폴더**에서 아래 명령어를 순서대로 실행하세요.

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`server/.env`에서 DB_PASSWORD 작성(실행 단순화를 위해 .env파일을 일부러 gitignore에서 제외 시켰습니다):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cv3_homeshopping_db
DB_USER=root
DB_PASSWORD="your_password"
PORT=5000
```

### 3. MySQL 서버 실행 (Windows)

```powershell
Start-Service MySQL80
```

### 4. 개발 서버 실행

```bash
npm run dev
```

`npm run dev` 실행 시 자동으로:

1. `cv3_homeshopping_db` 데이터베이스 스키마 생성 (없을 경우)
2. `homeshopping_rankings` 테이블 생성 (`sequelize.sync()`)
3. 백엔드 + 프론트 동시 실행

| 서비스 | URL |
|--------|-----|
| 프론트 | http://localhost:5173 |
| 백엔드 | http://localhost:5000 |
| 헬스체크 | http://localhost:5000/api/health |

## 크롤링

```bash
npm run crawl
```

DB가 없으면 자동 생성 후 크롤링을 실행합니다.

## 개별 실행

```bash
npm run dev:server
npm run dev:client
npm run create-db -w server
```

## 트러블슈팅

| 증상 | 확인 |
|------|------|
| `Access denied for user 'root'` | `server/.env` 비밀번호 확인, `#` 포함 시 따옴표 사용 |
| `Unknown database` | `npm run dev` 재실행 (create-db 자동 실행) |
| `Can't connect to MySQL server` | MySQL80 서비스 실행 여부 확인 |
| 3306 포트 충돌 | Docker MySQL과 Windows MySQL 동시 사용 불가 |
