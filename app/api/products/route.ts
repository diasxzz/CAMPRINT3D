import {env} from 'cloudflare:workers';
import {listProducts,clean} from '../../../lib/catalog';
import {authorized,validOrigin} from '../../../lib/admin';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await listProducts(),{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Catálogo temporariamente indisponível'}, {status:503});}}
export async function POST(req:Request){
 if(!await authorized()||!validOrigin(req))return Response.json({error:'Acesso negado'}, {status:403});
 try { const input=await req.json() as any;const id=String(input.id||crypto.randomUUID());if(!/^[a-z0-9-]{1,80}$/.test(id))throw Error('ID inválido');
 const old=(await listProducts()).find((p:any)=>p.id===id); if(input.hidden){await (env as any).DB.prepare('INSERT INTO products (id,data) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind(id,JSON.stringify({hidden:true})).run();return Response.json({ok:true});}
 const title=clean(input.title,100), description=clean(input.description,300),detail=clean(input.detail,1500);if(!title||!description||!detail)throw Error('Preencha nome e descrições');
 const categories:any={natal:'Natal',articulados:'Articulados',colecionaveis:'Colecionáveis',decoracao:'Decoração'};const category=String(input.category);if(!categories[category])throw Error('Categoria inválida');
 const media=Array.isArray(input.media)?input.media.slice(0,12).filter((m:any)=>m&&typeof m.src==='string'&&/^(assets\/[a-zA-Z0-9._-]+|\/media\/[a-f0-9-]+)$/.test(m.src)).map((m:any)=>{const prior=old?.media?.find((x:any)=>x.src===m.src);return prior||{type:'image',src:m.src,alt:title};}):[];
 if(!media.length)throw Error('Adicione ao menos uma foto');
 const p={...old,id,title,description,detail,category,categoryLabel:categories[category],image:media[0].poster||media[0].src,alt:title,media,kind:old?.kind||'photo',badge:old?.badge||(input.isKit?'Kit':'Impressão 3D'),isKit:!!input.isKit,points:String(input.points||'').split('\n').map((x:string)=>clean(x,150)).filter(Boolean).slice(0,8)};
 await (env as any).DB.prepare('INSERT INTO products (id,data) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind(id,JSON.stringify(p)).run();return Response.json({ok:true,id});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Erro ao salvar'}, {status:400});}
}
