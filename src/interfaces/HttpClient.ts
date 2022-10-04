export interface HttpClient {
    get<T>(url: string): Promise<T>
    delete<T>(url: string): Promise<T>
    post<Q, A>(url: string, payload: Q): Promise<A>
    put<Q, A>(url: string, payload: Q): Promise<A>
}