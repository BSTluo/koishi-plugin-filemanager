import { Context, Schema, Service } from 'koishi';
import { audio } from './audio';
import { img } from './img';
import FormData from 'form-data';
import axios from 'axios';

class FileManager extends Service
{
  static name: string = 'filemanager';

  static usage = `# 配置说明

1. 对，这个就是目前新的图床实现方式（
2. 你需要启用至少一个 filemanager 的附属插件 来让 adapter-iirose 正常工作
3. 不知道启用什么？ 试试 在插件商店里搜索 filemanager ！
`;

  constructor(ctx: Context, config: any)
  {
    super(ctx, 'filemanager');
    this.ctx = ctx;
    this.config = config;
    this.img = new img(ctx);
    this.audio = new audio(ctx);
  }

  img: img;

  audio: audio;

  /**
   * 生成临时文件名
   * @returns YYYY-MM-DD-hh:mm:ss
   */
  makeTempName(): string
  {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
  }

  axios = axios; // 让axios可以在外部使用
  FormData = FormData; // 让FormData可以在外部使用
  
}

namespace FileManager {
  export interface Config{
    abab: string;
  }

  export const Config: Schema<Config> = Schema.object({
    abab: Schema.string().description('目前这个插件没有设定。这个设定在这里只是为了防止他因为代码里没有配置设定而报错（').default('enjoy your day!'),
  });
}

export default FileManager;

declare module 'koishi' {
  interface Context
  {
    filemanager: FileManager;
  }
}