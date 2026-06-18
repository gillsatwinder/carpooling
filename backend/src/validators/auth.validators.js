const signupValidator = (data) => {
  if (!data.name) return { error: "Name is required" };
  if (!data.email) return { error: "Email is required" };

  const eduEmail = /^[^\s@]+@[^\s@]+\.edu$/i;
  if (!eduEmail.test(data.email)) {
    return { error: "Email must end with .edu" };
  }

  if (!data.password) return { error: "Password is required" };

  if (data.password.length <8 ) {
    return { error: "Password must be at least 8 characters" };
  }

  return {};
};


module.exports = {
  signupValidator,
};