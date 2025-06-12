import { insertShikiRating } from "./main";

function observeDetailsPage(cb: () => void): void {
    cb();
    new MutationObserver(cb).observe(document.body, { childList: true, subtree: true });
}

observeDetailsPage(insertShikiRating);