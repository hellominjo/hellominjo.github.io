---
title: 공공 API 요청 및 응답 받기
description: 공공데이터포털에서 발급받은 인증키로 R에서 API를 호출하고 응답을 데이터프레임으로 만드는 과정
permalink: data-analysis-api-request
date: 2026-09-22
draft: false
tags:
  - Data
  - API
  - R
  - 공공데이터
---
## API 요청 및 응답 받기

앞 글에서 공공데이터포털 가입과 인증키 발급까지 마쳤습니다. 이제 그 키로 실제 요청을 보내고, 돌아온 응답을 분석할 수 있는 형태로 바꿉니다.

## STEP1. 패키지 설치

```r
install.packages(c("httr", "jsonlite", "dplyr"))

library(httr)
library(jsonlite)
library(dplyr)
```

| 패키지 | 역할 |
|---|---|
| `httr` | HTTP 요청을 보내고 응답을 받습니다 |
| `jsonlite` | JSON 응답을 R 객체로 변환합니다 |
| `dplyr` | 변환된 데이터를 다듬습니다 |

## STEP2. 요청 주소와 파라미터 확인

**엔드포인트 주소와 파라미터 이름은 API마다 다릅니다.** 활용신청 후 받은 **기술문서(참고문서)** 에 정확한 값이 적혀 있으니 거기서 그대로 복사하세요. 추측으로 조립하면 거의 반드시 틀립니다.

기술문서에서 확인할 항목은 네 가지입니다.

- **요청 주소(End Point)** — `https://apis.data.go.kr/...`
- **요청 변수** — 필수/선택 구분과 정확한 이름 (`LAWD_CD`, `DEAL_YMD` 등 대소문자까지)
- **출력 형식** — JSON 지원 여부 (XML만 주는 API도 많습니다)
- **일일 트래픽 한도**

## STEP3. 인증키를 환경 변수로 분리

키를 스크립트에 직접 쓰면 깃에 올리는 순간 노출됩니다. R은 `.Renviron` 파일을 씁니다.

```r
usethis::edit_r_environ()   # 파일이 열립니다
```

열린 파일에 한 줄 추가하고 저장한 뒤 RStudio를 재시작합니다.

```
DATA_GO_KR_KEY=발급받은_Decoding_키
```

```r
service_key <- Sys.getenv("DATA_GO_KR_KEY")
```

## STEP4. 요청 보내기

```r
url <- "기술문서에_적힌_요청주소"

res <- GET(
  url,
  query = list(
    serviceKey = service_key,
    pageNo     = 1,
    numOfRows  = 100,
    type       = "json"
  )
)

status_code(res)   # 200이면 통신 성공
```

`query = list(...)`로 넘기면 `httr`이 **URL 인코딩을 대신 처리**합니다. 그래서 여기에는 **Decoding 키**를 넣어야 합니다.

## STEP5. Encoding / Decoding 키 함정

인증키는 마이페이지에 두 가지로 표시됩니다.

| 종류 | 생김새 | 쓰는 곳 |
|---|---|---|
| **Decoding** | `aBc123+xYz/dEf==` | `query = list(...)`로 넘길 때 |
| **Encoding** | `aBc123%2BxYz%2FdEf%3D%3D` | URL 문자열에 직접 붙일 때 |

`%2B` `%2F` `%3D` 처럼 **`%`가 섞여 있는 쪽이 Encoding 키**입니다. 이걸 `query`에 넣으면 이중 인코딩이 되어 인증 오류가 납니다.

> **그런데 Decoding 키로도 인증 오류가 계속 난다면**, 키 안의 `+`나 `/`가 제대로 전달되지 않는 경우입니다. 이때는 URL에 직접 **Encoding 키**를 붙여 우회합니다.
>
> ```r
> full_url <- paste0(url, "?serviceKey=", encoding_key,
>                    "&pageNo=1&numOfRows=100&type=json")
> res <- GET(full_url)
> ```
>
> 두 방식 중 되는 쪽을 쓰면 됩니다. 원인 불명의 인증 오류 대부분이 이 지점입니다.

## STEP6. 응답을 데이터프레임으로

```r
raw <- content(res, as = "text", encoding = "UTF-8")
parsed <- fromJSON(raw)

str(parsed)   # 먼저 구조를 확인합니다
```

공공데이터 API의 JSON은 보통 `response > body > items > item` 처럼 **여러 겹으로 감싸여** 있습니다. `str()`로 구조를 본 뒤 해당 경로를 꺼냅니다.

```r
df <- parsed$response$body$items$item %>% as_tibble()
head(df)
```

XML만 제공하는 API라면 `xml2` 패키지를 씁니다.

```r
library(xml2)
doc <- read_xml(raw)
items <- xml_find_all(doc, ".//item")
```

## STEP7. 응답 코드 확인은 필수

**HTTP 200인데 본문에 에러가 담겨 오는 경우가 많습니다.** `status_code()`만 보고 성공으로 넘기면 안 됩니다.

```r
parsed$response$header$resultCode   # "00"이면 정상
parsed$response$header$resultMsg
```

## 자주 막히는 지점

| 증상 | 원인 | 해결 |
|---|---|---|
| `SERVICE_KEY_IS_NOT_REGISTERED_ERROR` | 승인 직후 전파 대기 | 1시간 뒤 재시도 |
| 시간이 지나도 같은 오류 | Encoding 키를 `query`에 전달 | Decoding 키로 교체, 그래도 안 되면 STEP5 우회 |
| 특정 기능만 실패 | 활용신청 시 상세기능 미체크 | 해당 기능 추가 신청 |
| `fromJSON` 파싱 오류 | XML만 지원하는 API | `xml2`로 전환 |
| 한글이 깨짐 | 인코딩 미지정 | `content(res, encoding = "UTF-8")` |
| `LIMITED_NUMBER_OF_SERVICE_REQUESTS` | 일일 한도 초과 | 다음 날 재시도 또는 운영계정 신청 |

---

## Related Notes

- [1. 공공데이터포털 가입과 API 인증키 발급](public-data-signup.md)
- [Public API](index.md)
