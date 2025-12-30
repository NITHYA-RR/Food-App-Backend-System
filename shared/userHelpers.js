import jwt from "jsonwebtoken";

// Hash password (bcrypt passed from server)
export const hashPassword = async (bcrypt, password) => {
  return await bcrypt.hash(password, 10);
};


// Compare password
export const comparePassword = async (bcrypt, password, hashed) => {
  return await bcrypt.compare(password, hashed);
};


// Generate JWT
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Verify JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Sync user to another server (axios passed from server)

export const syncUserToServer = async (axios, userData, serverUrl) => {
  try {
    await axios.post(`${serverUrl}/users/sync`, userData);
    console.log(` User synced to ${serverUrl}`);
  } catch (err) {
    console.log(` Sync failed to ${serverUrl}:`, err.message);
  }
};


