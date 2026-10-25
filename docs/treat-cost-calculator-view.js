export const treatCalculatorView = `<section class="cost-calculator" data-treat-calculator aria-labelledby="cost-heading">
<h2 id="cost-heading">간식 비용 비교 계산기</h2>
<p>포장지의 가격·내용량과 <strong>실제로 관찰한 사용량</strong>을 넣으세요. 기본값은 계산용 예시이며, 권장 급여량·실제 상품 가격이 아닙니다.</p>
<form><div class="cost-products">
<fieldset><legend>제품 A</legend><label>제품 가격 (원)<input name="aPrice" aria-label="제품 A 가격" type="number" min="0" step="any" value="8000" required inputmode="decimal"></label><label>내용량 (g)<input name="aGrams" aria-label="제품 A 내용량" type="number" min="0.000001" step="any" value="100" required inputmode="decimal"></label></fieldset>
<fieldset><legend>제품 B</legend><label>제품 가격 (원)<input name="bPrice" aria-label="제품 B 가격" type="number" min="0" step="any" value="12000" required inputmode="decimal"></label><label>내용량 (g)<input name="bGrams" aria-label="제품 B 내용량" type="number" min="0.000001" step="any" value="200" required inputmode="decimal"></label></fieldset></div>
<div class="cost-common"><label>같은 기준으로 비교할 하루 사용량 (g)<input name="daily" aria-label="하루 사용량" type="number" min="0" step="any" value="5" required inputmode="decimal"></label><label>계산 기간 (일)<input name="days" aria-label="계산 기간" type="number" min="1" max="3660" step="1" value="30" required inputmode="numeric"></label></div>
<p>서로 다른 간식에 같은 무게가 적합하다는 뜻은 아닙니다. 열량·건강 상태에 맞춘 급여 계획을 먼저 확인하세요.</p>
<button type="submit">비용 비교하기</button> <button type="reset">예시로 초기화</button></form>
<p role="alert" data-cost-error></p><div data-cost-results aria-live="polite" hidden><p data-cost-summary></p><div class="cost-table-wrap"><table><caption>동일 중량 사용 가정 · 배송비 제외 · 기보유 재고 0</caption><thead><tr><th scope="col">항목</th><th scope="col">제품 A</th><th scope="col">제품 B</th></tr></thead><tbody data-cost-table></tbody></table></div><p>‘사용 비용’은 사용한 양의 값입니다. ‘제품 결제액’은 필요한 봉지를 새로 살 때의 금액이라 다를 수 있습니다. 결제액에는 배송비를 주문당 한 번 더하세요. 개봉 후 보관 기간은 이 계산으로 판단할 수 없습니다. 금액은 소수 둘째 자리까지 반올림합니다.</p></div>
<noscript><p>자동 계산은 자바스크립트를 켜면 사용할 수 있습니다. 아래 공식과 예제로 직접 계산할 수 있습니다.</p></noscript>
<p class="cost-private">계산기는 입력값을 서버로 전송하거나 저장하지 않습니다.</p></section>`;
