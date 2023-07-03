import ApiError from "common/types/apiError";
import type { NextApiResponse } from "next/types";

export default function handleRequestError(err: any, res: NextApiResponse<string>) {
  if (err instanceof ApiError) res.status(err.code).send(err.message);
  else if (err instanceof Error) res.status(400).send(err.message);
  else res.status(400).send(err);
}
