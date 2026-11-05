/*
 * 상담 버튼 클릭을 메타 픽셀 "Contact"(문의) 이벤트로 보냅니다.
 * - 네이버 예약 링크(naver.me, booking.naver.com) → contact_method: naver_booking
 * - 전화(tel:) → contact_method: phone
 * - 카카오톡 채널 상담(pf.kakao.com) → contact_method: kakao
 * 네이버 리뷰·지도·카페 링크는 상담이 아니므로 보내지 않습니다.
 */
(function (root) {
  function classifyContactLink(href) {
    if (!href) return null;
    var value = String(href).trim();
    if (/^tel:/i.test(value)) return 'phone';
    var url;
    try {
      url = new URL(value, 'https://lccthebox.github.io/');
    } catch (error) {
      return null;
    }
    var host = url.hostname.toLowerCase();
    if (host === 'naver.me' || host === 'booking.naver.com' || host === 'm.booking.naver.com') return 'naver_booking';
    if (host === 'pf.kakao.com') return 'kakao';
    return null;
  }

  function labelOf(link) {
    var text = (link.getAttribute('title') || link.textContent || '').replace(/\s+/g, ' ').trim();
    return text.slice(0, 60);
  }

  function handleClick(event) {
    var target = event.target;
    var link = target && target.closest ? target.closest('a[href]') : null;
    if (!link) return;
    var method = classifyContactLink(link.getAttribute('href'));
    if (!method) return;
    if (typeof root.fbq !== 'function') return;
    root.fbq('track', 'Contact', {
      contact_method: method,
      content_name: labelOf(link),
      page_path: root.location ? root.location.pathname : ''
    });
  }

  var api = { classifyContactLink: classifyContactLink, handleClick: handleClick };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root && root.document && root.document.addEventListener) {
    root.document.addEventListener('click', handleClick, true);
    root.TheBoxContactEvents = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
