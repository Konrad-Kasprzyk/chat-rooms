import Norm from "common/models/norm.model";
import NormFilters from "common/types/filters/normFilters.type";
import { BehaviorSubject } from "rxjs";

export default function filterNorms(
  filters: NormFilters,
  howMany: number
): BehaviorSubject<Norm[]> {
  return null;
}
