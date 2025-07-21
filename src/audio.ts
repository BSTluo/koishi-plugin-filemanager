import { Context } from "koishi";
import { getLatency } from "./speedtest";

// 感觉有点力大砖飞
export class audio
{
  ctx: Context;

  constructor(ctx: Context)
  {
    this.ctx = ctx;
  }

  // 已注册的音频床列表
  private regList: Record<string, { url: string; upload: (file: Buffer, fileName: string) => Promise<string>; }> = {}; //俺瞅着型

  /**
   * 注册音频床服务
   * @param name 音频床名称
   * @param url 音频床服务的主页地址（用于测速）
   * @param upload 上传函数，接收文件Buffer、文件名和过期时间，返回上传后的图片URL
   * @returns 
   */
  reg(name: string, url: string, upload: (file: Buffer, fileName: string) => Promise<string>)
  {
    const nameList = Object.keys(this.regList);

    // 如果已经注册过了，就不再注册
    if (nameList.every(item => item !== name))
    {
      this.ctx.logger.info(`注册音频床服务: ${name}`);
      this.regList[name] = {
        url: url,
        upload: upload
      };

      return true;
    } else
    {
      this.ctx.logger.warn(`音频床服务 ${name} 已经注册过了，无法重复注册。`);
      return false;
    }
  }

  fastName: string | undefined = undefined; // 最快的音频床服务名称

  /**
   * 获取最速传说
   * @returns 没有！
   */
  async speedTest()
  {
    // 进行一个速度的测
    let fastName: string = undefined;
    let fastSpeed: number = Infinity;

    const nameList = Object.keys(this.regList);

    this.ctx.logger.info(`正在测试音频床服务`);
    for (const name of nameList)
    {
      const url = this.regList[name].url;

      const speed = await getLatency(this.ctx, url);
      if (speed !== 'error' && speed < fastSpeed)
      {
        fastSpeed = speed;
        fastName = name;
      }
    }

    if (fastName === undefined)
    {
      this.ctx.logger.error(`所有音频床服务测试失败`);
      return;
    }

    this.ctx.logger.info(`音频床服务测试完成，最快的服务是: ${fastName}`);

    this.fastName = fastName; // 设置最快的音频床服务名称

    return fastName;
  }

  /**
   * 上传音频到音频床服务
   * @param file 文件Buffer
   * @param fileName 要上传的文件名
   * @returns 直链url
   */
  async upload(file: Buffer, fileName: string)
  {
    // 获取最快的音频床服务
    const fastName = this.fastName || await this.speedTest();

    // 上传图片
    const url = this.regList[fastName].url;
    const upload = this.regList[fastName].upload;

    try
    {
      const resultUrl = await upload(file, fileName);
      this.ctx.logger.info(`音频上传成功: ${resultUrl}`);
      return resultUrl;
    } catch (error)
    {
      this.ctx.logger.error(`音频上传失败: ${error}`);
      return null;
    }
  }
}

