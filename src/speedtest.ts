import { Context } from "koishi";

export async function getLatency(ctx: Context, url: string): Promise<number | 'error'>
{
  try {
    const start = Date.now(); // 请求开始时间
    await ctx.http.get(url); // 发送 GET 请求（设置最大超时 10 秒）
    const end = Date.now();   // 请求结束时间
    const duration = end - start;

    console.log(`访问 ${url} 耗时：${duration} 毫秒`);
    return duration;
  } catch (error) {
    console.error(`测速失败: ${error.message}`);
    return null;
  }
}