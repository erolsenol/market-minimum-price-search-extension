export interface ProductLabel {
  readonly price: number;
  readonly rating: number;
  readonly title?: string | null;
  readonly rectY: number;
}

/** Marketplace prices use Turkish separators; never truncate decimal kuruş. */
export function parsePrice(text: string): number {
  const normalized = text.replace(/(?:TL|₺)/gi, '').replace(/\s/g, '').trim();
  if (!/^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?$/.test(normalized)) return Number.NaN;
  return Number(normalized.replaceAll('.', '').replace(',', '.'));
}

export function resultLimit(value: string | undefined): number {
  const limit = Number(value);
  return Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 30;
}

export function productLabel(item: ProductLabel): string {
  return `Price: ${item.price} -- ${item.rating ? `★${item.rating}` : ''} -- Title: ${item.title ?? ''} y: ${item.rectY}`;
}
