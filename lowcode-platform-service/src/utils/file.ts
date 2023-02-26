import type { Files, File } from 'formidable';
import fs from 'fs-extra';
import Path from 'path';

/**
 * 确保用户图片文件夹已存在
 * @param userDir 用户文件夹相对路径
 * @returns 文件夹绝对路径
 */
export async function ensureUserImagesDirExists(userDir: string, needToCreated = true) {
  const dirPath = Path.resolve(process.cwd(), `public/images/${userDir}`);
  const isExists = await fs.exists(dirPath);
  if(!isExists && needToCreated) {
    await fs.mkdir(dirPath);
  }

  return dirPath;
}

/**
 * 获取用户图片文件所在的服务器路径
 * @param origin 服务器源
 * @param userDir 用户文件夹
 * @param fileName 文件名
 * @returns 用户图片文件所在的服务器路径
 */
export function getUserImagePath(origin: string, userDir: string, fileName: string[] | string) {
  if(Array.isArray(fileName)) {
    return fileName.map((name) => `${origin}/images/${userDir}${name}`);
  }

  return `${origin}/images/${userDir}${fileName}`;
}

/**
 * 保存图片
 * @param dir 文件目录
 * @param files 文件名
 * @returns 
 */
export async function saveImages(dir: string, files: Files) {
  const file = files.file;
  // 确保图片文件夹存在
  const dirPath = await ensureUserImagesDirExists(dir);
  // 多个图片
  if(Array.isArray(file)) {
    return await Promise.all(file.map((f) => {
      return save(dirPath, f);
    }));
  }

  // 单个图片
  return await save(dirPath, file);
}

/**
 * 保存文件
 * @param dirPath 文件目录
 * @param file 文件名 
 * @returns 
 */
function save(dirPath: string, file: File) {
  // 文件名
  const filename = `${dirPath}/${file.newFilename}`;
  // 创建文件读写流
  const fileReaderStream = fs.createReadStream(file.filepath);
  const fileWriteSteam = fs.createWriteStream(filename);
  return new Promise<string>((resolve, reject) => {
    const stream = fileReaderStream.pipe(fileWriteSteam);
    // 监听是否保存完毕
    stream.on('finish', () => {
      resolve(file.newFilename);
    });

    // 监听是否发生错误
    stream.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * 删除图片
 * @param filePath 需要删除的相对路径
 */
export async function deleteImage(filePath: string) {
  const path = Path.resolve(process.cwd(), `public/images/${filePath}`);
  await fs.remove(path);
}