import ApiError from "common/types/apiError.class";
import { NextResponse } from "next/server";

export default function handleApiError(err: any): NextResponse {
  if (err instanceof ApiError)
    return NextResponse.json(err.message, {
      status: err.code,
    });
  else if (err instanceof Error)
    return NextResponse.json(err.message, {
      status: 400,
    });
  else
    return NextResponse.json(err, {
      status: 400,
    });
}
