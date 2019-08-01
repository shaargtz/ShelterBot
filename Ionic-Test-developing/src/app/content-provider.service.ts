import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentProviderService {

  constructor(private firebase: AngularFireDatabase) { }

  getList<T>(path: string): Observable<T[]> {
    return this.firebase.list<T[]>(path).snapshotChanges().pipe(
      map(actions =>
        actions.map(action => ({
          key: action.key,
          ...action.payload.exportVal()
        }))
      ));
  }

  getObject<T>(path) {
    return this.firebase.object<T>(path).snapshotChanges().pipe(
      map(action => ({
        key: action.key,
        ...action.payload.exportVal()
      })));
  }

  pushData<T>(path: string, data: any) {
    return this.firebase.database.ref(path).push(data);
  }

  updateData<T>(path: string, data: any) {
    return this.firebase.database.ref(path).update(data);
  }
}
