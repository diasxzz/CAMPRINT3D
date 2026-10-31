import defaults from './default-products.json';
import { env } from 'cloudflare:workers';
export async function listProducts(){
 const db=(env as any).DB;
 const rows=await db.prepare('SELECT id, data FROM products').all();
 const map=new Map<string,any>(defaults.map((p:any)=>[p.id,p]));
 for(const row of rows.results as any[]){const p=JSON.parse(row.data); if(p.hidden) map.delete(row.id); else map.set(row.id,p);}
 return [...map.values()];
}
export function clean(s:unknown,max=500){return String(s??'').trim().slice(0,max).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
