import jwt from 'jsonwebtoken';

const generateToken = ({ username, id }) =>
  jwt.sign(
    {
      username,
      id,
    },
    process.env.SECRET_KEY
  );
  console.log(process.env.SECRET_KEY)
export default generateToken;
