// Google AdSense 게시자 ID (예: "ca-pub-1234567890123456")
// 비어 있으면 광고 스크립트와 ads.txt를 출력하지 않음
export const ADSENSE_CLIENT = "ca-pub-9255417524209137"

// ads.txt 한 줄: google.com, pub-XXXX, DIRECT, f08c47fec0942fa0
export function adsTxtContent(client: string): string {
  const publisherId = client.replace(/^ca-/, "")
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
}
