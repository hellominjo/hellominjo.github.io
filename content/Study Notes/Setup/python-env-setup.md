---
title: "Python 분석 환경 세팅 : uv로 통일하기"
description: pip·venv·pyenv로 흩어져 있던 Python 환경을 uv 하나로 정리한 세팅 기록
permalink: python-env-setup
date: 2026-10-13
draft: false
tags:
  - setup
  - Python
  - uv
  - Data
---
## Python 분석 환경 세팅

Python 환경 세팅이 번거로운 이유는 도구가 역할별로 쪼개져 있기 때문입니다. 인터프리터는 pyenv, 가상환경은 venv, 패키지는 pip, 버전 고정은 pip-tools — 네 개를 따로 익혀야 했습니다. **uv는 이걸 하나의 바이너리로 통합**합니다.

## 1. uv 설치

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex
```

설치 확인:

```bash
uv --version
```

## 2. Python 인터프리터 설치

pyenv 없이 uv가 직접 받아옵니다.

```bash
uv python install 3.12
uv python list        # 설치된 버전 확인
```

## 3. 프로젝트 만들기

```bash
uv init my-analysis
cd my-analysis
```

`pyproject.toml`이 생깁니다. 의존성은 여기에 기록되고, 정확한 버전은 `uv.lock`에 고정됩니다.

## 4. 패키지 추가

```bash
uv add pandas numpy matplotlib jupyter
```

`uv add`는 설치와 동시에 `pyproject.toml`과 `uv.lock`을 갱신합니다. `pip install` 후에 `requirements.txt`를 따로 갱신하던 두 단계가 하나로 줄어듭니다.

| 기존 방식 | uv |
|---|---|
| `python -m venv .venv` | `uv venv` (또는 `uv run`이 자동 생성) |
| `source .venv/bin/activate` | 불필요 — `uv run`이 알아서 씁니다 |
| `pip install pandas` | `uv add pandas` |
| `pip freeze > requirements.txt` | 자동 (`uv.lock`) |
| `pip install -r requirements.txt` | `uv sync` |

## 5. 실행 : activate가 필요 없습니다

```bash
uv run python analysis.py
uv run jupyter lab
```

`uv run`은 가상환경을 자동으로 찾아 그 안에서 실행합니다. **활성화를 깜빡해서 전역에 설치되는 사고**가 구조적으로 사라집니다.

굳이 활성화하고 싶다면 기존 방식도 그대로 됩니다.

```bash
uv venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
```

## 6. 다른 PC에서 재현하기

```bash
git clone <repo>
cd my-analysis
uv sync
```

`uv.lock`에 적힌 **정확히 같은 버전**이 설치됩니다. Python 인터프리터 버전까지 `pyproject.toml`의 `requires-python`을 보고 맞춰줍니다.

## 7. 자주 막히는 지점

| 증상 | 원인 | 해결 |
|---|---|---|
| `command not found: uv` | PATH 미반영 | 터미널 재시작 또는 `source ~/.zshrc` |
| Jupyter에서 패키지를 못 찾음 | 커널이 전역 Python을 가리킴 | `uv run jupyter lab`으로 실행 |
| 팀원과 버전이 다름 | `uv.lock`을 커밋 안 함 | `uv.lock`은 **반드시 커밋** |

`uv.lock`을 `.gitignore`에 넣는 실수가 특히 잦습니다. 이 파일이 재현성의 전부라 반드시 저장소에 포함시켜야 합니다.

---

## Related Notes

- [Claude Code 설치와 초기 설정](claude-code-setup.md)
- [Claude API 시작하기](claude-api-setup.md)
