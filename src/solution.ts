import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import protectJWT from 'express-jwt';
import jwt from "jsonwebtoken";
import { v4 } from "uuid";

interface Token {
  valid: boolean;
  user: string;
  token: string;
}
const tokens: Record<string, Token> = {};

dotenv.config();

const PORT = process.env.PORT || 3000;
const SECRET = 'abc123';
const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/auth/credentials', async (req, res) => {
  const { username, password } = req.body;
  const result = await checkPassword(username, password)

  if (result) {
    const accessToken = makeAccessToken(username);
    const refreshToken = makeRefreshToken(username)

    res.json({
      success: true,
      accessToken,
      refreshToken
    });
  } else {
    res.json({ success: false })
  }
});

app.get('/auth/refresh', async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.json({ success: false });
  console.log(authorization);
  const [_, token] = authorization.split(" ");
  console.log(token);
  const result = await checkRefreshToken(token)
  console.log(result);
  if (!result) return res.json({ success: false });
  revokeRefreshToken(token);
  return res.json({
    accessToken: makeAccessToken(result.user),
    refreshToken: makeRefreshToken(result.user),
  })

});

app.get('/api/whoami',
  protectJWT({ secret: SECRET, algorithms: ['HS256'] }),
  (req: Request, res: Response) => {
    const username = "TODO";
    res.json({
      username: req.user?.sub,
    });
  });

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

// Fake password-checking function with artificial delay
function checkPassword(username: string, password: string): Promise<boolean> {
  return new Promise((y) => setTimeout(() => y(username === password), 1000))
}

function makeRefreshToken(username: string) {
  const refreshToken = v4()

  tokens[refreshToken] = {
    token: refreshToken,
    valid: true,
    user: username,
  }
  console.log("Adding ", tokens);
  return refreshToken;
}

function makeAccessToken(username: string) {
  return jwt.sign({
    sub: username
  }, SECRET, {
    algorithm: 'HS256',
    expiresIn: '5 min'
  });
}

async function checkRefreshToken(token?: string) {
  if (!token) return false;
  const result = tokens[token];
  console.log( tokens, token, result)
  if (result && result.valid) return result;
  return false;
}

function revokeRefreshToken(token: string) {
  if (tokens[token]) {
    tokens[token].valid = false;
  }
}