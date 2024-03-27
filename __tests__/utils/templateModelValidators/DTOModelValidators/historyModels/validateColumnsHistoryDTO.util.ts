import ColumnsHistoryDTO from "common/DTOModels/historyModels/columnsHistoryDTO.model";
import typia from "typia";

const validateColumnsHistoryDTO = typia.createAssertEquals<ColumnsHistoryDTO>();

export default validateColumnsHistoryDTO;
