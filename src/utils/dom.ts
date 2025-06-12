export function selectText(selector: string, context: Document | Element = document): string {
    const el = context.querySelector(selector);
    return el?.textContent?.trim() ?? '';
}
