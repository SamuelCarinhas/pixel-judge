import fs from "fs"
import multer from "multer"
import { BadRequest, Forbidden } from "./error.util"
import path from "path"
import prisma from "./prisma.util"

const UPLOADS_DIR = String(process.env.UPLOADS_DIR)
const MAX_UPLOAD_SIZE = Number(process.env.MAX_UPLOAD_SIZE)

function diskStorage(storage: string) {
    return multer.diskStorage({
        destination: (_, __, callback) => {
            fs.mkdirSync(`${UPLOADS_DIR}/${storage}`, { recursive: true })
            callback(null, `${UPLOADS_DIR}/${storage}`)
        },
        filename: (_, file, callback) => {
            callback(null, `${Date.now() + "-" + Math.round(Math.random() * 1e9)}-${file.originalname}`)
        },
    })
}

export const ProfileImageMulter = multer({
  storage: diskStorage('profile'),
  fileFilter: function (_, file, callback) {
    const type = file.mimetype
    if (type == "image/png" || type == "image/jpg" || type == "image/jpeg") {
      return callback(null, true)
    }
    callback(new BadRequest("Only images (.png, .jpg, .jpeg) are allowed, the type sent was "+type))
  },
  limits: {
    fileSize: MAX_UPLOAD_SIZE * 1024 * 1024,
  },
})

export const TestCaseMulter = (problemId: string) => multer({
  storage: diskStorage(`problem/${problemId}/test-cases`),
  fileFilter: function (_, file, callback) {
    const type = file.mimetype
    if (type == "text/plain") {
      return callback(null, true)
    }
    callback(new BadRequest("Only txt files are allowed, the type sent was "+type))
  },
  limits: {
    fileSize: MAX_UPLOAD_SIZE * 1024 * 1024,
  },
})

export const SubmissionMulter = (problemId: string) => multer({
  storage: diskStorage(`problem/${problemId}/submissions`),
  fileFilter: async function (_, file, callback) {
    const languages = await prisma.language.findMany({});
    const allowedExtensions = languages.map(language => `.${language.fileExtension}`);
    const fileExtension = path.extname(file.originalname).toLocaleLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      return callback(null, true)
    }
    callback(new BadRequest("Extension not supported"))
  },
  limits: {
    fileSize: MAX_UPLOAD_SIZE * 1024 * 1024,
  },
})

export default { ProfileImageMulter, TestCaseMulter, SubmissionMulter }
