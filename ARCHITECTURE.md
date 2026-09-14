# ClassCare - 아키텍처 문서

## 📋 프로젝트 개요

**ClassCare**는 학원/교육 센터를 위한 AI 기반 수업 관리 시스템입니다.
- 학생의 수업 스케줄 관리 (월간/주간 캘린더)
- 오디오 기반 STT 분석 및 발음 피드백 (단어별 점수, 발음 기호, 학습 리포트)
- Google Translate TTS 프록시를 통한 단어 발음 재생
- 관리자용 CRUD 인터페이스 (학생, 선생님, 강의실, 과목, 스케줄)

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
│  │   │  /student/*     │  │  AudioScript    │                  │ │
│  │   │  /admin/*       │  │  Player         │                  │ │
│  │   │  /class/*       │  │  WordPractice   │                  │ │
│  │   │                 │  │  Dialog         │                  │ │
│  │   │                 │  │  Admin/*        │                  │ │
│  │   │                 │  │  LoginForm      │                  │ │
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
│  │                        │                                     │ │
│  │   ┌────────────────────┴─────────────────┐                  │ │
│  │   │   Next.js API Routes (Route Handler)  │                  │ │
│  │   │   /api/tts → Google Translate TTS     │                  │ │
│  │   └──────────────────────────────────────┘                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                            │ REST API (HTTP/JSON) — 현재 Mock
┌──────────────────────────────────────────────────────────────────┐
│                    SERVER (Backend) — 미구현                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          FastAPI (Python) - Port 8000   [계획]               │ │
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
│                      DATA LAYER [계획]                            │
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

> **현재 상태:** 프론트엔드는 **Mock 데이터 + 정적 STT 데이터**로 동작하며, 백엔드(FastAPI)는 **디렉터리 구조만 존재**하고 소스 코드는 미구현 상태입니다.

---

## 📁 프로젝트 구조

```
ClassCare/
├── ARCHITECTURE.md              # 아키텍처 문서 (본 파일)
├── .gitignore                   # node_modules, .next, .env 등 제외
├── package-lock.json            # 루트 (의존성 없음)
├── scripts/                     # 스크립트 (비어 있음)
│
├── backend/                     # FastAPI 백엔드 [계획 — 코드 미구현]
│   └── app/
│       ├── api/                 # API 라우트 (빈 디렉터리)
│       ├── core/                # 설정, 보안 (빈 디렉터리)
│       ├── models/              # SQLAlchemy 모델 (빈 디렉터리)
│       ├── schemas/             # Pydantic 스키마 (빈 디렉터리)
│       └── services/            # 비즈니스 로직 (빈 디렉터리)
│
└── frontend/                    # Next.js 프론트엔드 [구현 완료]
    ├── package.json             # 의존성 정의
    ├── next.config.js           # Next.js 설정
    ├── tsconfig.json            # TypeScript 설정 (@/* → ./src/*)
    ├── tailwind.config.ts       # Tailwind CSS + animate 플러그인
    ├── postcss.config.js        # PostCSS 설정
    │
    ├── public/
    │   ├── images/              # 로고 이미지 (ev-system-logo.png 등)
    │   └── assets/audio/        # 오디오 파일 (.m4a)
    │       ├── Speaking_class_simple.m4a
    │       ├── Speaking_class_simple_backup.m4a
    │       └── Speaking_class_condensed.m4a
    │
    └── src/
        ├── app/                 # Pages (App Router)
        │   ├── layout.tsx       # 루트 레이아웃 (Inter 폰트, ReactQueryProvider)
        │   ├── globals.css      # 글로벌 CSS (CSS 변수, shadcn 스타일)
        │   ├── page.tsx         # 로그인 (/)
        │   ├── api/
        │   │   └── tts/
        │   │       └── route.ts # TTS 프록시 API (Google Translate TTS)
        │   ├── admin/
        │   │   └── dashboard/
        │   │       └── page.tsx # 관리자 대시보드
        │   ├── student/
        │   │   └── dashboard/
        │   │       └── page.tsx # 학생 대시보드 (캘린더)
        │   └── class/
        │       └── [classId]/
        │           └── page.tsx # 수업 상세 (오디오+STT)
        │
        ├── components/          # UI 컴포넌트
        │   ├── LoginForm.tsx            # 로그인 폼
        │   ├── CalendarWidget.tsx       # 월간/주간 캘린더
        │   ├── AudioScriptPlayer.tsx    # 오디오 플레이어 + STT 스크립트 + 학습 리포트
        │   ├── WordPracticeDialog.tsx   # 단어 발음 연습 다이얼로그
        │   └── admin/                   # 관리자 전용 컴포넌트
        │       ├── AdminSchedules.tsx   # 강의실 기준 시간표 그리드
        │       ├── AdminStudents.tsx    # 학생 CRUD + 스케줄 등록
        │       ├── AdminTeachers.tsx    # 선생님 관리 (복수 과목)
        │       ├── AdminClassrooms.tsx  # 강의실 관리 (상태 토글)
        │       ├── AdminSubjects.tsx    # 과목 관리
        │       └── AdminUsers.tsx       # 사용자 관리 (미사용)
        │
        ├── hooks/               # 커스텀 훅 (Headless 로직)
        │   ├── domain/          # 도메인 로직
        │   │   └── useAuth.ts   # 인증 (useMutation, localStorage)
        │   └── ui/              # UI 로직
        │       ├── useCalendar.ts    # 캘린더 상태 (월/주 뷰, 탐색)
        │       └── useAudioPlayer.ts # 오디오 재생 (재생/일시정지/탐색/배속)
        │
        ├── services/            # API 서비스 레이어
        │   └── api.ts           # Axios 인스턴스 + authService (Mock) + assignmentService
        │
        └── lib/                 # 유틸리티 & 데이터
            ├── utils.ts                 # cn() 유틸 (clsx + tailwind-merge)
            ├── dateUtils.ts             # 날짜 헬퍼 (CalendarEvent 타입 정의 포함)
            ├── react-query-provider.tsx  # TanStack Query Provider
            ├── mockData.ts              # Mock 데이터 (선생님, 학생, 강의실, 과목, 스케줄)
            ├── sttData.ts               # STT 분석 정적 데이터 (전체 버전, ~1979줄)
            └── sttDataCondensed.ts      # STT 분석 정적 데이터 (축약 버전)
```

---

## 🔄 현재 데이터 흐름

현재 백엔드가 미구현이므로, **모든 데이터는 프론트엔드 내 Mock/정적 데이터**로 동작합니다.

```
┌──────────────────────────────────────────────────────────────┐
│                        데이터 흐름 (현재)                      │
│                                                              │
│  LoginForm ──→ useAuth ──→ authService.login()               │
│                              │ (Mock: 500ms 딜레이 후 토큰 반환)│
│                              ▼                               │
│                         localStorage                         │
│                         ├─ token: "mock_token_xxx"            │
│                         └─ user: { username, role, ... }      │
│                              │                               │
│              ┌───────────────┼───────────────┐               │
│              ▼               ▼               ▼               │
│         role=admin     role=student     classId param         │
│              │               │               │               │
│     AdminDashboard    StudentDashboard  ClassDetailPage       │
│     (Mock CRUD)       (MOCK_EVENTS)    (STT_ANALYSIS)        │
│                              │               │               │
│                       CalendarWidget   AudioScriptPlayer      │
│                       (mockData.ts)    (sttData.ts)           │
│                                              │               │
│                                        WordPracticeDialog     │
│                                        (MediaRecorder → Mock) │
│                                              │               │
│                                        /api/tts (Route)      │
│                                        → Google Translate TTS │
└──────────────────────────────────────────────────────────────┘
```

### 인증 흐름 (Mock)
1. `LoginForm` → `useAuth` (TanStack Query `useMutation`)
2. `authService.login()` — 500ms 딜레이 후 Mock 토큰 반환
3. `localStorage`에 `token`, `user` 저장
4. 역할 기반 리다이렉션: `admin` → `/admin/dashboard`, `student` → `/student/dashboard`

### 테스트 계정
| 역할 | Username | Password | 비고 |
|-----|----------|----------|------|
| 관리자 | `admin` | 아무거나 | `/admin/dashboard`로 이동 |
| 학생 | `student` | 아무거나 | STT 전체 버전 사용 |
| 학생 | `student1` | 아무거나 | STT 축약 버전 사용 |

---

## 🎯 Headless 아키텍처 (React Native 확장 대비)

### 설계 원칙

비즈니스 로직과 UI를 분리하여, 향후 React Native 앱에서 동일한 훅과 서비스를 재사용할 수 있도록 설계합니다.

```
┌─────────────────────────────────────────────────────────────┐
│                     비즈니스 로직 레이어                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Custom Hooks (hooks/domain, hooks/ui)              │   │
│   │  - useAuth: 인증 로직 (로그인, 역할 리다이렉션)      │   │
│   │  - useCalendar: 캘린더 상태 (뷰 모드, 날짜 탐색)    │   │
│   │  - useAudioPlayer: 오디오 제어 (재생/탐색/배속)      │   │
│   └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Services (services/api.ts)                         │   │
│   │  - authService: 로그인 (현재 Mock)                   │   │
│   │  - assignmentService: 과제 API (백엔드 연동 예정)    │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
    ┌───────────┐    ┌───────────┐    ┌───────────┐
    │  Next.js  │    │   React   │    │   React   │
    │   (Web)   │    │  Native   │    │  Native   │
    │  [현재]    │    │  (iOS)    │    │ (Android) │
    └───────────┘    └───────────┘    └───────────┘
                      [향후 예정]      [향후 예정]
```

---

## 📱 화면 구성

### 1. 로그인 (`/`)
- Mock 인증 (실제 API 호출 주석 처리됨)
- 역할별 리다이렉션 (`admin` → `/admin/dashboard`, `student` → `/student/dashboard`)
- EV Academy 로고 + 로그인 폼

### 2. 학생 대시보드 (`/student/dashboard`)
- EV Academy 로고 헤더 + 유저 아바타
- 월간/주간 캘린더 뷰 (`CalendarWidget`)
- 수업 일정 표시 (과목명, 시간, 교실, 선생님)
- 상태 표시: `completed` / `absent` / `upcoming`
- 수업 클릭 시 `/class/[classId]`로 이동

### 3. 수업 상세 (`/class/[classId]`)

#### Script 탭
- 오디오 플레이어 (재생/일시정지, 배속 조절: 0.5x~2.0x)
- STT 스크립트 (Teacher/Student 발화 구분)
- 단어별 발음 상태 색상 표시: `normal` / `slight` / `severe`
- 재생 위치에 따른 단어 자동 하이라이트 + 스크롤
- 단어 클릭 시 상세 패널 (발음 기호 US/UK, 점수, 피드백)
- TTS 발음 재생 (`/api/tts` Route Handler → Google Translate)
- 발음 연습 다이얼로그 (`WordPracticeDialog`)
  - `MediaRecorder`로 음성 녹음
  - 현재 Mock 점수 반환 (Transformers.js 연동 예정)

#### Report 탭
- 전체 발음 점수 (Overall Score)
- 영역별 학습 리포트 (Fluency, Pronunciation, Vocabulary, Grammar, Comprehension)
- Skill-Up 추천사항 (원문 → 개선안, 이유, 포커스 스킬)

### 4. 관리자 대시보드 (`/admin/dashboard`)

| 탭 | 컴포넌트 | 기능 |
|---|---|---|
| Schedules | `AdminSchedules` | 강의실 기준 시간표 (교시별 그리드), 날짜 선택 |
| Students | `AdminStudents` | 학생 CRUD, 스케줄 등록, 상태 관리 |
| Teachers | `AdminTeachers` | 선생님 목록, 복수 과목 지원, 상태 관리 |
| Subjects | `AdminSubjects` | 과목 CRUD (이름, 코드, 색상) |
| Rooms | `AdminClassrooms` | 강의실 관리 (active/maintenance 상태 토글) |

---

## 🗃️ 데이터 모델

### 현재: TypeScript 타입 + Mock 데이터 (`mockData.ts`, `dateUtils.ts`)

```typescript
// CalendarEvent (dateUtils.ts)
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;  // "14:00"
  endTime?: string;    // "15:00"
  type: 'class' | 'assignment' | 'exam';
  status: 'pending' | 'completed' | 'absent' | 'upcoming';
  classroom?: string;
  teacher?: string;
}

// STT 분석 데이터 (sttData.ts)
interface STTAnalysis {
  lesson_metadata: {
    lesson_id: string;
    classroom: string;
    teacher: string;
    student: string;
    topic: string;
    audio_url: string;
    overall_pronunciation_score: number;
    date: string;
  };
  transcript: STTSegment[];
  learning_report: Record<string, SkillScore>;
  skill_up_recommendations: SkillUpRecommendation[];
}

interface STTWord {
  text: string;
  start: number;      // ms
  end: number;        // ms
  status: "normal" | "slight" | "severe";
  score?: number;
  feedback?: string;
  dictionary_phonetic?: { us: string; uk: string };
  user_phonetic?: string;
  error_indices?: number[];
}
```

### 향후: ERD (PostgreSQL 연동 시)

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

### Multi-Tenant 설계

모든 데이터에 `academy_id` + `center_id` 필터를 적용하여 멀티테넌트를 지원합니다.

```python
# 향후 백엔드 구현 시
def get_students(db: Session, academy_id: str, center_id: str):
    return db.query(User).filter(
        User.academy_id == academy_id,
        User.center_id == center_id,
        User.role == "student"
    ).all()
```

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
| SENTENCE | 18:50-20:00 | 문장 학습 |
| SELF-STUDY | 20:00-22:00 | 자습 |

---

## 🔊 TTS 프록시 (`/api/tts`)

`AudioScriptPlayer`에서 단어 발음 재생 시 사용하는 Next.js Route Handler입니다.

```
브라우저 → GET /api/tts?tl=en-us&q=hello
         → Next.js 서버
         → Google Translate TTS (비공식 엔드포인트)
         → audio/mpeg 스트림 반환 (Cache-Control: 1일)
```

---

## 🔐 GCS 연동 (Google Cloud Storage) [계획]

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

### 상태 판별
- `.opus` 파일의 GCS 커스텀 메타데이터 `analyzed` 값으로 분석 완료 여부 확인

> 현재는 `public/assets/audio/` 디렉터리의 `.m4a` 파일을 직접 사용합니다.

---

## 🛠️ 기술 스택

### Frontend (구현 완료)
| 기술 | 버전 | 용도 |
|-----|------|------|
| Next.js | 14.0.0 | App Router, SSR, API Routes |
| React | ^18 | UI 라이브러리 |
| TypeScript | ^5 | 타입 안전성 |
| Tailwind CSS | ^3.3 | 스타일링 |
| tailwindcss-animate | ^1.0.7 | 애니메이션 유틸 |
| TanStack Query | ^5.0 | 서버 상태 관리 (인증) |
| Axios | ^1.6 | HTTP 클라이언트 |
| Lucide React | ^0.292 | 아이콘 |
| @radix-ui/react-slot | ^1.0.2 | 컴포넌트 프리미티브 |
| @radix-ui/react-accordion | ^1.0.1 | 아코디언 UI |
| class-variance-authority | ^0.7.0 | 컴포넌트 변형 관리 |
| clsx + tailwind-merge | ^2.0 | 클래스명 병합 유틸 |

### Backend (계획 — 미구현)
| 기술 | 버전 | 용도 |
|-----|------|------|
| FastAPI | 0.100+ | REST API |
| SQLAlchemy | 2.x | ORM |
| Pydantic | 2.x | 데이터 검증 |
| PostgreSQL | 15+ | 데이터베이스 |
| Google Cloud Storage | - | 파일 저장소 |

### AI/ML (계획 — 미구현)
| 기술 | 용도 |
|-----|------|
| Transformers.js | 클라이언트 사이드 발음 분석 |
| Whisper | STT (음성→텍스트) |

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

### 수업 이벤트 상태 (CalendarEvent.status)
| 값 | 설명 |
|---|---|
| `upcoming` | 예정 |
| `completed` | 완료 |
| `absent` | 결석 |
| `pending` | 대기 |

### STT 단어 상태 (STTWord.status)
| 값 | 설명 | 색상 |
|---|---|---|
| `normal` | 정상 발음 | 기본 |
| `slight` | 경미한 오류 | 노란색 |
| `severe` | 심각한 오류 | 빨간색 |

---

## 🚀 개발 현황

### ✅ 완료
- [x] 프론트엔드 기본 구조 설정 (Next.js 14, App Router)
- [x] 로그인 화면 및 Mock 인증 (역할별 리다이렉션)
- [x] 학생 캘린더 (월간/주간 뷰, 날짜 탐색)
- [x] 수업 상세 화면 — Script 탭 (오디오 플레이어, STT 스크립트)
- [x] 수업 상세 화면 — Report 탭 (학습 리포트, Skill-Up 추천)
- [x] 단어별 발음 상태 시각화 (normal/slight/severe)
- [x] 단어 클릭 상세 패널 (발음 기호 US/UK, 점수, 피드백)
- [x] TTS 단어 발음 재생 (/api/tts → Google Translate)
- [x] 발음 연습 다이얼로그 (MediaRecorder 녹음, Mock 점수)
- [x] 관리자 대시보드 탭 구조 (5개 탭)
- [x] 학생 관리 (목록, 추가, 수정, 스케줄 등록)
- [x] 선생님 관리 (복수 과목 지원, 상태 관리)
- [x] 강의실 관리 (active/maintenance 상태)
- [x] 과목 관리 (이름, 코드, 색상)
- [x] 스케줄 뷰 (강의실 기준 교시별 시간표 그리드)
- [x] STT 정적 데이터 2종 (전체/축약 버전)
- [x] 오디오 파일 3종 (.m4a)
- [x] Headless 아키텍처 (hooks/services 분리)

### 🔄 진행 중
- [ ] 백엔드 API 개발 (FastAPI)

### 📋 예정
- [ ] 실제 DB 연동 (PostgreSQL + SQLAlchemy)
- [ ] JWT 인증 구현 (백엔드)
- [ ] GCS 연동 (오디오 업로드/Signed URL)
- [ ] STT 서비스 연동 (Whisper)
- [ ] Transformers.js 발음 분석 통합
- [ ] Mock 데이터 → 실제 API 전환
- [ ] Docker / 배포 설정
- [ ] React Native 앱 개발

---

## 🏃 실행 방법

```bash
# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:3000

# Backend (미구현 — 향후)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000
```

### 환경 변수

| 변수 | 기본값 | 설명 |
|-----|-------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | 백엔드 API URL |

---

## 📝 라이선스

Private - ClassCare Internal Use Only
