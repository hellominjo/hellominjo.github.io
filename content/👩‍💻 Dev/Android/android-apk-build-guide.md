---
title: Android APK 빌드 가이드
description: Android 프로젝트 생성 및 APK 빌드 가이드
permalink: android-apk-build-guide
created: 2026-08-08
draft:
tags:
  - "#안드로이드"
  - 자동화
  - Deploy
---
## Android 프로젝트 생성 및 APK 빌드 가이드

작업 환경(샌드박스)에는 Android SDK와 인터넷 접근이 없어 이 자리에서 직접 APK를 컴파일할 수 없습니다.
대신 완성된 프로젝트 소스(`ele-webview-app` 폴더)를 준비해 두었으니, 아래 순서대로 본인 PC에서 그대로 빌드하면 됩니다.

## 1. Android Studio 설치

1. https://developer.android.com/studio 에서 Android Studio를 내려받아 설치합니다.
2. 최초 실행 시 나오는 Setup Wizard에서 "Standard" 설치를 선택하면 Android SDK, 에뮬레이터 등이 자동으로 함께 설치됩니다.

## 2. 새 프로젝트 생성

1. Android Studio 실행 후 **New Project** 선택
2. 템플릿은 **Empty Views Activity** 선택
3. 아래와 같이 입력
   - Name: `ELE` (원하는 이름으로 변경 가능)
   - Package name: `kr.co.only1.ele`
   - Language: **Kotlin**
   - Minimum SDK: **API 24 (Android 7.0)** 이상
4. **Finish** 클릭 → Gradle Sync가 끝날 때까지 대기 (인터넷 필요, 최초 1회 몇 분 소요)

이 과정을 거치면 `gradlew`, `gradle-wrapper.jar` 등 빌드에 필요한 파일들이 자동 생성됩니다. (이 파일들은 바이너리라 이번 작업 폴더에는 포함하지 못했습니다.)

## 3. 준비된 소스 파일로 교체

패키지명을 `com.visang.only1ele`로 만든 경우 기준입니다 (Android Studio 좌측 트리 기준).

| 전달 파일 (`ele-webview-app-v2.zip` 안) | 덮어쓸/추가할 위치 |
|---|---|
| `app/src/main/java/com/visang/only1ele/MainActivity.kt` | `app > kotlin+java > com.visang.only1ele > MainActivity.kt` (기존 자동 생성된 MainActivity를 통째로 교체) |
| `app/src/main/res/layout/activity_main.xml` | `app > res > layout > activity_main.xml` (WebView 하나만 있는 레이아웃으로 교체) |

나머지는 **덮어쓰지 말고** 아래처럼 기존 파일에 한 줄씩만 추가하세요. 새 프로젝트 템플릿이 이미 `libs.versions.toml`(Version Catalog)과 자체 매니페스트/테마를 갖고 있어서, 전체 교체하면 오히려 충돌납니다.

- `manifests/AndroidManifest.xml` → `<application>` 태그 위에 아래 권한 두 줄만 추가
  ```xml
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  ```
- `Gradle Scripts > build.gradle.kts (Module :app)` → 수정 불필요. WebView는 안드로이드 기본 SDK에 포함돼 있어 별도 의존성 추가가 필요 없습니다.
- `res/values/strings.xml`, `res/values/themes.xml` → 그대로 두면 됩니다 (앱 이름/테마는 이미 만든 프로젝트 값을 씁니다).

패키지명이 `com.visang.only1ele`가 아니라면, `MainActivity.kt` 1번째 줄의 `package com.visang.only1ele`를 실제 패키지명으로 바꾸고 파일을 해당 패키지 폴더에 넣으면 됩니다.

## 4. 앱 동작 방식

`MainActivity.kt`는 WebView 하나로 3개 페이지 흐름을 처리합니다.

1. 앱 실행 시 스플래시 페이지를 로드: `https://ele-design.only1.co.kr/src/intro/splash.asp`
2. 이후 온보딩(`https://testsingle.only1.co.kr/external/ele/intro/onboarding`), 서비스 메인(`https://ele-design.only1.co.kr/src/today/today.asp`)으로의 이동은 **웹페이지 자체의 링크/리다이렉트를 그대로 따라갑니다.** (사이트가 이미 이 흐름대로 페이지를 이동시키는 구조라면 앱은 최초 URL만 열면 됩니다.)
3. `ele-design.only1.co.kr`, `testsingle.only1.co.kr` 두 도메인은 계속 WebView 안에서 열리도록 처리되어 있습니다.
4. 안드로이드 뒤로가기 버튼은 웹페이지 히스토리를 우선 따라가고, 더 이상 갈 곳이 없으면 앱을 종료합니다.

만약 실제로 사이트가 자동으로 다음 페이지로 넘어가지 않고(예: 스플래시에서 3초 대기 후 강제 이동, 온보딩은 첫 실행에만 보여주고 이후엔 건너뛰기 등) **앱이 직접 화면 전환을 제어해야 한다면**, 그 조건(몇 초 후 이동인지, 어떤 버튼/신호로 다음 단계로 넘어가는지)을 알려주시면 코드를 그에 맞게 수정해 드릴 수 있습니다.

## 5. 빌드 및 APK 생성

1. Android Studio 상단 메뉴 **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. 빌드가 끝나면 우측 하단 알림의 **locate** 클릭 → `app/build/outputs/apk/debug/app-debug.apk` 확인
3. 이 파일이 테스트용(서명 없는) APK입니다. 실제 배포(스토어 등록, 타인 배포)를 하려면 **Build → Generate Signed Bundle / APK**로 릴리스 키를 만들어 서명해야 합니다.

## 6. 설치 및 테스트

- 안드로이드 기기를 USB로 연결하고 개발자 옵션 > USB 디버깅을 켠 뒤, Android Studio에서 **Run ▶** 버튼으로 바로 설치/실행할 수 있습니다.
- 또는 `app-debug.apk` 파일을 기기로 옮겨 직접 설치(출처를 알 수 없는 앱 설치 허용 필요)할 수 있습니다.

## 참고: 아이콘 변경

기본 안드로이드 아이콘을 회사 로고로 바꾸려면 Android Studio에서 `res` 폴더 우클릭 → **New → Image Asset**을 사용해 로고 이미지를 넣으면 `ic_launcher` 리소스가 자동 생성됩니다.
