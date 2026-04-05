import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    })
  }

  async uploadBuffer(
    buffer: Buffer,
    folder: string,
  ) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
            format: 'webp', // enforce format
            transformation: [
              {
                quality: 'auto',
                fetch_format: 'auto',
              },
            ],
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          },
        )
        .end(buffer)
    })
  }

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId)
  }
}