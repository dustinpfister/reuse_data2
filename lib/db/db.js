import { mkdir } from 'node:fs/promises';
import path from 'node:path';

console.log(  path.dirname(import.meta.url) )

const db = {}



export { db }
