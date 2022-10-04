import { HttpClient } from "../interfaces/HttpClient";

export class XhrClient implements HttpClient {
  delete<T>(url: string): Promise<T> {
    throw new Error("not implemented");
  }

  get<T>(url: string): Promise<T> {
    throw new Error("not implemented");
  }

  post<Q, A>(url: string, payload: Q): Promise<A> {
    throw new Error("not implemented");
  }

  put<Q, A>(url: string, payload: Q): Promise<A> {
    throw new Error("not implemented");
  }
}
