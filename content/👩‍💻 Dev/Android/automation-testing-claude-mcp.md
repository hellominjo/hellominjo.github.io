---
title: "Android 앱 자동화 테스트 방법 : Claude + Appium MCP"
description: 안드로이드 앱 자동화 테스트 방법 소개
permalink: automation-testing-claude-mcp
created: 2026-08-08
draft:
tags:
  - 자동화
  - aos
---
## 안드로이드 앱 자동화 : Claude + Appium MCP 설정 가이드

- Mac (Android Studio/SDK, Node.js 설치 완료), 에뮬레이터 + 실기기 둘 다 사용, 앱은 이미 폰/에뮬레이터에 설치
- 사용할 MCP 서버: `mcp-appium-visual` (Rahulec08/appium-mcp)

터미널에서 순서대로 실행하면 됩니다.

---

## 1단계. Appium 서버 & 드라이버 설치

```bash
npm install -g appium
appium driver install uiautomator2
```

설치 확인

```bash
appium -v
appium driver list --installed
```

---

## 2단계. 환경 변수 확인

`~/.zshrc`(zsh 기본)에 아래가 있는지 확인, 없으면 추가 후 `source ~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

확인

```bash
adb version
```

---

## 3단계. 기기 연결

**에뮬레이터**
- Android Studio > Device Manager에서 AVD 실행 (기존에 만든 게 없으면 하나 생성)
- 또는 터미널: `emulator -list-avds` 로 이름 확인 후 `emulator -avd <이름>`

**실기기**
- 폰: 설정 > 휴대전화 정보 > 빌드번호 7번 눌러 개발자 옵션 활성화
- 설정 > 개발자 옵션 > USB 디버깅 켜기
- USB로 Mac에 연결, 폰에 뜨는 "USB 디버깅 허용" 팝업 승인

**공통 확인**

```bash
adb devices
```

기기가 `device` 상태로 뜨면 연결 완료 (`unauthorized`면 폰 팝업을 다시 확인).

---

## 4단계. 테스트할 앱의 패키지명 확인

앱이 이미 설치돼 있으니, 폰/에뮬레이터에서 그 앱을 켠 상태로

```bash
adb shell dumpsys window | grep mCurrentFocus
```

`com.example.myapp/.MainActivity` 같은 형식으로 패키지명과 시작 액티비티가 나옵니다. 이 값을 다음 단계에서 씁니다.

---

## 5단계. Claude Desktop에 MCP 서버 등록

설정 파일 열기 (없으면 새로 생성)

```bash
open -e ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

아래 내용 추가 (기존에 다른 MCP 서버가 있으면 `mcpServers` 안에 같이 넣기)

```json
{
  "mcpServers": {
    "mcp-appium-visual": {
      "command": "npx",
      "args": ["mcp-appium-visual@1.3.3"],
      "env": {
        "NODE_OPTIONS": "--max-old-space-size=4096"
      }
    }
  }
}
```

저장 후 **Claude Desktop 완전히 종료 후 재시작** (MCP 서버는 앱 시작 시 로드됨).

---

## 6단계. 연동 확인

Claude Desktop을 열고 새 대화에서 도구 목록(망치 아이콘 🔨)에 `mcp-appium-visual` 관련 도구들이 보이면 정상 연결된 것입니다.

이후 대화에서 예를 들어:

> "에뮬레이터에 연결해서 com.example.myapp 앱을 열고, 로그인 화면 스크린샷 찍어줘"

처럼 자연어로 지시하면 Claude가 Appium 세션을 열고 tap/type/screenshot 도구를 호출합니다.

---

## 참고 - capabilities에 넣을 값

Claude가 세션을 열 때 내부적으로 아래와 비슷한 설정을 씁니다 (4단계에서 확인한 패키지명 사용):

```json
{
  "platformName": "Android",
  "automationName": "UiAutomator2",
  "deviceName": "YOUR_DEVICE_NAME",
  "appPackage": "com.example.myapp",
  "appActivity": ".MainActivity",
  "noReset": true
}
```

`deviceName`은 `adb devices`에 나온 값(에뮬레이터면 `emulator-5554` 등, 실기기면 임의 이름 가능) 사용.

---

## 트러블슈팅

| 증상                    | 확인할 것                                                        |
| --------------------- | ------------------------------------------------------------ |
| `adb devices`에 기기 안 뜸 | USB 디버깅 켜짐? 케이블/포트 교체, `adb kill-server && adb start-server` |
| Claude에 도구 목록이 안 보임   | JSON 문법 오류 여부, Claude Desktop 완전 재시작했는지                      |
| 세션 시작 실패              | `appium` 서버가 백그라운드에서 켜져 있는지 (`appium` 명령 별도 터미널에서 실행 상태 유지)  |
| 요소를 못 찾음              | Appium Inspector로 실제 요소 구조 확인                                |
