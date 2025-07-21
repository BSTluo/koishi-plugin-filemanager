import { Context, Schema, Service } from 'koishi';
import { audio } from './audio';
import { img } from './img';

// 服务其实就是继承server类的一个类
// 我正在看doc()
// okk))
export default class FileManager extends Service
{
  static name: string = 'fileManager';

  constructor(ctx: Context, config: any)
  {
    super(ctx, 'fileManager');
    this.ctx = ctx;
    this.config = config;
    this.img = new img(ctx);
    this.img.speedTest();

    this.audio = new audio(ctx);
    this.audio.speedTest();
  }

  img: img;

  audio: audio;
}

declare module 'koishi' {
  interface Context {
    fileManager: FileManager;
  }
}