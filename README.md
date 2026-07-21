# CV3 기술과제

프론트엔드 : React + Zustand  
백엔드 : Express + Sequelize 
데이터베이스 : MySQL
크롤링 : axios + JSON

## 폴더 구조

```
├── client/     # React 프론트엔드
└── server/     # Express 백엔드 + 크롤러
```

## 사전 준비

- Node.js 18+
- MySQL 8.x (Windows: MySQL80 서비스)
- 라방바 데이터랩 로그인 상태 유지 필요(별도 APi가 없어서 서버 실행 할때마다 크롤링해서 데이터 가져오도록 설계했습니다..)

## 설치 및 실행

> **PowerShell**을 열고, `package.json`이 있는 **프로젝트 최상위 폴더**에서 아래 명령어를 순서대로 실행하세요.

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`server/.env`에서 MySQL 접속 정보 + 라방바 데이터랩 사이트 로그인 정보를 추가합니다.
(실행 단순화를 위해 .env파일을 일부러 gitignore에서 제외 시켰습니다) 

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cv3_homeshopping_db
DB_USER=root
DB_PASSWORD="your_password"
PORT=5000

CRAWL_LOGIN_EMAIL=your_email@example.com
CRAWL_LOGIN_PASSWORD="your_crawl_password"
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

1. `cv3_homeshopping_db` 데이터베이스 생성 (없을 경우)
2. 크롤링 실행 (`sign_in` → `list` API → DB 저장)
3. `homeshopping_rankings` 테이블 생성 (`sequelize.sync()`)
4. 백엔드 + 프론트 동시 실행

| 서비스 | URL |
|--------|-----|
| 프론트 | http://localhost:5173 |
| 백엔드 | http://localhost:5000 |

## 크롤링

`npm run dev` 실행 시 자동으로 크롤링됩니다. 크롤링만 따로 실행하려면:

```bash
npm run crawl
```

## 개별 실행(필요 시)

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
