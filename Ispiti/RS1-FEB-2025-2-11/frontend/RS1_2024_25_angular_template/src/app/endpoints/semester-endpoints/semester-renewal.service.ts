import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyPagedRequest} from '../../helper/my-paged-request';
import {MyConfig} from '../../my-config';
import {buildHttpParams} from '../../helper/http-params.helper';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyPagedList} from '../../helper/my-paged-list';

// DTO za zahtjev
export interface RenewalRequest {
  studentId:number;
  yearOfStudy:number;
}


export interface RenewalResponse {
  renewal:boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Renewal
  implements MyBaseEndpointAsync<RenewalRequest, RenewalResponse>{
  private apiUrl = `${MyConfig.api_address}/renewal`;
  constructor(private httpClient: HttpClient) {
  }
  handleAsync(request: RenewalRequest) {
    const params = buildHttpParams(request);
    return this.httpClient.get<RenewalResponse>(`${this.apiUrl}`, {params});
  }
}
