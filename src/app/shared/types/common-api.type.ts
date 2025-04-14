export interface ApiResponse<T extends object | string> {
  statusCode: number
  message: string
  data: T
}

export interface GridApiResponse<
  T,
  AType extends 'metaData' = 'metaData',
  MType extends Record<string, unknown> = Record<string, unknown>,
> {
  statusCode: number
  message: string
  data: RowsData<T, AType, MType>
}

export type RowsData<T, AType, MType> = (AType extends 'metaData'
  ? {
      metaData: MType
    }
  : NonNullable<object>) & {
  totalCount: number
  count: number
  rows: T
}

export interface VoidApiResponse {
  statusCode: number
  message: string
}
