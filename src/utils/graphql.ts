import { fetchAdapter } from "./fetchAdapter";

interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
    }>;
    extensions?: Record<string, unknown>;
}

export async function graphqlRequest<T>(
    graphqlHost: string,
    query: string,
    variables?: Record<string, unknown>
): Promise<T> {
    const response = await fetchAdapter<GraphQLResponse<T>>({
        url: graphqlHost,
        method: "POST",
        responseType: 'json',
        body: JSON.stringify({ query, variables }),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
    });

    if (response.errors) {
        const errorMessages = response.errors.map((error) => error.message).join(", ");
        throw new Error(`GraphQL errors: ${errorMessages}`);
    }
    if (!response.data) {
        throw new Error("No data returned from GraphQL request");
    }

    return response.data;
}