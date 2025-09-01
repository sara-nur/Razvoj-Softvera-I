import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { buildHttpParams } from '../../helper/http-params.helper';


export interface StudentDeleteRequest {
  studentId: number;
  deletedByUserId: number;
}

@Injectable({
  providedIn: 'root'
})

export class StudentDeleteEndpointService implements MyBaseEndpointAsync<StudentDeleteRequest, void> {
  private apiUrl = `${MyConfig.api_address}/students`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: StudentDeleteRequest) {
    const params = buildHttpParams(request);
    return this.httpClient.delete<void>(`${this.apiUrl}`, {params});
  }
}
