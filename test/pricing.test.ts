import { describe, expect, it } from 'vitest';
import { parsePrice, resultLimit } from '../src/utils/pricing';

import { pressTheResult } from '../src/utils/helper';

describe('marketplace price boundaries', () => {
  it.each([['1.299,90 TL', 1299.9], ['₺ 9,50', 9.5], ['42', 42], ['1.000', 1000], ['1\u00a0299,90 TL', 1299.9]])('parses %s without dropping decimals', (text, expected) => {
    expect(parsePrice(text)).toBe(expected);
  });
  it.each(['', 'free', '1.23,99', '12,345', 'Infinity', '-20', '1,2,3'])('rejects invalid price %s', (text) => {
    expect(Number.isNaN(parsePrice(text))).toBe(true);
  });
  it('reads a bounded current result count', () => {
    expect(resultLimit('3')).toBe(3);
    expect(resultLimit('200')).toBe(100);
    for (const value of ['0', '-1', '1.5', '', 'bad', undefined]) expect(resultLimit(value)).toBe(30);
  });
  it('uses the edited result limit and renders hostile titles as plain text', () => {
    document.body.innerHTML = '<div id="container-min"></div><div id="container-max"></div><input id="search-count" value="30">';
    const input = document.querySelector<HTMLInputElement>('#search-count')!;
    input.value = '1';
    const data = [
      { price: 3.5, rating: 4, title: '<img src=x onerror=alert(1)>', rectY: 0 },
      { price: 5, rating: 0, title: 'Second product', rectY: 10 },
    ];
    pressTheResult(data);
    expect(document.querySelectorAll('#list-min li')).toHaveLength(1);
    expect(document.querySelector('#list-min img')).toBeNull();
    expect(document.querySelector('#list-min')?.textContent).toContain('<img');
    input.value = '2';
    pressTheResult(data);
    expect(document.querySelectorAll('#list-min li')).toHaveLength(2);
  });
});
