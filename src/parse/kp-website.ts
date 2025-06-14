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

export function getTitles(from: 'title' | 'item-info' = 'title', element?: Element): string[] {
    let [origTitle, ruTitle]: string | undefined[] = [undefined, undefined];

    switch (from) {
        case 'item-info': {
            if (!element) break;
            const itemInfo = element.querySelector('.item-info');
            if (!itemInfo) break;

            const titleElement = itemInfo.querySelector('.item-title a');
            const authorElement = itemInfo.querySelector('.item-author a');
            if (titleElement) {
                ruTitle = titleElement.getAttribute('title')?.trim();
            }
            if (authorElement) {
                origTitle = authorElement.getAttribute('title')?.trim();
            }
            break;
        }
        case 'title': {
            [ruTitle, origTitle] = document.title.split('/')
                .map(t => t.trim() ?? undefined)
            break;
        }
    }

    return [origTitle, ruTitle].filter(t => t !== undefined);
}

export function getViewRatingBadgeContainer(): Element | null {
    return document.querySelector('td.item-view');
}

export function getItemPosterRatingBadgeContainer(element: Element): Element | null {
    return element.querySelector('.bottomcenter-2x .label');
}

export function getItemPosterRatingContainers(): HTMLElement[] | null {
    const selector = '.item-poster';
    return Array.from(document.querySelectorAll(selector))
        .filter(el => el.textContent?.trim() !== '')
        .map(el => el.parentElement)
        .filter(el => el !== null);
}


export function getItemListRatingBadgeContainer(element: Element): Element | null {
    return element.querySelector('.item-info .list-inline');
}

export function getItemListRatingContainers(): HTMLElement[] | null {
    const selector = '.item > .item-info';

    return Array.from(document.querySelectorAll(selector))
        .filter(el => el.textContent?.trim() !== '')
        .map(el => el.parentElement?.parentElement)
        .filter(el => el !== null && el !== undefined);
}