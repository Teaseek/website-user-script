import { retry } from "../../utils/retry";
import { graphqlRequest } from "../../utils/graphql";
import { RetryOptions } from "../../utils/retry";
import { AnimeBySearchQuery, AnimeBySearchQueryVariables } from "./graphql.gen";
import AnimeBySearchDocument from "./query/animeBySearch.graphql";

declare const __SHIKIMORI_API_HOST__: string;

export async function searchAnime(variables: AnimeBySearchQueryVariables, retryOptions?: RetryOptions): Promise<AnimeBySearchQuery["animes"]> {
    const graphqlHost = `https://${__SHIKIMORI_API_HOST__}`;
    
    const result = await retry(() => graphqlRequest<AnimeBySearchQuery>(graphqlHost, AnimeBySearchDocument, variables), retryOptions);
    return result.animes;
}
