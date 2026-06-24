const userRepository = require("../repositories/user.repositoties");
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require("../utils/password");

const signup = async ({ email, name, password }) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepository.create({
    email,
    name,
    password: hashedPassword,
  });
  const token = jwt.sign(
    {
    id: user.id,
    email: user.email
  },
    process.env.JWT_SECRET || 'super_secret_key',
  { expiresIn: '10m'}
  );

  return {
    token: token
  };
};



const login = async ({ email, password}) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }
 // const hashedPassword = await hashPassword(password);

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const onboarded =
    !user.sex ||
    !user.age ||
    !user.graduationDate;
  const token = jwt.sign(
    {
    id: user.id,
    email: user.email
  },
    process.env.JWT_SECRET || 'super_secret_key',
  { expiresIn: '1h'}
  );

  return {
    token:token,
    onboarded: onboarded,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  };
};

module.exports = {
  signup,
  login,
};