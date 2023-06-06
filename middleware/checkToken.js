import jwt from "jsonwebtoken";
export const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("auth header:", authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
