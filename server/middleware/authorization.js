import jwt from 'jsonwebtoken';

const authorization = (req, res, next) => {
  const token = req.headers.token || req.body.token || req.query.token;

  try {
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = verifyToken.id;
    req.username = verifyToken.username;
    return next();
  } catch (error) {
    return res.status(401).send({
      errors: {
        status: '401',
        title: 'Unauthorized',
        detail: 'You are not authorized to perform this action',
      },
    });
  }
};

export default authorization;
