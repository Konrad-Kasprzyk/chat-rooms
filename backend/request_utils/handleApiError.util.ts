import ApiError from "common/types/apiError.class";
import type { NextApiResponse } from "next/types";

export default function handleApiError(err: any, res: NextApiResponse<string>) {
  if (err instanceof ApiError) res.status(err.code).send(err.message);
  else if (err instanceof Error) res.status(400).send(err.message);
  else res.status(400).send(err);
}
