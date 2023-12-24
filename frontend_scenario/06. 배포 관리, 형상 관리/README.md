# **Part 06. 서로 다른 목적조직간의 동기를 맞추는 배포/형상관리**

- [01. part overview](#01-part-overview)
- [02. 형상관리를 위한 GitHub / GitLab의 사용 목적과 방향성](#02-형상관리를-위한-github--gitlab의-사용-목적과-방향성)
- [03. 다수와의 협업을 위한 형상관리](#03-다수와의-협업을-위한-형상관리)
  - [1) rebase와 conflict 해결](#1-rebase와-conflict-해결)
  - [2) stash & revert](#2-stash--revert)
  - [3) 형상 관리 방법론](#3-형상-관리-방법론)
- [04. 상황으로 이해하는 배포 개념/목적](#04-상황으로-이해하는-배포-개념목적)
  - [1) 렌더링 방식과 배포 종류](#1-렌더링-방식과-배포-종류)
  - [2) Vercel 기반 배포 환경 구축](#2-vercel-기반-배포-환경-구축)
  - [3) CI/CD 파이프라인 구축](#3-cicd-파이프라인-구축)

# 01. part overview

- 협업을 위한 형상관리의 사용 방법 및 전략에 대한 이해
- 개발중인 제품의 호환성 검증을 위한 배포
- 지속가능한 제품 개발을 위한 CI / CD에 대한 이해

<br />

# 02. 형상관리를 위한 GitHub / GitLab의 사용 목적과 방향성

형상관리

- 목적: 소프트웨어 버전 관리, 변경사항 추적/통제, 변경사항의 충돌 해결, 다른 형상과의 변경내용 공유
- 역할: 협업에 도움
- 종류: Git, CVS, SVN 등
- Git 서비스 제공자: GitHub, GitLab, Bitbucket, AWS, Azure…

<br />

# 03. 다수와의 협업을 위한 형상관리

## 1) rebase와 conflict 해결

### 📔 merge

둘 이상의 브랜치를 하나로 병합

- merge --ff (fast-forward)
  - 커밋 히스토리 변경 없는 깨끗한 머지. 브랜치가 있었다는 정보 사라짐.
  - 이전 피처 브랜치 커밋 내용 유실 가능성 존재
- merge --no-ff
  - 새로운 머지 커밋 발생. 브랜치가 있었다는 기록 남음. 기록 및 순서 보존 가능
  - 커밋 로그가 복잡해짐
- merge --squash
  - Rebase나 merge 이전에 피쳐 브랜치의 모든 커밋을 하나의 커밋으로 병합. 브랜치가 있었다는 정보와 커밋 로그 모두 사라짐.
  - 전체 피쳐를 하나의 커밋으로 모아 메인 브랜치 커밋 히스토리는 리니어하게 관리 가능
  - 피쳐의 개발 과정 동안의 디테일 상실 가능성 (피쳐 개발하면서 나누어 커밋했던 과정들이 하나로 합쳐져버림)

### 📔 rebase

작업 내용을 다른 브랜치에서 재생성 (이전 커밋들을 클론 떠옴). 머지 커밋 생성 안 함.

| 장점                    | 단점                                                  |
| ----------------------- | ----------------------------------------------------- |
| 복잡한 히스토리 간소화  | 피쳐의 컨텍스트가 숨겨질 수 있음                      |
| 단일 커밋 조작의 용이함 | 팀으로서 작업할 때 위험성 존재                        |
| 머지 커밋 로그 안 생김  | Remote branch push 시 <br />모든 사용자는 rebase 필요 |

- Conflict chaining 발생 가능
  - 커밋 체인을 리베이싱하면서 계속 커밋마다 conflict를 해결해야 하는 상황 발생 가능
    - merge 커밋이 남을 땐 컨플릭트를 하나만 해결하면 되었음
  - **Interactive rebasing** 사용하면 Chaining commit에 대해 edit/delete/squash 등의 옵션을 사용해 rebase를 수월하게 할 수 있음
    - `git rebase -i HEAD~n`: HEAD에서부터 n번째 커밋까지 interactive 진행
    - `git rebase -i 4aa065`: 4aa065 이전까지의 커밋들에 대해서 interactive 진행
    - 명령어
      - pick: 커밋 수정 없이 그대로 사용
      - reword: 커밋 메시지 수정
      - edit: 커밋 메시지 + 내용 수정
      - squash, fixup: 해당 커밋을 이전 커밋과 합침
        - squash: 커밋들의 메시지가 합쳐짐
        - fixup: 이전 커밋의 메시지만 남음
      - drop: 해당 커밋을 버림. (drop 명령어 말고 해당 커밋 라인을 삭제해도 drop과 같은 효과)

<br />

## 2) stash & revert

### 📔 stash

동시다발적으로 해야 하는 일들이 발생되는 경우 주로 사용

- git stash: 작업 사항 임시 저장
  - `-u`, `--all`: staging 영역 바깥 (untracked. 새로 만든 파일 등) 변경사항까지 모두 임시저장. (일반적으로 새로 만든 파일은 stash 안 됨)
  - `--keep-index`: staging해둔 파일은 임시 저장 안 함
- git stash apply: stash에 있는 변경사항 로컬로 가져오고 stash 상태 유지
  - `--index`: staged 상태까지 복원
- git stash drop 스태시명: stash 목록에서 지움
- git stash pop: stash에 있는 변경사항 로컬로 가져오고 stash 내용 지움 (apply + drop)
- git stash list: stash해둔 목록 불러옴
- git stash branch 브랜치명: stash했던 내용을 새 브랜치에 가져옴. merge나 rebase를 통해 원래 브랜치로 병합하면 됨. conflict 발생 가능성 있을 때 사용하면 좋음.

### 📔 reset / revert

작업사항을 취소하는 경우 주로 사용

- git reset: 로컬의 수정사항을 완전히 제거하는 경우. 혼자 작업할 때 사용.
  - `--soft`: 변경사항을 제거하고 수정된 이력들은 staged로 이동
  - `--mixed`: 변경사항을 제거하고 수정된 이력들은 unstaged로 이동
  - `--hard`: 변경사항을 제거하고 수정된 이력들은 삭제
- git revert: reset과 다르게 커밋 추가. 협업에서 팀원과 브랜치 공유할 때 사용.

<br />

## 3) 형상 관리 방법론

- Git Flow
  - master(배포), release(배포 준비), develop(개발), feature(신규 개발), hotfix(긴급 수정)
  - 장점: 브랜치별 책임 명확. 디테일한 버전 정보. 배포 버전에 따른 분기가 확실
  - 단점: 다양한 브랜치로 인한 머지커밋, 복잡도 증가. 배포관리자 필요.
- GitHub Flow
  - master, feature (피쳐 브랜치에서 풀리퀘, 코드 리뷰, 테스트 받고 마스터로 머지. 머지 후 해당 브랜치 제거)
  - 간단한 구조. 버전이 만들어지면 배포 가능하다는 개념
- GitLab Flow
  - master, production, feature (피쳐를 마스터로 즉시 배포할 수 없는 경우 사용)
  - Git flow와 issue tracking을 병합. 단순화된 브랜칭 전략

<br />

# 04. 상황으로 이해하는 배포 개념/목적

## 1) 렌더링 방식과 배포 종류

### ✏️ CSR

- 페이지 로딩 속도 느림: 첫 페이지 로드 시 HTML, CSS, JS 등의 리소스를 빌드 결과물로 한번에 불러옴. (이미 불러왔으니 나머지 페이지 로드는 비교적 빠름)
  - 클라이언트인 브라우저가 웹 페이지 렌더링. 정적인 콘텐츠 제공. 웹 서버.
- No pre-rendering. JS가 로드된 이후에야 페이지가 렌더링됨.
- 서버는 렌더링 준비 끝난 HTML을 브라우저에 response로 전송 → 브라우저는 HTML에 명시된 JS 다운로드함 → 브라우저는 JS 및 리액트 구성함 → JS 실행 결과로 완성된 돔이 HTML 돔 트리에 구성됨. 페이지 렌더링됨.
- ⇒ **정적 배포** 사용. Ex) AWS CloudFront + AWS S3

### ✏️ SSR

- 빠른 페이지 로딩 속도: 필요한 부분의 HTML, JS 일부 들고 와서 첫 페이지 로드가 CSR보다 빠름. (매 Request시 HTML을 render하기 때문에 나머지 페이지 로드는 비교적 느림)
  - 서버가 다 렌더링하고 결과를 클라이언트인 브라우저에 전송. 웹 어플리케이션 서버 관리 필요
  - 외부 Request를 통해 자주 변경되는 페이지들, SEO(검색엔진최적화)가 필요한 경우에 사용 적합
- pre-rendering. JS 로드 이전에 html이 pre-rendered됨.
- 서버는 렌더링 준비 끝난 HTML을 브라우저에 response로 전송 → 브라우저는 HTML 렌더링하고 JS 다운로드함 → 브라우저는 JS 및 리액트 구성함 → 페이지 보여짐, 작동 가능
- ⇒ **동적 배포** 사용. Ex) EC2 인스턴스 구축 후 빌드된 next.js 이미지를 가져와서 도커 컨테이너 실행

### ✏️ SSG

- SSR과 유사. 프로젝트 빌드 시점에 HTML을 만들어놓고 이걸 페이지 request 결과로 보내줌. 잘 변경되지 않는 페이지에 적합. 서버가 HTML 만드는 시간 단축.
  - cf) SSR은 사용자가 페이지를 request할 때마다 HTML 만들어서 줌. 항상 최신 데이터 기반으로 프리 렌더링해서 줌.

<br />

## 2) Vercel 기반 배포 환경 구축

- Front as a Service 제품 빌드
- 손쉽게 Frontend를 빌드 & 배포
- GitHub PR에 대해 Pre-deploying 제공 ➔ CI/CD 역할 수행
- Preview Deployment
  - 변경사항을 Production 배포 없이 경험해볼 수 있도록 수행되는 배포
  - PR / MR(merge request) 생성 시, 업데이트시 자동 / 수동으로 배포
  - 각 배포 버전은 유니크한 URL을 부여받아 접근 가능
  - 상용 배포 이전 디자인 검수할 때, 다른 엔지니어에게 테스트 가능한 환경 제공할 때 사용

<br />

## 3) CI/CD 파이프라인 구축

### ✏️ CI (Continuous Integration, 지속적 통합)

- 작업 내역에 대한 빌드 및 테스트를 자동으로 수행해 이상 여부 검토
- 작업한 내역을 배포될 수 있는 브랜치로 병합
- 깃헙 레포에 대해서는 PR 기준으로 진행됨. 빌드 동작 검증 및 유닛 테스트 검증. PR approve & merge를 통해 CI 파이프라인 종결

### ✏️ CD (Continuous Delivery / Deployment)

- CI 이후 릴리즈 가능한 상태라면 배포 (자동 배포: delivery / 수동 배포: deployment)
- delivery
  - 일반적인 자동화된 릴리즈 처리
  - main branch 업데이트 시점에 자동으로 수행
- deploy
  - 특정 tag/branch/commit으로 product 배포
  - 이를 통해 특정 피쳐 배포 / 빠른 rollback 처리 수행 가능

### ✏️ CI/CD 구축의 장단점

- 장점
  - 반응성 뛰어난 개발 (비즈니스 측면, 다른 직군과의 커뮤니케이션 등)
  - 더 짧은 테스트 주기 (작은 사이즈의 pr로 테스트)
  - 운영환경 변화 모니터링 용이
  - 롤백이 쉬움
- 단점
  - 사용자에게 주는 효과 미미
  - 지속적 모니터링, 리포트 필요
  - 자원 관리 대응 상시 필요

### ✏️ Github action에 대한 이해

- GitHub Action: CI/CD 파이프라인 구축을 도와주는 플랫폼
- Workflow

  - 1개 이상의 job을 수행하는 설정가능한 자동화 프로세스
  - YAML을 이용 .github/workflows 디렉토리에 정의
  - 정의된 워크플로우를 다른 워크플로우에서 재사용 가능
    <img width="480" src="https://github.com/seohyun319/Lecture/assets/76686872/7b38084e-e063-4bfe-8cae-141ec4c18141" /> <img width="480" src="https://github.com/seohyun319/Lecture/assets/76686872/23a9a1d9-3756-47a4-992f-906eeca33a98" />
  - 내부 항목들:

    - name: (opt) 리포지토리 Actions 탭에 보여질 이름
    - run-name: (opt) 실제 동작하는 시점에서 리포지토리 Actions 탭에 보여질 이름.
    - `on`: Trigger 정의. 워크플로우가 동작하게 트리거시키는 이벤트.

      - 자주 쓰이는 이벤트
        - push : 커밋/태그 푸시했을 때
        - pull_request: PR 오픈 시
        - create: 브랜치/태그를 새로 생성했을 때
        - issues: 이슈를 생성/삭제/수정 했을 때
          <img width="480" src="https://github.com/seohyun319/Lecture/assets/76686872/51b3c92c-8f2b-4559-8591-9195f34aa831" />

    - `jobs`: 트리거 시 수행할 job 정의. 같은 러너에서 순차적으로 실행되는 step의 집합
      - <JOB_NAME> : JOB Name 기준으로 job의 수행항목 정의
      - `runs-on`: job이 수행될 VM 정의.
        - hosted runner: GitHub이 제공하는 Runner. windows, macOS, linux OS 제공
        - self-hosted runner: 직접 runner 인스턴스 구성
      - `needs`: 선행조건 명시 가능. needs 옵션에 명시된 다른 job이 종료된 이후에 수행 가능. 없으면 병렬 수행.  
        <img width="400" src="https://github.com/seohyun319/Lecture/assets/76686872/9cfecea8-9aaa-4e79-8bfd-f9b4dd1c9c84" />
      - `if`: job의 실행 여부 통제 가능
        <img width="480" src="https://github.com/seohyun319/Lecture/assets/76686872/67d564bd-d8e0-4bf2-beab-294d209b2fa4" />
      - `matrix strategy`: 하나의 job 정의 내에서 여러가지 변수의 조합을 사용한 실행
        - 중복된 코드를 줄이고 보다 효율적으로 구성하는데 사용
        - 여러개의 matrix를 정의해서 사용도 가능
        - 여러 os 환경이나 언어 버전 등을 정의 가능
          <img width="420" src="https://github.com/seohyun319/Lecture/assets/76686872/cedfe7e5-e5f0-4086-94bd-5fec27b86332" /><img width="360" src="https://github.com/seohyun319/Lecture/assets/76686872/ae57dabe-bb50-4fae-a82f-627a5a23b0ca" />
      - `steps`: job 아래에서 수행될 task 목록, shell script 이거나 분리된 github action
        - `uses`: 사용할 action
          - uses: <ACTION_NAME>@<VERSION> 의 형태
          - 자주 사용되는 action
            - action/checkout@v3 : 코드를 runner로 내려 받을 때
            - actions/setup-node@v3: Node.JS 환경 구성
            - mikefarah/yq@v4.35.1: yaml query 사용 시, jq와 유사
            - docker/build-push-action@v4: Docker images build & push to registry
            - softprops/action-gh-release@v1: Github release 구성
        - `run`: 수행할 bash script
        - job 안에서 step끼리는 서로간의 데이터를 공유 가능
          <img width="480" src="https://github.com/seohyun319/Lecture/assets/76686872/6c389647-6c2d-4bf6-9044-18853fa3bdb1" />
        - 출력 매개변수를 통해서 다음 단계로 전달 가능
          - 변수 이름과 값을 {name}={value} 형태로 $GITHUB_OUTPUT 환경변수에 전달
          - 변수 read: context 문법인 steps.<step_id>.outputs.<output_name> 사용
            <img width="480" src="https://github.com/seohyun319/Lecture/assets/76686872/4488df1b-f018-4d35-a4c0-06f5a49ab8c3" />
            run echo bar
        - step도 if로 통제 가능
          <img width="480" src="https://github.com/seohyun319/Lecture/assets/76686872/9cf482c8-36b5-4345-bbc4-22f4693e3757" />
        - `continue-on-error`: true이면 현재 step이 실패해도 남은 단계 이어서 수행함. (기본적으로는 현재 단계 실패하면 다음 단계 수행 안 함)
          <img width="480" src="https://github.com/seohyun319/Lecture/assets/76686872/d37662c3-e81f-4978-aa24-6aa992f72b7c" />
        - `if: always()` : 이전 단계의 결과에 상관없이 항상 수행되어야 하는 단계에 사용
          <img width="480" src="https://github.com/seohyun319/Lecture/assets/76686872/fdb91bab-e776-49e5-9992-8ec7ef775b40" />

- vercel을 이용한 CD
  - 준비사항
    - Install Vercel CLI: `npm i –g vercel`
    - Run vercel login : `vercel login`
    - Run vercel link : `vercel link` # 새 project 생성을 하거나 기존 project와 link
    - .vercel/project.json 파일 생성됨
    - orgId 와 projectId를 구해 VERCEL_ORG_ID, VERCEL_PROJECT_ID 로 github secret에 추가
    - VERCEL_TOKEN
      - https://vercel.com/guides/how-do-i-use-a-vercel-api-access-token
      - 위 링크를 참조하여 Vercel Access token을 받아옴
  - .github/workflows/.yml 파일 작성
