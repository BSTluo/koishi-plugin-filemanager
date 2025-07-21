import { Context } from "koishi";

export function getLatency(ctx: Context, url: string): Promise<number | 'error'>
{
  return new Promise(async (resolve, reject) =>
  {
    const startTime = Date.now();
    const get = await ctx.http.get(url);
    
    if (get.status === 200)
    {
      const endTime = Date.now();
      const latency = endTime - startTime;
      resolve(latency);
    } else {
      ctx.logger.error(`请求失败: ${get.status} ${get.statusText}`);
      resolve('error');
    }
  });
}