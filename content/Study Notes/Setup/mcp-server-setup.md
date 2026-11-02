---
title: LLM에 MCP 서버 연결 방법
description: LLM에 외부 도구를 붙이는 MCP의 개념과 서버 등록·확인·디버깅 과정 정리
permalink: mcp-server-setup
date: 2026-10-16
draft: false
tags:
  - setup
  - Claude
  - MCP
  - 자동화
---
MCP(Model Context Protocol)는 LLM에 외부 도구를 붙이는 표준 규격입니다. 파일 시스템, 데이터베이스, GitHub, 브라우저처럼 모델이 원래 접근할 수 없는 것들을 **도구 목록 형태로 노출**해 줍니다.

> 핵심은 "모델에게 기능을 가르친다"가 아니라 **"모델이 호출할 수 있는 창구를 연다"**는 점입니다. 서버를 붙이는 순간 도구 목록이 컨텍스트에 올라가고, 모델이 필요할 때 알아서 호출합니다.

## 1. 구조 이해하기

```
Claude (클라이언트)  ←→  MCP 서버  ←→  실제 리소스
                          (프로세스)      (파일/DB/API)
```

서버는 대부분 **로컬 프로세스**로 뜹니다. `npx`나 `uvx`로 실행되는 작은 프로그램이고, Claude가 표준입출력으로 대화합니다. 원격 서버는 URL로 연결합니다.

## 2. 설정 파일에 등록하기

가장 확실한 방법은 설정 파일을 직접 편집하는 것입니다. 프로젝트 루트의 `.mcp.json`에 작성하면 그 프로젝트에서만 적용됩니다.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/projects"]
    }
  }
}
```

| 필드 | 의미 |
|---|---|
| `command` | 서버를 띄울 실행 파일 (`npx`, `uvx`, `node`, 절대 경로 등) |
| `args` | 실행 인자. 접근 허용 경로를 여기서 제한합니다 |
| `env` | 서버에 넘길 환경 변수 (API 키 등) |

CLI로 등록하는 방법도 있습니다. 명령 형태가 버전에 따라 달라지니 `claude mcp --help`로 현재 설치된 버전의 정확한 문법을 먼저 확인하세요.

## 3. 접근 범위를 좁히는 게 먼저

파일 시스템 서버를 홈 디렉터리 전체로 열어두면, 모델이 의도치 않게 민감한 파일을 읽을 수 있습니다. **작업에 필요한 폴더만** 인자로 넘기는 게 기본입니다.

```json
"args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/projects/myapp"]
```

API 키가 필요한 서버는 설정 파일에 값을 직접 쓰지 말고 환경 변수로 넘깁니다.

```json
"env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
```

## 4. 연결 확인

Claude를 재시작한 뒤 도구 목록에 서버가 떴는지 확인합니다. 세션 안에서 `/mcp`를 실행하면 연결된 서버와 상태를 볼 수 있습니다.

## 5. 자주 막히는 지점

| 증상 | 원인 | 해결 |
|---|---|---|
| 서버가 목록에 없음 | 설정 파일 경로/JSON 문법 오류 | `python -m json.tool .mcp.json`로 문법 검증 |
| `command not found` | `npx`/`uvx`가 PATH에 없음 | `command`에 절대 경로를 적어 확인 |
| 연결은 되는데 도구 호출 실패 | 권한 범위 밖 경로 접근 | `args`의 허용 경로 확인 |
| 재시작해도 반영 안 됨 | 앱이 완전히 종료되지 않음 | 프로세스까지 종료 후 재실행 |

JSON 문법 오류가 가장 흔한데, 설정 파일이 깨지면 **오류 없이 조용히 무시**되는 경우가 많아 원인을 찾기 어렵습니다. 서버가 안 보이면 문법부터 검증하세요.

---

## Related Notes

- [Claude Code 설치와 초기 설정](claude-code-setup.md)
- [Claude API 시작하기](claude-api-setup.md)
