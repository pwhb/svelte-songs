import { z } from "zod";

const OptionSchema = z.object({
    name: z.string(),
    label: z.string(),
    value: z.string(),
});

export default OptionSchema;