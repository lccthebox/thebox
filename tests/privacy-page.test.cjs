// 실행: node --test tests/privacy-page.test.cjs
// 메타 신청서에 넣는 개인정보처리방침 주소(privacy.html)가 실제 수집 항목·위탁 내용과 맞는지 지킨다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const privacy = read('privacy.html');

test('개인정보처리방침 페이지에 신청서 수집 항목이 있다', () => {
  assert.match(privacy, /필수 항목: 이름, 휴대전화번호/);
  assert.match(privacy, /메타\(인스타그램·페이스북\) 광고의 상담 신청서/);
});

test('알림톡 발송 위탁과 메타 신청서 접수가 위탁 항목에 있다', () => {
  assert.match(privacy, /솔라피\(SOLAPI\)/);
  assert.match(privacy, /카카오 알림톡·문자 발송/);
  assert.match(privacy, /Meta Platforms, Inc\./);
});

test('개인정보보호책임자 연락처와 시행일이 있다', () => {
  assert.match(privacy, /개인정보보호책임자: 임현주/);
  assert.match(privacy, /시행일: \d{4}년 \d{1,2}월 \d{1,2}일/);
});

test('개인정보처리방침 페이지에는 광고 추적 코드를 넣지 않는다', () => {
  assert.doesNotMatch(privacy, /fbq\(|googletagmanager|meta-contact-events\.js/);
});

for (const page of ['academy.html', 'intro.html']) {
  const html = read(page);
  test(`${page}: 팝업 방침도 같은 수집 항목을 쓰고 전문 페이지로 연결된다`, () => {
    assert.doesNotMatch(html, /학생 이름, 학부모 연락처, 학년/);
    assert.match(html, /필수 항목: 이름, 휴대전화번호/);
    assert.match(html, /href="privacy\.html"/);
  });
}
