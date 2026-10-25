// Inputs and arithmetic stay in this browser; this is not a feeding-dose calculation.
export function calculateTreatCost({price, grams, dailyGrams, days}) {
  if (![price, grams, dailyGrams, days].every(Number.isFinite) || price < 0 || grams <= 0 || dailyGrams < 0 || !Number.isInteger(days) || days < 1 || days > 3660) {
    throw new RangeError('가격은 0 이상, 내용량은 0 초과, 하루 사용량은 0 이상, 기간은 1~3,660일의 정수로 입력하세요.');
  }
  const unitCost = price / grams, usedGrams = dailyGrams * days;
  const ratio = usedGrams / grams;
  const nearest = Math.round(ratio);
  const bags = usedGrams === 0 ? 0 : Math.max(1, Math.abs(ratio - nearest) <= Number.EPSILON * Math.max(1, ratio) * 4 ? nearest : Math.ceil(ratio));
  const result = {unitCost, dailyCost: unitCost * dailyGrams, periodCost: unitCost * usedGrams,
    usedGrams, bags, purchaseCost: bags * price, leftoverGrams: Math.max(0, bags * grams - usedGrams),
    bagDays: dailyGrams === 0 ? null : grams / dailyGrams};
  if (Object.values(result).some(value => value !== null && !Number.isFinite(value))) throw new RangeError('숫자가 너무 큽니다. 실제 구매 금액과 중량을 입력하세요.');
  return result;
}
const number = value => new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 2}).format(value);
const won = value => number(value) + '원';
export function mountTreatCalculator(root) {
  const form = root.querySelector('form'), output = root.querySelector('[data-cost-results]'), error = root.querySelector('[data-cost-error]');
  function render(event) {
    event?.preventDefault(); error.textContent = ''; output.hidden = true;
    try {
      const values = Object.fromEntries([...form.querySelectorAll('input')].map(input => {
        input.removeAttribute('aria-invalid');
        if (input.value.trim() === '' || !input.checkValidity()) {
          input.setAttribute('aria-invalid', 'true');
          throw new RangeError('빈칸과 입력 범위를 확인하세요. ' + input.getAttribute('aria-label'));
        }
        return [input.name, Number(input.value)];
      }));
      const common = {dailyGrams: values.daily, days: values.days};
      const results = ['a', 'b'].map(key => calculateTreatCost({...common, price: values[key + 'Price'], grams: values[key + 'Grams']}));
      const rows = [
        ['1g 가격', result => won(result.unitCost)], ['하루 사용 비용', result => won(result.dailyCost)],
        [number(values.days) + '일 사용 비용', result => won(result.periodCost)],
        ['필요한 총 중량', result => number(result.usedGrams) + 'g'],
        ['구매할 봉지 수', result => number(result.bags) + '봉지'], ['제품 결제액', result => won(result.purchaseCost)],
        ['기간 종료 후 남는 양', result => number(result.leftoverGrams) + 'g'],
        ['한 봉지 사용 일수', result => result.bagDays === null ? '사용 없음' : number(result.bagDays) + '일']
      ];
      const table = root.querySelector('[data-cost-table]'); table.replaceChildren();
      for (const [label, format] of rows) {
        const row = document.createElement('tr'), heading = document.createElement('th');
        heading.scope = 'row'; heading.textContent = label; row.append(heading);
        for (const result of results) {const cell = document.createElement('td'); cell.textContent = format(result); row.append(cell);}
        table.append(row);
      }
      const delta = Math.abs(results[0].periodCost - results[1].periodCost);
      const cheaper = results[0].periodCost < results[1].periodCost ? 'A' : 'B';
      root.querySelector('[data-cost-summary]').textContent = delta < 0.005 ? '두 제품의 중량 기준 사용 비용이 같습니다.' : number(values.days) + '일 사용 비용은 ' + cheaper + '가 ' + won(delta) + ' 낮습니다. 영양·적합성이 같다는 뜻은 아닙니다.';
      output.hidden = false;
    } catch (problem) {error.textContent = problem.message;}
  }
  form.addEventListener('submit', render);
  form.addEventListener('input', () => {output.hidden = true; error.textContent = '';});
  form.addEventListener('reset', () => {output.hidden = true; error.textContent = '';});
  render();
}
if (typeof document !== 'undefined') document.querySelectorAll('[data-treat-calculator]').forEach(mountTreatCalculator);
