import { insertShikimoriViewRating, insertShikimoriPosterRating } from "./main";

function observeDetailsPage(cb: () => void): void {
    cb();
    new MutationObserver(cb).observe(document.body, { childList: true, subtree: true });
}

observeDetailsPage(async() => {
    try {   
        await insertShikimoriViewRating();
    } catch (error) {
        console.error('Error inserting Shikimori view rating:', error);
    }

    try {
        await insertShikimoriPosterRating();
    } catch (error) {
        console.error('Error inserting Shikimori poster rating:', error);
    }
});