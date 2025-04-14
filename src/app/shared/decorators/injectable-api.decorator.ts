import { HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ForceAny } from '@shared/types'

export interface ApiServiceMetaData {
  version: `v${number}`
  baseSegment: string
  prefix: string
  httpOptions: {
    headers: HttpHeaders
  }
}

type ApiServiceInjectableMetaData = Partial<ApiServiceMetaData> & {
  providedIn?: Injectable['providedIn']
}

/**
 * Decorator to add the API service metadata and make it injectable.
 */
export function InjectableApi(metadata: ApiServiceInjectableMetaData) {
  return function (target: ForceAny): ForceAny {
    @Injectable({ providedIn: metadata.providedIn ?? null })
    class InnerClass extends target {
      constructor() {
        super()

        if (metadata.baseSegment) {
          this['baseSegment'] = metadata.baseSegment
        }

        if (metadata.prefix) {
          this['prefix'] = metadata.prefix
        }

        if (metadata.version) {
          this['version'] = metadata.version
        }
        if (metadata.httpOptions) {
          this['httpOptions'] = metadata.httpOptions
        }
      }
    }
    return InnerClass
  }
}
