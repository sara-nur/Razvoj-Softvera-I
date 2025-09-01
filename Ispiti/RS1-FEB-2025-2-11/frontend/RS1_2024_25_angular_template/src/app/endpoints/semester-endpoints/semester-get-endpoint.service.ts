import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface SemesterGetResponse {
  id: number;
  winterSemester: string;
  yearOfStudy: number;
  academicYearId: number;
  description: string;
  tuition: number;
  renewal: boolean;
  studentId: number;
  recordedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class SemesterGetService implements MyBaseEndpointAsync<number, SemesterGetResponse[]> {
  private apiUrl = `${MyConfig.api_address}/semesters`;
  constructor(private httpClient: HttpClient) {
  }
  handleAsync(id: number) {
    return this.httpClient.get<SemesterGetResponse[]>(`${this.apiUrl}/${id}`);
  }
}
