import { z } from "zod";

const CollectionSchema = z.object({
    name: z.string(),
    roleIds: z.array(z.string()),
    routes: z.array(z.object({
        methods: z.string(),
        path: z.string(),
        roleIds: z.array(z.string()),
    })),
});

export default CollectionSchema;