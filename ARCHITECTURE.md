# ClassCare - 아키텍처 문서

## 📋 프로젝트 개요

**ClassCare**는 학원/교육 센터를 위한 AI 기반 수업 관리 시스템입니다.
- 학생의 수업 스케줄 관리
- 오디오 기반 STT 분석 및 발음 피드백
- 관리자용 CRUD 인터페이스

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │   Next.js 14 (App Router) + React 18 + TypeScript           │ │
│  │   ┌─────────────────┐  ┌─────────────────┐                  │ │
│  │   │   Pages (UI)    │  │   Components    │                  │ │
│  │   │  /login         │  │  CalendarWidget │                  │ │
│  │   │  /student/*     │  │  AudioPlayer    │                  │ │
│  │   │  /admin/*       │  │  Admin/*        │                  │ │
│  │   │  /class/*       │  │  LoginForm      │                  │ │
│  │   └────────┬────────┘  └────────┬────────┘                  │ │
│  │            │                    │                            │ │
│  │   ┌────────┴────────────────────┴────────┐                  │ │
│  │   │         Custom Hooks (Logic)          │                  │ │
│  │   │  ┌──────────────┐  ┌──────────────┐  │                  │ │
│  │   │  │  UI Hooks    │  │ Domain Hooks │  │                  │ │
│  │   │  │ useCalendar  │  │   useAuth    │  │                  │ │
│  │   │  │ useAudioPlay │  │              │  │                  │ │
│  │   │  └──────────────┘  └──────────────┘  │                  │ │
│  │   └────────────────────┬─────────────────┘                  │ │
│  │                        │                                     │ │
│  │   ┌────────────────────┴─────────────────┐                  │ │
│  │   │       Services (API Layer)            │                  │ │
│  │   │  Axios + TanStack Query               │                  │ │
│  │   └────────────────────┬─────────────────┘                  │ │
│  └────────────────────────┼─────────────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────────┘
                            │ REST API (HTTP/JSON)
┌───────────────────────────┼─────────────────────────────────────┐
│                           ▼                                      │
│                    SERVER (Backend)                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          FastAPI (Python) - Port 8000                       │ │
│  │   ┌─────────────────┐  ┌─────────────────┐                  │ │
│  │   │    API Routes   │  │    Services     │                  │ │
│  │   │  /auth/login    │  │  GCS Service    │                  │ │
│  │   │  /users         │  │  Audio Service  │                  │ │
│  │   │  /schedules     │  │  STT Service    │                  │ │
│  │   │  /assignments   │  │                 │                  │ │
│  │   └────────┬────────┘  └────────┬────────┘                  │ │
│  │            │                    │                            │ │
│  │   ┌────────┴────────────────────┴────────┐                  │ │
│  │   │     SQLAlchemy ORM + Pydantic        │                  │ │
│  │   └────────────────────┬─────────────────┘                  │ │
│  └────────────────────────┼─────────────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                           ▼                                      │
│                      DATA LAYER                                  │
│   ┌─────────────────┐          ┌─────────────────┐              │
│   │   PostgreSQL    │          │  Google Cloud   │              │
│   │   (Database)    │          │    Storage      │              │
│   │  ┌───────────┐  │          │  ┌───────────┐  │              │
│   │  │  Users    │  │          │  │ .opus     │  │              │
│   │  │  Schedules│  │          │  │ .opus.json│  │              │
│   │  │  Rooms    │  │          │  └───────────┘  │              │
│   │  │Assignments│  │          │                 │              │
│   │  └───────────┘  │          │ {academy_id}/   │              │
│   └─────────────────┘          │ {center_id}/    │              │
│                                │ {yyyymmdd}/     │              │
│                                │ {class_id}/     │              │
│                                └─────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 프로젝트 구조

```
ClassCare/
├── backend/                      # FastAPI 백엔드 (Python)
│   └── app/
│       ├── api/                  # API 라우트
│       ├── core/                 # 설정, 보안
│       ├── models/               # SQLAlchemy 모델
│       ├── schemas/              # Pydantic 스키마
│       └── services/             # 비즈니스 로직
│
└── frontend/                     # Next.js 프론트엔드
    └── src/
        ├── app/                  # Pages (App Router)
        │   ├── page.tsx          # 로그인 (/)
        │   ├── admin/
        │   │   └── dashboard/    # 관리자 대시보드
        │   ├── student/
        │   │   └── dashboard/    # 학생 대시보드
        │   └── class/
        │       └── [classId]/    # 수업 상세
        │
        ├── components/           # UI 컴포넌트
        │   ├── admin/            # 관리자 전용 컴포넌트
        │   │   ├── AdminStudents.tsx
        │   │   ├── AdminTeachers.tsx
        │   │   ├── AdminClassrooms.tsx
        │   │   ├── AdminSubjects.tsx
        │   │   └── AdminSchedules.tsx
        │   ├── CalendarWidget.tsx
        │   ├── AudioScriptPlayer.tsx
        │   ├── WordPracticeDialog.tsx
        │   └── LoginForm.tsx
        │
        ├── hooks/                # 커스텀 훅 (Headless 로직)
        │   ├── domain/           # 도메인 로직
        │   │   └── useAuth.ts
        │   └── ui/               # UI 로직
        │       ├── useCalendar.ts
        │       └── useAudioPlayer.ts
        │
        ├── services/             # API 서비스 레이어
        │   └── api.ts
        │
        └── lib/                  # 유틸리티
            ├── mockData.ts       # 목 데이터
            ├── dateUtils.ts      # 날짜 유틸
            ├── utils.ts          # 공통 유틸
            └── react-query-provider.tsx
```

---

## 🎯 Headless 아키텍처 (React Native 확장 대비)

### 설계 원칙

```
┌─────────────────────────────────────────────────────────────┐
│                     비즈니스 로직 레이어                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Custom Hooks (hooks/domain, hooks/ui)              │   │
│   │  - useAuth: 인증 로직                                │   │
│   │  - useCalendar: 캘린더 상태 관리                     │   │
│   │  - useAudioPlayer: 오디오 재생 제어                  │   │
│   └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Services (services/api.ts)                         │   │
│   │  - authService: 로그인/로그아웃                      │   │
│   │  - assignmentService: 과제 API                       │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
    ┌───────────┐    ┌───────────┐    ┌───────────┐
    │  Next.js  │    │   React   │    │   React   │
    │   (Web)   │    │  Native   │    │  Native   │
    │           │    │  (iOS)    │    │ (Android) │
    └───────────┘    └───────────┘    └───────────┘
```

### 로직/UI 분리 예시

```typescript
// hooks/ui/useCalendar.ts - 순수 로직 (재사용 가능)
export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  
  const next = () => { /* ... */ };
  const prev = () => { /* ... */ };
  
  return { currentDate, view, next, prev, setView };
};

// components/CalendarWidget.tsx - UI만 담당
const CalendarWidget = () => {
  const { currentDate, view, next, prev } = useCalendar();
  
  return (
    <div>
      {/* UI 렌더링 */}
    </div>
  );
};
```

---

## 🗃️ 데이터베이스 스키마 (Multi-Tenant)

### ERD

```
┌─────────────────┐     ┌─────────────────┐
│     Users       │     │   Classrooms    │
├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │
│ academy_id  ◄───┼─────┼─► academy_id    │
│ center_id   ◄───┼─────┼─► center_id     │
│ name            │     │ name            │
│ email           │     │ floor           │
│ role            │     │ status          │
│ status          │     └─────────────────┘
└────────┬────────┘              │
         │                       │
         │     ┌─────────────────┘
         │     │
┌────────┴─────┴──┐     ┌─────────────────┐
│   Schedules     │     │   Assignments   │
├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │
│ academy_id      │     │ schedule_id ────┼──┐
│ center_id       │     │ student_id      │  │
│ student_id  ────┤     │ analysis_json   │  │
│ teacher_id  ────┤     │ score           │  │
│ classroom_id ───┤     │ created_at      │  │
│ subject         │     └─────────────────┘  │
│ period          │                          │
│ gcs_path        │◄─────────────────────────┘
└─────────────────┘
```

### Multi-Tenant 필터링

```python
# 모든 쿼리에 academy_id, center_id 필터 적용
def get_students(db: Session, academy_id: str, center_id: str):
    return db.query(User).filter(
        User.academy_id == academy_id,
        User.center_id == center_id,
        User.role == "student"
    ).all()
```

---

## 📱 화면 구성

### 1. 로그인 (/)
- JWT 인증
- 역할별 리다이렉션 (admin → /admin/dashboard, student → /student/dashboard)

### 2. 학생 대시보드 (/student/dashboard)
- 월간/주간 캘린더 뷰
- 수업 일정 및 분석 상태 표시
- 수업 클릭 시 상세 화면으로 이동

### 3. 수업 상세 (/class/[classId])
- 오디오 플레이어 (배속 조절)
- STT 스크립트 (자동 하이라이트/스크롤)
- 단어 클릭 팝업 (발음 기호, 점수)
- 발음 연습 다이얼로그 (Transformers.js 연동 예정)

### 4. 관리자 대시보드 (/admin/dashboard)

| 탭 | 기능 |
|---|---|
| Schedules | 강의실 기준 시간표 (교시별 그리드) |
| Students | 학생 목록, 추가, 수정, 스케줄 등록 |
| Teachers | 선생님 목록 (복수 과목 지원) |
| Rooms | 강의실 관리 (사용가능/수리중) |
| Subjects | 과목 관리 |

---

## ⏰ 수업 스케줄 체계

### 교시 시간표 (45분 수업)

| 교시 | 시간 | 비고 |
|-----|------|------|
| 1st | 08:00-08:45 | |
| 2nd | 08:50-09:35 | |
| 3rd | 09:40-10:25 | |
| 4th | 10:30-11:15 | |
| 5th | 11:20-12:05 | |
| LUNCH | 12:05-13:05 | 점심 |
| 6th | 13:05-13:50 | |
| 7th | 13:55-14:40 | |
| 8th | 14:45-15:30 | |
| 9th | 15:35-16:20 | |
| 10th | 16:25-17:10 | |
| 11th | 17:15-18:00 | |
| DINNER | 18:00-18:50 | 저녁 |
| SELF-STUDY | 20:00-22:00 | 자습 |

---

## 🔐 GCS 연동 (Google Cloud Storage)

### 경로 구조
```
gs://classcare-bucket/
└── {academy_id}/
    └── {center_id}/
        └── {yyyymmdd}/
            └── {class_id}/
                ├── {filename}.opus      # 오디오 파일
                └── {filename}.opus.json # STT 분석 결과
```

### Signed URL 발급 (보안)
```python
# backend/app/services/gcs_service.py
def generate_signed_url(bucket_name: str, blob_name: str) -> str:
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(hours=1),
        method="GET"
    )
    return url
```

### 상태 판별
- `.opus` 파일의 GCS 커스텀 메타데이터 `analyzed` 값으로 분석 완료 여부 확인

---

## 🛠️ 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|-----|------|------|
| Next.js | 14.0 | App Router, SSR |
| React | 18.x | UI 라이브러리 |
| TypeScript | 5.x | 타입 안전성 |
| Tailwind CSS | 3.x | 스타일링 |
| TanStack Query | 5.x | 서버 상태 관리 |
| Axios | 1.x | HTTP 클라이언트 |
| Lucide React | - | 아이콘 |

### Backend (계획)
| 기술 | 버전 | 용도 |
|-----|------|------|
| FastAPI | 0.100+ | REST API |
| SQLAlchemy | 2.x | ORM |
| Pydantic | 2.x | 데이터 검증 |
| PostgreSQL | 15+ | 데이터베이스 |
| Google Cloud Storage | - | 파일 저장소 |

### AI/ML (계획)
| 기술 | 용도 |
|-----|------|
| Transformers.js | 클라이언트 사이드 발음 분석 |
| Whisper | STT (음성→텍스트) |

---

## 🚀 개발 현황

### ✅ 완료
- [x] 프론트엔드 기본 구조 설정 (Next.js 14)
- [x] 로그인 화면 및 Mock 인증
- [x] 학생 캘린더 (월간/주간 뷰)
- [x] 수업 상세 화면 (오디오 플레이어, STT 스크립트)
- [x] 단어 팝업 (발음 기호, 점수, 연습 버튼)
- [x] 관리자 대시보드 탭 구조
- [x] 학생 관리 (목록, 추가, 수정, 스케줄 등록)
- [x] 선생님 관리 (복수 과목 지원)
- [x] 강의실 관리 (사용가능/수리중 상태)
- [x] 과목 관리
- [x] 스케줄 뷰 (강의실 기준 시간표)

### 🔄 진행 중
- [ ] 백엔드 API 개발
- [ ] GCS 연동 구현
- [ ] Transformers.js 발음 분석 통합

### 📋 예정
- [ ] 실제 DB 연동 (PostgreSQL)
- [ ] JWT 인증 구현
- [ ] 파일 업로드 스케줄 파싱
- [ ] React Native 앱 개발

---

## 📄 상태 정의

### 학생 상태 (StudentStatus)
| 값 | 설명 |
|---|---|
| `studying` | 공부 중 |
| `graduated` | 졸업 |

### 선생님 상태 (TeacherStatus)
| 값 | 설명 |
|---|---|
| `working` | 정상 근무 |
| `vacation` | 휴가 중 |
| `training` | 교육 중 |
| `resigned` | 퇴사 |

### 강의실 상태 (RoomStatus)
| 값 | 설명 |
|---|---|
| `active` | 사용 가능 |
| `maintenance` | 수리/점검 중 |

---

## 🏃 실행 방법

```bash
# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:3000

# Backend (추후)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000
```

### 테스트 계정
| 역할 | Username | Password |
|-----|----------|----------|
| 관리자 | admin | (아무거나) |
| 학생 | student | (아무거나) |

---

## 📝 라이선스

Private - ClassCare Internal Use Only



