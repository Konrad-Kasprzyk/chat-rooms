import LabelsHistoryDTO from "common/DTOModels/historyModels/labelsHistoryDTO.model";
import typia from "typia";

const validateLabelsHistoryDTO = typia.createAssertEquals<LabelsHistoryDTO>();

export default validateLabelsHistoryDTO;
