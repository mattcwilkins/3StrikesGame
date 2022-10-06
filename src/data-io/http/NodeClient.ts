import { HttpClient } from "../../interfaces/internal/HttpClient";
import { IncomingMessage } from "http";

const https = require("https");

export class NodeClient implements HttpClient {
  public get<T>(url: string): Promise<T> {
    return this.makeRequest(url, "GET");
  }

  public delete<T>(url: string): Promise<T> {
    return this.makeRequest(url, "DELETE");
  }

  public post<Q, A>(url: string, payload: Q): Promise<A> {
    return this.makeRequest(url, "POST");
  }

  public put<Q, A>(url: string, payload: Q): Promise<A> {
    return this.makeRequest(url, "PUT");
  }

  private makeRequest<Q, A>(
    _url: string | URL,
    method: string,
    payload?: Q
  ): Promise<A> {
    const url = typeof _url === "string" ? new URL(_url) : (_url as URL);

    return new Promise((resolve, reject) => {
      const request = https.request(
        {
          host: url.hostname,
          path: url.href,
          searchParams: url.searchParams,
          method,
          headers: {},
        },
        (incomingMessage: IncomingMessage) => {
          let buffer = "";

          //another chunk of data has been received, so append it to `str`
          incomingMessage.on("data", (chunk: string) => {
            buffer += chunk;
          });

          incomingMessage.on("end", () => {
            try {
              resolve(JSON.parse(buffer) as A);
            } catch (e) {
              console.error(e);
              resolve(buffer as A);
            }
          });

          incomingMessage.on("error", (err) => {
            reject(err);
          });
        }
      );
      if (payload) {
        request.write(payload);
      }
      request.end();
    });
  }
}
