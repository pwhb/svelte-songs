import { z } from "zod";

const ConfigSchema = z.object({
    name: z.string(),
    value: z.object({
    }),
});

export default ConfigSchema;