import { HttpClient, HttpEvent, HttpHeaders, HttpResponse, HttpXhrBackend } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { ForceAny } from '@shared/types'
import { catchError, map, Observable, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'

/**
 * HTTP method types supported by this service
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Options for API requests
 */
interface RequestOptions {
  ignoreBaseSegment?: boolean
  customHeaders?: HttpHeaders | null
  customUrl?: string
  headers?: Record<string, string>
}

/**
 * Response from file export operations
 */
interface FileExportResponse {
  blob: Blob
  fileName: string | null
}

/**
 * Service for handling API requests with configurable base URL, version, and headers.
 *
 * This service provides methods for making HTTP requests to REST APIs with
 * consistent URL construction, header management, and error handling.
 */
@Injectable()
export class ApiService {
  /**
   * The API prefix to use in URL construction
   * @default 'api'
   */
  prefix = 'api'

  /**
   * The API version to use in URL construction
   * @default 'v1'
   */
  version: `v${number}` = 'v1'

  /**
   * The base segment to append to all API URLs
   * @default ''
   */
  baseSegment = ''

  /**
   * Default HTTP headers to include with all requests
   */
  httpOptions = {
    headers: new HttpHeaders({}),
  }

  /**
   * Standard HttpClient for most API calls
   */
  http = inject(HttpClient)

  /**
   * Base URL for the API, pulled from environment config
   */
  baseUrl = environment.base_url

  /**
   * XHR-based HttpClient for progress tracking
   *
   * XHR is used specifically for upload progress tracking since the Fetch API
   * doesn't support detailed progress events in the same way.
   */
  private xhrHttpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }))

  /**
   * Updates the service's HTTP headers with new values
   *
   * @param headers - Record of header key-value pairs to set
   */
  setHeaders(headers: Record<string, string> = {}): void {
    let updatedHeaders = this.httpOptions.headers

    Object.entries(headers).forEach(([key, value]) => {
      // every method (set,delete) will return new instance of HttpHeaders
      updatedHeaders = updatedHeaders.set(key, value)
    })

    this.httpOptions.headers = updatedHeaders
  }

  /**
   * Constructs the base URL for API requests
   *
   * @param ignoreBaseSegment - Whether to exclude the baseSegment in the URL
   * @returns The full base URL for API requests
   */
  getBaseUrl(ignoreBaseSegment = false): string {
    return `${this.baseUrl}/${this.prefix}/${this.version}${
      this.baseSegment && !ignoreBaseSegment ? `/${this.baseSegment}` : ''
    }`
  }

  /**
   * Makes a POST request to the API
   *
   * @param apiRoute - The API endpoint path
   * @param body - The request payload
   * @param options - Optional request configuration
   * @returns Observable of the response data
   */
  post<TData, TRes extends object = ForceAny>(
    apiRoute: string,
    body: TData,
    options: RequestOptions = {},
  ): Observable<TRes> {
    const { customHeaders, ignoreBaseSegment = false, headers = {} } = options
    this.setHeaders(headers)

    const finalHeaders = customHeaders || this.httpOptions.headers
    const url = `${this.getBaseUrl(ignoreBaseSegment)}${apiRoute}`

    return this.http
      .post<TRes>(url, body, { headers: finalHeaders })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Makes a POST request with progress tracking
   *
   * @param apiRoute - The API endpoint path
   * @param body - The request payload
   * @param options - Optional request configuration
   * @returns Observable of HttpEvents including upload progress
   */
  postUpdateProgress<TData, TRes extends object = ForceAny>(
    apiRoute: string,
    body: TData,
    options: RequestOptions = {},
  ): Observable<HttpEvent<TRes>> {
    const { customHeaders, customUrl } = options
    const headers = customHeaders || this.httpOptions.headers
    const url = `${customUrl || this.getBaseUrl()}${apiRoute}`

    return this.xhrHttpClient.post<TRes>(url, body, {
      headers,
      observe: 'events',
      reportProgress: true,
    })
  }

  /**
   * Makes a PUT request with progress tracking
   *
   * @param apiRoute - The API endpoint path
   * @param body - The request payload
   * @param options - Optional request configuration
   * @returns Observable of HttpEvents including upload progress
   */
  putUpdateProgress<TData, TRes extends object = ForceAny>(
    apiRoute: string,
    body: TData,
    options: RequestOptions = {},
  ): Observable<HttpEvent<TRes>> {
    const { customHeaders, customUrl } = options
    const headers = customHeaders || this.httpOptions.headers
    const url = `${customUrl || this.getBaseUrl()}${apiRoute}`

    return this.xhrHttpClient.put<TRes>(url, body, {
      headers,
      observe: 'events',
      reportProgress: true,
    })
  }

  /**
   * Makes a POST request and returns the full HTTP response
   *
   * @param apiRoute - The API endpoint path
   * @param body - The request payload
   * @param customHeaders - Optional custom headers
   * @returns Observable of the full HTTP response
   */
  headersPostRequest<TData, TRes extends object = ForceAny>(
    apiRoute: string,
    body: TData,
    customHeaders?: HttpHeaders,
  ): Observable<HttpResponse<TRes>> {
    const headers = customHeaders || this.httpOptions.headers
    const url = `${this.getBaseUrl()}${apiRoute}`

    return this.http.post<HttpResponse<TRes>>(url, body, {
      headers,
      observe: 'response' as 'body',
    })
  }

  /**
   * Makes a GET request and returns the full HTTP response
   *
   * @param apiRoute - The API endpoint path
   * @returns Observable of the full HTTP response
   */
  headersGetRequest<TRes extends object>(apiRoute: string): Observable<HttpResponse<TRes>> {
    const headers = this.httpOptions.headers
    const url = `${this.getBaseUrl()}${apiRoute}`

    return this.http
      .get<HttpResponse<TRes>>(url, {
        headers,
        observe: 'response' as 'body',
      })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Makes a GET request to the API
   *
   * @param apiRoute - The API endpoint path
   * @param ignoreBaseSegment - Whether to exclude the baseSegment in the URL
   * @param headers - Optional headers to include
   * @returns Observable of the response data
   */
  get<TRes extends object>(
    apiRoute: string,
    ignoreBaseSegment = false,
    headers: Record<string, string> = {},
  ): Observable<TRes> {
    this.setHeaders(headers)
    const url = `${this.getBaseUrl(ignoreBaseSegment)}${apiRoute}`

    return this.http
      .get<TRes>(url, { headers: this.httpOptions.headers })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Makes a PUT request to the API
   *
   * @param apiRoute - The API endpoint path
   * @param body - The request payload
   * @param headers - Optional headers to include
   * @returns Observable of the response data
   */
  put<TData, TRes extends object = ForceAny>(
    apiRoute: string,
    body: TData,
    headers: Record<string, string> = {},
  ): Observable<TRes> {
    this.setHeaders(headers)
    const url = `${this.getBaseUrl()}${apiRoute}`

    return this.http
      .put<TRes>(url, body, { headers: this.httpOptions.headers })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Makes a PATCH request to the API
   *
   * @param apiRoute - The API endpoint path
   * @param body - The request payload
   * @returns Observable of the response data
   */
  patch<TData, TRes extends object = ForceAny>(apiRoute: string, body: TData): Observable<TRes> {
    const url = `${this.getBaseUrl()}${apiRoute}`

    return this.http
      .patch<TRes>(url, body, { headers: this.httpOptions.headers })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Makes a DELETE request to the API
   *
   * @param apiRoute - The API endpoint path
   * @returns Observable of the response data
   */
  delete<TRes extends object = ForceAny>(apiRoute: string): Observable<TRes> {
    const url = `${this.getBaseUrl()}${apiRoute}`

    return this.http
      .delete<TRes>(url, { headers: this.httpOptions.headers })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Makes a configurable HTTP request with any supported method
   *
   * @param method - The HTTP method to use
   * @param apiRoute - The API endpoint path
   * @param body - The request payload (for POST/PUT/PATCH)
   * @param ignoreBaseSegment - Whether to exclude the baseSegment in the URL
   * @param headers - Optional headers to include
   * @returns Observable of the response data
   */
  multiTypeRequest<TRes extends object>(
    method: HttpMethod,
    apiRoute: string,
    body: Record<string, unknown> = {},
    ignoreBaseSegment = false,
    headers: Record<string, string> = {},
  ): Observable<TRes> {
    this.setHeaders(headers)
    const url = `${this.getBaseUrl(ignoreBaseSegment)}${apiRoute}`

    return this.http
      .request<TRes>(method, url, {
        headers: this.httpOptions.headers,
        body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : null,
      })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Constructs a query string from parameter objects
   *
   * @param queries - Array of objects containing query parameters
   * @returns Formatted URL query string with '?' prefix
   */
  makeQueryParams<T extends string | number | boolean | undefined = string, DType extends object = object>(
    queries: (DType extends object ? DType : Record<string, T>)[],
  ): string {
    if (!queries) return ''

    const resQueries = Array.isArray(queries) ? queries : [queries]
    if (resQueries.length === 0) return ''

    const queryObj: Record<string, T[]> = {}

    resQueries.forEach((query) => {
      for (const key in query) {
        if (Object.prototype.hasOwnProperty.call(query, key)) {
          const currValue = query[key]

          if (typeof currValue === 'boolean' || typeof currValue === 'string' || typeof currValue === 'number') {
            queryObj[key] = queryObj[key] ?? []
            queryObj[key].push(currValue as T)
          } else if (Array.isArray(currValue)) {
            queryObj[key] = queryObj[key] ?? []
            queryObj[key].push(currValue.join(',') as T)
          }
        }
      }
    })

    const queryStr = Object.entries(queryObj)
      .map(([key, value]) => `${key}=${value.join(',')}`)
      .join('&')

    return queryStr.length ? `?${queryStr}` : ''
  }

  /**
   * Makes a request to a different domain/external API
   *
   * @param method - The HTTP method to use
   * @param url - The complete URL to request
   * @param body - The request payload (for POST/PUT/PATCH)
   * @returns Observable of the response data
   */
  otherDomainApiCall<TRes extends object, TData = ForceAny>(
    method: HttpMethod,
    url: string,
    body?: TData,
  ): Observable<TRes> {
    return this.http
      .request<TRes>(method, url, {
        body,
        headers: this.httpOptions.headers,
      })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Exports data as a blob (typically for file downloads)
   *
   * @param apiRoute - The API endpoint path
   * @param customUrl - Optional complete URL to override default URL construction
   * @returns Observable of the Blob data
   */
  exportData(apiRoute: string, customUrl?: string): Observable<Blob> {
    const url = customUrl ?? `${this.getBaseUrl()}${apiRoute}`

    return this.http
      .request('GET', url, {
        headers: this.httpOptions.headers,
        responseType: 'blob',
      })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Exports data via POST request as a blob
   *
   * @param apiRoute - The API endpoint path
   * @param body - The request payload
   * @returns Observable of the Blob data
   */
  exportPostData(apiRoute: string, body: ForceAny): Observable<Blob> {
    const url = `${this.getBaseUrl()}${apiRoute}`

    return this.http
      .request('POST', url, {
        body,
        headers: this.httpOptions.headers,
        responseType: 'blob',
      })
      .pipe(catchError((error) => throwError(() => error)))
  }

  /**
   * Exports data via POST request as a blob with filename extraction
   *
   * @param apiRoute - The API endpoint path
   * @param body - The request payload
   * @param headers - Optional headers to include
   * @returns Observable containing the blob and extracted filename
   */
  exportPostDataV2(
    apiRoute: string,
    body: ForceAny,
    headers: Record<string, string> = {},
  ): Observable<FileExportResponse> {
    this.setHeaders(headers)
    const url = `${this.getBaseUrl()}${apiRoute}`

    return this.http
      .request('POST', url, {
        body,
        headers: this.httpOptions.headers,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<Blob>) => {
          const contentDisposition = response.headers.get('Content-Disposition')
          const fileName = this.getFileNameFromContentDisposition(contentDisposition)
          return { blob: response.body as Blob, fileName }
        }),
        catchError((error) => throwError(() => error)),
      )
  }

  /**
   * Initializes headers with client ID for user identification
   *
   * @param clientId - The client identifier to include in headers
   */
  initHeaders(clientId: string): void {
    this.setHeaders({ 'user-info': JSON.stringify({ clientId }) })
  }

  /**
   * Extracts filename from Content-Disposition header
   *
   * @param contentDisposition - Content-Disposition header value
   * @returns The extracted filename or null if not found
   * @private
   */
  private getFileNameFromContentDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null
    const matches = /filename="([^"]+)"/.exec(contentDisposition)
    return matches ? matches[1] : null
  }
}
