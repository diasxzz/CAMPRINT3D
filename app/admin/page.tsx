import {getChatGPTUser,chatGPTSignInPath,chatGPTSignOutPath} from '../chatgpt-auth';
import Admin from './panel';
export const dynamic='force-dynamic';
export default async function Page(){const u=await getChatGPTUser();if(!u)return <main style={{padding:40,fontFamily:'sans-serif'}}><h1>Administração CAMPRINT</h1><p>Entre com a conta autorizada para gerenciar os produtos.</p><a href={chatGPTSignInPath('/admin')} target="_top">Entrar com ChatGPT</a></main>;if(u.email.toLowerCase()!=='gustavodiassn@icloud.com')return <main style={{padding:40,fontFamily:'sans-serif'}}><h1>Acesso restrito</h1><p>Esta conta não está autorizada a administrar a loja.</p><a href={chatGPTSignOutPath('/admin')} target="_top">Sair e usar outra conta</a></main>;return <Admin/>;}
