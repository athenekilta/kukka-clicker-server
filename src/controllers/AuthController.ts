import { Application } from "express";
import { UserModel } from "../models/user";
import { logger } from "../utils/logger";
import config from "../utils/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

export class AuthContorller {
  constructor(app: Application) {
    this.bind(app);
  }

  bind(app: Application) {
    // REGISTER
    app.post("/api/register", async (req, res) => {
      try {
        const username = req.body.username;
        const password = req.body.password;

        const userExists = await UserModel.findOne({ where: { username } });
        if (userExists) {
          return res
            .status(400)
            .send({ user: null, message: "username is taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
          username,
          password: hashedPassword,
        };

        const newUser = await UserModel.create(userData);

        const token = jwt.sign({ username }, config.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: "2y",
        });

        const cookie = serialize(config.TOKEN_NAME, token, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
          expires: new Date(1000 * 60 * 60 * 24 * 365 * 2),
          sameSite: "strict",
          path: "/",
          // domain: process.env.BASE_URL,
        });
        res.setHeader("Set-Cookie", cookie);

        return res
          .status(201)
          .send({ user: newUser.toJSON(), message: "success" });
      } catch (error) {
        logger({ error });
      }
      res.status(500).send({ message: "Internal server error" });
    });

    // LOGIN
    app.post("/api/login", async (req, res) => {
      try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await UserModel.findOne({ where: { username } });
        if (!user) {
          return res
            .status(400)
            .send({ user: null, message: "no user with that username" });
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
          return res
            .status(400)
            .send({ user: null, message: "wrong password" });
        }

        const token = jwt.sign({ username }, config.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: "2y",
        });

        const cookie = serialize(config.TOKEN_NAME, token, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
          expires: new Date(1000 * 60 * 60 * 24 * 365 * 2),
          sameSite: "strict",
          path: "/",
          // domain: process.env.BASE_URL,
        });
        res.setHeader("Set-Cookie", cookie);

        return res
          .status(201)
          .send({ user: user.toJSON(), message: "success" });
      } catch (error) {
        logger({ error });
      }
      res.send({ message: "Internal server error" }).status(500);
    });

    app.post("/api/auth", async (req, res) => {
      try {
        // check if cookie is in cookies
        let accessToken: string = req.cookies[config.TOKEN_NAME];

        // else try to get it form authorization
        if (!accessToken) {
          if (
            !req.headers.authorization ||
            !req.headers.authorization.startsWith("Bearer ")
          ) {
            throw new Error("no_cookie");
          }

          if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
          ) {
            // console.log('Found "Authorization" header');
            // Read the ID Token from the Authorization header.
            accessToken = req.headers.authorization.split("Bearer ")[1];
          } else {
            // No cookie
            throw new Error("no_cookie");
          }
        }

        if (accessToken) {
          // has access token
          // validate access token, throws error if expired
          const decodedToken = jwt.verify(
            accessToken,
            config.ACCESS_TOKEN_SECRET_KEY
          ) as {
            username: string;
            exp: number;
          };

          const username = decodedToken?.username || null;

          // GET NEW TOKEN
          if (!username) {
            const token = jwt.sign(
              { username: decodedToken.username },
              config.ACCESS_TOKEN_SECRET_KEY,
              {
                expiresIn: "2y",
              }
            );

            const cookie = serialize(config.TOKEN_NAME, token, {
              httpOnly: true,
              secure: true,
              maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
              expires: new Date(1000 * 60 * 60 * 24 * 365 * 2),
              sameSite: "strict",
              path: "/",
              // domain: process.env.BASE_URL,
            });
            res.setHeader("Set-Cookie", cookie);
          }

          const user = await UserModel.findOne({ where: { username } });
          return res
            .status(201)
            .send({ user: user.toJSON(), message: "success" });
        } else {
          res.status(200).send({ user: null });
        }
      } catch (error) {
        logger({ error });
      }
      res.status(500).send({ message: "Internal server error" });
    });
  }
}
