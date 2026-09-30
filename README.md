# deploy-seminar-server

배포 세미나 방명록 API 서버

**배포 URL**: https://deploy-seminar-server.onrender.com

## 시작하기

```bash
git clone https://github.com/suhyun113/deploy-seminar-server.git
cd deploy-seminar-server
npm install
```

## 실행

```bash
# 개발 (코드 저장 시 자동 재시작)
npm run dev

# 프로덕션
npm start
```

## API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /health | 서버 상태 확인 |
| GET | /api/posts | 방명록 목록 (최신순) |
| POST | /api/posts | 방명록 글 작성 |

### POST /api/posts

**Request Body**

```json
{
  "name": "이름",
  "type": "deploy",
  "commit": "커밋해시",
  "message": "한마디 (선택)"
}
```

- `type`: `deploy` (배포 성공 글) 또는 `message` (일반 글)
- `name`: 최대 20자
- `message`: 최대 50자
- `type`이 `deploy`면 `message` 생략 시 자동 생성
- 같은 이름 + 같은 커밋으로 중복 작성 불가
- 같은 IP는 3초에 한 번만 작성 가능

## 참고

- 무료 플랜 사용 중으로 15분 이상 요청이 없으면 서버가 슬립 상태가 됩니다.
