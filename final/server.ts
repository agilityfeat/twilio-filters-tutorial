import * as dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import http from 'http';
import { jwt } from 'twilio';
dotenv.config();

const { AccessToken } = jwt;
const { VideoGrant } = jwt.AccessToken;
const app = express();

app.get('/token', (request : Request, response : Response) => {
  const { identity } = request.query;

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID as string,
    process.env.TWILIO_API_KEY as string,
    process.env.TWILIO_API_SECRET as string,
    {identity: identity as string}
  );

  const grant = new VideoGrant();
  token.addGrant(grant);

  response.json({
    accessToken: token.toJwt()
  });
});

const server = http.createServer(app);
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
})
