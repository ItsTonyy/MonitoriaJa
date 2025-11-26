import express from "express";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";

/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/", upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
    // Lógica para lidar com o upload de arquivos
    res.json(req.file);
});
*/
export default router;
