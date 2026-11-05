// 실행: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { classifyContactLink, handleClick } = require('../meta-contact-events.js');

const ROOT = path.join(__dirname, '..');
const LANDING_PAGES = ['academy.html', 'intro.html'];

test('상담 링크 종류를 구분한다', () => {
  assert.equal(classifyContactLink('tel:010-8673-9664'), 'phone');
  assert.equal(classifyContactLink('https://naver.me/5BcFp4RM'), 'naver_booking');
  assert.equal(classifyContactLink('https://naver.me/GdyGWbSC'), 'naver_booking');
  assert.equal(classifyContactLink('https://booking.naver.com/booking/6/bizes/1'), 'naver_booking');
  assert.equal(classifyContactLink('http://pf.kakao.com/_lJpxjT/chat'), 'kakao');
});

test('리뷰·지도·카페·페이지 안 링크는 상담으로 세지 않는다', () => {
  assert.equal(classifyContactLink('https://map.naver.com/p/entry/place/35708073?placePath=/review/visitor'), null);
  assert.equal(classifyContactLink('https://pcmap.place.naver.com/place/1742045734/review/visitor'), null);
  assert.equal(classifyContactLink('https://cafe.naver.com/theboxis'), null);
  assert.equal(classifyContactLink('#programs'), null);
  assert.equal(classifyContactLink('direction/'), null);
  assert.equal(classifyContactLink(''), null);
});

function fakeClick(href, text) {
  const link = {
    getAttribute: (name) => (name === 'href' ? href : null),
    textContent: text,
  };
  // 버튼 안의 아이콘(svg)을 눌러도 바깥 링크를 찾는지 흉내 낸다
  return { target: { closest: () => link } };
}

test('상담 버튼을 누르면 Contact 이벤트를 한 번 보낸다', () => {
  const calls = [];
  globalThis.fbq = (...args) => calls.push(args);
  globalThis.location = { pathname: '/thebox/academy.html' };
  try {
    handleClick(fakeClick('https://naver.me/5BcFp4RM', '  청강하고\n 수강등록하기 '));
    handleClick(fakeClick('https://cafe.naver.com/theboxis', '카페'));
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], [
      'track',
      'Contact',
      { contact_method: 'naver_booking', content_name: '청강하고 수강등록하기', page_path: '/thebox/academy.html' },
    ]);
  } finally {
    delete globalThis.fbq;
    delete globalThis.location;
  }
});

test('픽셀이 아직 없으면 오류 없이 넘어간다', () => {
  assert.doesNotThrow(() => handleClick(fakeClick('tel:010-8673-9664', '전화 문의')));
});

for (const page of LANDING_PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');

  test(`${page}: 픽셀은 한 번만 켜고 방문도 한 번만 보낸다`, () => {
    assert.equal((html.match(/fbq\('init'/g) || []).length, 1);
    assert.equal((html.match(/fbq\('track', 'PageView'\)/g) || []).length, 1);
  });

  test(`${page}: 상담 이벤트 스크립트를 불러온다`, () => {
    assert.match(html, /<script src="meta-contact-events\.js" defer><\/script>/);
  });

  test(`${page}: 상담 버튼(네이버 예약·전화·카카오톡)이 모두 상담으로 잡힌다`, () => {
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    const contactLike = hrefs.filter((h) => /^tel:|naver\.me|pf\.kakao\.com/i.test(h));
    assert.ok(contactLike.length > 0, '상담 링크가 하나도 없음');
    for (const href of contactLike) {
      assert.notEqual(classifyContactLink(href), null, href);
    }
  });
}
