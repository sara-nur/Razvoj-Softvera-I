import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface AcademicResponse {
  id: number;
description: string;

}

@Injectable({
  providedIn: 'root'
})
export class AcademicGet implements MyBaseEndpointAsync<void, AcademicResponse[]> {
  private apiUrl = `${MyConfig.api_address}/academic-years`;
  constructor(private httpClient: HttpClient) {
  }

  handleAsync() {
    return this.httpClient.get<AcademicResponse[]>(`${this.apiUrl}`);
  }
}
