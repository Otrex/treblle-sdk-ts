import Koa from 'koa';
import Router from 'koa-router';
import env from "../../env";
import TreblleKoa from '../../plugins/koa';
const app = new Koa();
const router = new Router();

const PORT = 4000;

app.use(
  TreblleKoa.plugin({
    apiKey: env.apiKey!,
    projectId: env.projectId!,
  })
)

router.get('/koa', async(ctx: Koa.ParameterizedContext) => {
  ctx.body = { message: 'Hello World from Koa!' }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT, function(){
  console.log(`Server running on ${PORT}`)
})