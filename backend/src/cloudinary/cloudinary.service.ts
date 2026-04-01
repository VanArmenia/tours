import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import 'multer'

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    })
  }

  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'tours' },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          },
        )
        .end(file.buffer)
    })
  }
}