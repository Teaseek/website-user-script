import { selectText } from "../utils/dom";

export function isAnimePage(label: string, genres: string[]): boolean {
    return Array.from(document.querySelectorAll('tr')).some(tr => {
        if (selectText('td:first-child', tr) === label) {
            return Array.from(tr.querySelectorAll('td:nth-child(2) a'))
                .some(a => a.textContent !== null && genres.includes(a.textContent.trim()));
        }
        return false;
    });
}

export function getTitles(): string[] {
    const [ruTitle, origTitle] = document.title.split('/')
        .map(t => t.trim() ?? '')
        .filter(Boolean);
    return [origTitle, ruTitle];
}

export function getDetailsCell(): Element | null {
    return document.querySelector('td.item-view');
}