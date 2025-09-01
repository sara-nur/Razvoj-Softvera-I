import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface SemesterInsertRequest {
  id: number;
  winterSemester: string;
  yearOfStudy: number;
  academicYearId: number;
  description: string;
  tuition: number;
  renewal: boolean;
  studentId: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SemesterInsert implements MyBaseEndpointAsync<SemesterInsertRequest, number> {
  private apiUrl = `${MyConfig.api_address}/semesters`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: SemesterInsertRequest) {
    return this.httpClient.post<number>(`${this.apiUrl}`, request);
  }
}
