import fs from 'node:fs';

import { z } from 'zod'; // TypeScript-first schema validation with static type inference

const dataSchema = z.object({
  title: z.string(),
  id: z.number(),
  values: z.array(z.union([z.string(), z.number()])),
});

type Data = z.infer<typeof dataSchema>;

function output(data: Data) {
  console.log(data);
}

const content = JSON.parse(fs.readFileSync('data.json').toString());

const parsedData = dataSchema.parse(content);
output(parsedData);