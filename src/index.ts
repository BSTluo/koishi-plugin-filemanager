import { Context, Schema, Service } from 'koishi';
import { audio } from './audio';
import { img } from './img';
import FormData from 'form-data';
import axios from 'axios';

export default class FileManager extends Service
{
  static name: string = 'filemanager';

  static usage = `# 配置说明

1. 111
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

declare module 'koishi' {
  interface Context
  {
    filemanager: FileManager;
  }
}