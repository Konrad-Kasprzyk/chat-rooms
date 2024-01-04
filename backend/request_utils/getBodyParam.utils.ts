import ApiError from "common/types/apiError.class";

function _getBodyParam(body: { [key: string]: any }, param: string): any {
  if (!(param in body)) throw new ApiError(400, `${param} not found in POST body.`);
  return body[param];
}

export function getBodyStringParam(
  body: { [key: string]: any },
  param: string,
  non_empty: boolean = true
): string {
  const val = _getBodyParam(body, param);
  if (typeof val !== "string") throw new ApiError(400, `${param} is not a string.`);
  if (non_empty && !val) throw new ApiError(400, `${param} is not a non-empty string.`);
  return val;
}

export function getBodyIntegerParam(body: { [key: string]: any }, param: string): number {
  const val = _getBodyParam(body, param);
  if (typeof val !== "number") throw new ApiError(400, `${param} is not a number.`);
  if (!Number.isInteger(val)) throw new ApiError(400, `${param} is not an integer.`);
  return val;
}

export function getBodyBooleanParam(body: { [key: string]: any }, param: string): boolean {
  const val = _getBodyParam(body, param);
  if (typeof val !== "boolean") throw new ApiError(400, `${param} is not a boolean.`);
  return val;
}

export function getBodyStringArrayParam(
  body: { [key: string]: any },
  param: string,
  non_empty_strings: boolean = true
): string[] {
  const val = _getBodyParam(body, param);
  if (!Array.isArray(val)) throw new ApiError(400, `${param} is not an array.`);
  if (val.some((i) => typeof i !== "string"))
    throw new ApiError(400, `${param} is not an array of strings.`);
  if (non_empty_strings) {
    if (val.some((i) => !i))
      throw new ApiError(400, `${param} is not an array of non-empty strings.`);
  }
  return val as string[];
}
