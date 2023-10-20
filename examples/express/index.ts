import express, { Request, Response, NextFunction } from 'express';
import env from "../../env";
import TreblleExpress from "../../plugins/express"
const app = express();

const PORT = 3000;

app.use(TreblleExpress.plugin({
  apiKey: env.apiKey!,
  projectId: env.projectId!,
}));

app.get('/express', (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: 'Hello World From Express!' })
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});