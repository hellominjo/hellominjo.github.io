---
title: "Claude API 시작하기 : 가입부터 첫 호출까지"
description: Anthropic 콘솔 가입, API 키 발급, Python SDK로 첫 응답을 받기까지의 세팅 기록
permalink: claude-api-setup
date: 2026-10-21
draft: false
tags:
  - setup
  - Claude
  - API
  - Python
---
## Claude API 시작하기

LLM을 코드에서 직접 호출하려면 콘솔 가입 → API 키 발급 → SDK 설치 → 호출의 네 단계가 필요합니다. 대부분 막히는 지점은 세 번째가 아니라 발급받은 **API 키를 어디에 두느냐**에서 생깁니다.

## 1. 콘솔 가입 및 결제 수단 등록하기

1. [platform.claude.com](https://platform.claude.com) 에서 계정을 만듭니다.
2. **Billing**에서 결제 수단을 등록하고 크레딧을 충전합니다. API는 구독(claude.ai Pro)과 **별도 과금**이라, Pro를 쓰고 있어도 API 크레딧은 따로 필요합니다.

## 2. API 키 발급

**Settings → API keys → Create Key**로 발급합니다.

> Tip. 키 전체 값은 **발급 직후 한 번만** 보입니다. 창을 닫으면 다시 볼 수 없고 새로 발급해야 하니, 그 자리에서 비밀번호 관리자나 `.env`에 옮겨두세요.

## 3. API 키 환경 변수로 저장g하기

SDK는 `ANTHROPIC_API_KEY` 환경 변수를 자동으로 읽어옵니다. 코드에 키를 직접 쓰는 것은 위험하므로 환경변수로 아래와 같이 저장합니다. 

```bash
# MAC OS Rlwns : ~/.zshrc 또는 ~/.bashrc
export ANTHROPIC_API_KEY="sk-ant-..."
```

프로젝트 단위로 관리한다면 `.env`를 쓰되, **반드시 `.gitignore`에 먼저 추가**합니다.

```bash
echo ".env" >> .gitignore
echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env
```

## 4. SDK 설치 및  호출확인

```bash
# Python 패키지 설치
pip install anthropic
```

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY를 자동으로 읽습니다

response = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": "자기소개를 한 문장으로 해줘"}],
)

for block in response.content:
    if block.type == "text":
        print(block.text)
```

`response.content`는 블록 **리스트**입니다. `content[0].text`로 바로 접근하면 사고 블록이 앞에 올 때 깨지니, 위처럼 `block.type`을 확인하는 것이 안전합니다.

## 5. Claude 모델 선택 및 비용 확인

| 모델        | 모델 ID              | 입력 / 출력 (per MTok) |
| --------- | ------------------ | ------------------ |
| Opus 5    | `claude-opus-5`    | $5 / $25           |
| Sonnet 5  | `claude-sonnet-5`  | $3 / $15           |
| Haiku 4.5 | `claude-haiku-4-5` | $1 / $5            |

기본값은 Opus 5로 두고, 분류·요약처럼 단순하고 양이 많은 작업만 Haiku로 내리는 쪽이 관리하기 쉽습니다. 모델 ID에 날짜 접미사를 붙이면 404로 표시되니 위 문자열을 그대로 사용합니다.

## [참고] 자주 막히는 지점

| 오류 및 증상                     | 원인                 | 해결 방법                                      |
| --------------------------- | ------------------ | ------------------------------------------ |
| `AuthenticationError` (401) | 키 미설정 또는 오타        | `echo $ANTHROPIC_API_KEY`로 셸에 실제로 들어왔는지 확인 |
| 터미널 재시작 후 다시 401            | `export`를 현재 셸에만 함 | `~/.zshrc`에 넣고 `source ~/.zshrc`           |
| `NotFoundError` (404)       | 모델 ID 오타           | 위 표의 문자열을 그대로 복사                           |
| 응답이 중간에 끊김                  | `max_tokens` 부족    | 값을 올리거나 스트리밍으로 전환                          |

---

## Related Notes

- [Claude Code 설치와 초기 설정](claude-code-setup.md)
- [MCP 서버 연결하기](mcp-server-setup.md)
