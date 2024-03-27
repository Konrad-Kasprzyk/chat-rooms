import Task from "common/clientModels/task.model";
import { Observable } from "rxjs";

export default function listenTasks(): Observable<Task[]> {
  return new Observable<Task[]>();
}
