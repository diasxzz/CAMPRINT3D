import {getChatGPTUser} from '../app/chatgpt-auth';
export async function authorized(){const user=await getChatGPTUser();return !!user && user.email.toLowerCase()==='gustavodiassn@icloud.com';}
export function validOrigin(request:Request){const origin=request.headers.get('origin');return !!origin && origin===new URL(request.url).origin;}
