import { insertShikimoriViewRating, insertShikimoriPosterRating, insertShikimoriListRating } from "./main";

function observeDetailsPage(cb: () => void): void {
    cb();
    new MutationObserver(cb).observe(document.body, { childList: true, subtree: true });
}

observeDetailsPage(async() => {

    Promise.allSettled([
        insertShikimoriListRating(),
        insertShikimoriPosterRating(),
        insertShikimoriViewRating()
    ]);
});