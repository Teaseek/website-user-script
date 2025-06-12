export function formatVotes(num: string | number): string {
    const n = typeof num === 'string' ? Number(num.replace(/[^\d.-]/g, '')) : num;
    if (!Number.isFinite(n)) return '0';
    return n.toLocaleString('en-US');
}

export function formatRating(rating: string | number): string {
    const n = typeof rating === 'string' ? Number(rating.replace(',', '.')) : rating;
    if (!Number.isFinite(n)) return '0';
    return n.toString().replace('.', ',');
}