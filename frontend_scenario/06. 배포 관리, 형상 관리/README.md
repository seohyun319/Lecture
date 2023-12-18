# **Part 06. 서로 다른 목적조직간의 동기를 맞추는 배포/형상관리**

- [01. part overview](#01-part-overview)
- [02. 형상관리를 위한 GitHub / GitLab의 사용 목적과 방향성](#02-형상관리를-위한-github--gitlab의-사용-목적과-방향성)
- [03. 다수와의 협업을 위한 형상관리](#03-다수와의-협업을-위한-형상관리)
  - [1) rebase와 conflict 해결](#1-rebase와-conflict-해결)
  - [2) stash & revert](#2-stash--revert)
  - [3) 형상 관리 방법론](#3-형상-관리-방법론)

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
