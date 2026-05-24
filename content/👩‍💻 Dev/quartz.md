---
title: Quartz로 블로그 만들기
description: Quartz를 사용해 개인 지식 베이스를 퍼블리싱하는 방법을 소개합니다.
permalink: getting-started-with-quartz
aliases:
  - Quartz 설치 가이드
  - Quartz 블로그 만들기
date: 2026-05-16
draft: false
tags:
  - quartz
  - productivity
---

이 블로그는 **Quartz 4**로 제작되었습니다. `Quartz`는 Obsidian으로 작성한 노트를 정적 웹사이트로 퍼블리싱할 수 있는 도구로 자유로운 커스텀이 가능하므로 설정하면서 얻은 지식과 경험들을 기록하고 공유하고자 합니다.


## 주요 기능

- 마크다운 파일을 HTML로 변환
- 백링크 및 그래프 뷰 지원
- 빠른 검색 기능

## 시작하는 법

1. 'Quartz' 템플릿 저장소를 클론합니다.
2. github에 'username.github.io'로 repo를 설정합니다. 
3. 'Pages'를 활성화 > 'Github Actions'로 변경합니다.
4. `content/` 폴더에 마크다운 파일을 추가합니다.
5. `npx quartz build --serve`로 로컬에서 확인합니다.


- **npm** 이 설치되어 있어야 합니다.

---

## 1. 설치 과정

### 1) Git Repo 복제

```bash
git clone https://github.com/username/username.github.io
cd 저장소이름
```

### 2) 패키지 설치

```bash
npm install
```

### 3) Quartz 초기화

```bash
npx create quartz
```

프롬프트에서 아래 옵션을 선택합니다.

```bash
┌   Quartz v4.5.2 
│  ◆ Choose how to initialize the content in `/Users/Dev/quartz/content`
│  ● Empty Quartz 선택
│  ○ Copy an existing folder
│  ○ Symlink an existing folder
└
```

```
┌   
│ ◆ Choose how Quartz should resolve links in your content. This should match │ Obsidian's link format. You can change
│ this later in `quartz.config.ts`.
│ ● Treat links as shortest path ((default))
│ ○ Treat links as absolute path
│ ○ Treat links as relative paths
└
```


## 2. Git Config 설정  변경

### 1) Git Config 설정 변경 

```bash
git config --global user.name "본인 아이디"
git config --global user.email "본인 이메일"
```
> `username` 부분을 자신의 GitHub 아이디로 교체합니다.

### 2) GitHub Pages 활성화 및 Workflow 추가

[File : quartz/.github/workflows/deploy.yml]

```bash

nname: Deploy Quartz site to GitHub Pages
on:
  push:
    branches:
      - v4
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Install Dependencies
        run: npm ci
      - name: Build Quartz
        run: npx quartz build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-22.04
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 3. 빌드 및 배포

### 1) 로컬 미리보기

```bash
npx quartz build --serve
```

> **확인방법** : 브라우저 접속 후 `http://localhost:8080` 에서 생성된 사이트를 확인할 수 있습니다.

### 2) GitHub 배포

```bash
git add .github/workflows/deploy.yml
git commit -m "fix: yaml indentation in deploy workflow"
git push origin main
```

> **확인방법** : 배포 완료 시 'username.github.io'로 잘 접속되는 것을 알 수 있다.


****
> [!hint] **참고자료**
> Quartz 4 세팅 관련 참고한 자료 목록입니다.
> 
> - Quartz 4 : [Welcome to Quartz 4](https://quartz.jzhao.xyz/)
> - Obsidian으로 GitHub Blog 만들기 : [Obsidian으로 GitHub Blog 만들기](https://chereny.github.io/Obsidian%EC%9C%BC%EB%A1%9C-GitHub-Blog-%EB%A7%8C%EB%93%A4%EA%B8%B0)
> - Junbeom Docs : https://obsidian.junbeom.work/obsidian/quartz
> - hayoung blog : [hayoung blog](https://khy07181.github.io/)
> - 이토록 쉬운 옵시디언 : [이토록 쉬운 옵시디언](https://olait.tistory.com/) 
> - TakeTech's Data Garden 🌻 : https://taketech019.github.io
> - Obsidian 활용 가이드 : [부록 D. Templater·QuickAdd 자동화 레시피 20선 - Obsidian 활용 가이드](https://wikidocs.net/345781)

