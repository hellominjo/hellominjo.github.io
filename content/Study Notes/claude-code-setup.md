---
title: Claude Code 설치와 초기 설정
description: 터미널에서 동작하는 코딩 에이전트 Claude Code의 설치, 인증, 프로젝트 초기 설정 기록
permalink: claude-code-setup
date: 2026-10-23
draft: false
tags:
  - setup
  - Claude
  - CLI
  - 자동화
---
## Claude Code 설치 및 설정

Claude Code는 터미널에서 돌아가는 코딩 에이전트입니다. 코드베이스를 읽고, 파일을 고치고, git 작업까지 자연어로 처리합니다. 설치 자체는 명령어 한줄로 가능하지만 **Node 버전**과 **sudo 사용 여부**에서 자주 막힙니다.

## 1. 사전 준비 : Node.js 22 이상

```bash
node --version   # v22.x 이상
```

버전이 낮으면 설치는 되더라도 실행 시점에 깨집니다. nvm을 쓴다면 먼저 올려둡니다.

```bash
nvm install 22
nvm use 22
```

## 2. NPM 설치

```bash
npm install -g @anthropic-ai/claude-code
```

> **Tip. `sudo`를 붙이지 마세요.** Claude Code는 자동 업데이트 시 sudo 없이 npm을 실행합니다. sudo로 설치하면 권한이 꼬여 자동 업데이트가 조용히 실패합니다.

권한 오류가 난다면 sudo 대신 npm의 전역 설치 경로를 홈 디렉터리로 옮기는 쪽이 정석입니다.

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

## 3. 설치 확인과 첫 실행

```bash
claude --version
cd ~/my-project
claude
```

`claude`는 **현재 디렉터리를 작업 범위로 삼습니다.** 홈 디렉터리에서 그냥 실행하면 엉뚱한 범위를 훑게 되니, 반드시 프로젝트 폴더로 이동한 뒤 실행합니다.

## 4. 인증

첫 실행 시 인증 방식을 고릅니다.

| 방식 | 과금 | 적합한 경우 |
|---|---|---|
| Claude 구독 로그인 | 구독 요금에 포함 | 개인 작업, 사용량이 들쭉날쭉할 때 |
| API 키 (`ANTHROPIC_API_KEY`) | 토큰 단위 종량제 | 사용량을 정확히 추적해야 할 때 |

구독 로그인과 API 키가 **동시에 설정돼 있으면 충돌 경고**가 뜹니다. 하나만 남기는 쪽이 깔끔합니다.

## 5. 프로젝트 설정 : CLAUDE.md

프로젝트 루트에 `CLAUDE.md`를 두면 매 세션 자동으로 읽힙니다. 매번 설명하던 내용을 여기에 적어두는 게 체감 효과가 가장 큽니다.

```markdown
# 프로젝트 규칙

- 패키지 매니저는 uv를 사용합니다. pip를 직접 호출하지 마세요.
- 테스트: `uv run pytest`
- 커밋 전 `ruff check .`를 통과해야 합니다.
```

세션 안에서 `/init`을 실행하면 코드베이스를 훑어 초안을 만들어줍니다.

## 6. 자주 막히는 지점

| 증상 | 원인 | 해결 |
|---|---|---|
| `command not found: claude` | 전역 bin이 PATH에 없음 | `npm bin -g` 결과를 PATH에 추가 |
| 자동 업데이트 실패 | sudo로 설치함 | 제거 후 3번 방식으로 재설치 |
| 엉뚱한 파일을 읽음 | 실행 위치가 프로젝트 밖 | 프로젝트 루트에서 재실행 |

---

## Related Notes

- [Claude API 시작하기](claude-api-setup.md)
- [MCP 서버 연결하기](mcp-server-setup.md)
