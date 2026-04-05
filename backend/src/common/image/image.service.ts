import { Injectable } from '@nestjs/common'
import sharp from 'sharp'

@Injectable()
export class ImageService {
  async processImage(
    file: Express.Multer.File,
  ): Promise<Buffer> {
    return sharp(file.buffer)
      .resize(1200, 800, {
        fit: 'cover',
      })
      .webp({ quality: 80 }) // 🔥 convert to webp
      .toBuffer()
  }

  async generateThumbnail(
    file: Express.Multer.File,
  ): Promise<Buffer> {
    return sharp(file.buffer)
      .resize(400, 300, {
        fit: 'cover',
      })
      .webp({ quality: 70 })
      .toBuffer()
  }
}