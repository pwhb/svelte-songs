import { ZodError } from "zod";

export const zodExceptionHandler = (err: any) =>
{
    if (err instanceof ZodError)
    {
        const { issues } = err;
        const errorResponse: any = {};
        issues.forEach(issue =>
        {
            errorResponse[issue.path[0]] = issue;
        });
        return errorResponse;
    }
}; 