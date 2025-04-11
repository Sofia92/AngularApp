/**
 * 本文件定义所有后端接口的DTO
 */

export interface IResponse<T> {
  _APIFail_?: boolean;
  isSucceed?: boolean;
  detail?: string;
  message?: string;
  data: T;
}


export interface AccountDTO {
  id?: string
  code?: string
  name?: string
  orgId?: string
  orgName?: string
  admin?: boolean
  accessToken?: string
  zdysCode?: string
  userComputerInfo?: { ipAddress: string }
}
