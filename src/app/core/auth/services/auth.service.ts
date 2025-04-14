import { InjectableApi } from '@shared/decorators'
import { ApiService } from '@shared/services'
import { ApiResponse } from '@shared/types'

@InjectableApi({})
export class AuthService extends ApiService {
  getSideBarImg(domainName: string) {
    return this.get<ApiResponse<{ sideBarImage: string }>>(`/organization/side-bar-image?domain=${domainName}`)
  }
}
