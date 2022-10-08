import { HttpClient } from "../../interfaces/internal/HttpClient";

export class XhrClient implements HttpClient {
  delete<T>(url: string): Promise<T> {
    throw new Error("not implemented");
  }

  get<T>(url: string): Promise<T> {
    throw new Error("not implemented");
  }

  async post<Q, A>(url: string, payload: Q): Promise<A> {
    return new Promise((resolve, reject) => {
      const http = new XMLHttpRequest();
      http.open("POST", url, true);

      http.onreadystatechange = function () {
        //Call a function when the state changes.
        if (http.readyState == 4) {
          if (http.status < 300) {
            resolve(JSON.parse(http.responseText));
          } else {
            reject(http.responseText);
          }
        }
      };
      http.send(JSON.stringify(payload));
    });
  }

  put<Q, A>(url: string, payload: Q): Promise<A> {
    throw new Error("not implemented");
  }
}
