import * as userRepo from "../../repositories/user-repositories.js";
import { hashPassword, comparePassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.js";
import ApiError from "../../errors/api-error.js";

export const register = async (userData) => {
  const existingUser = await userRepo.findUserByEmail(userData.email);
  if (existingUser) throw new ApiError(400, "Email sudah terdaftar");
  const hashedPassword = await hashPassword(userData.password);
  return await userRepo.createUser({ ...userData, password: hashedPassword });
};

export const login = async (email, password) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new ApiError(401, "Email atau password salah");
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new ApiError(401, "Email atau password salah");
  const token = generateToken({ id: user.id, email: user.email });
  return { user, token };
};

export const setPreferences = async (userId, tags) => {
  await userRepo.saveUserPreferences(userId, tags);
  return {
    message: "Preferensi tag wisata berhasil disimpan. Cold start termitigasi.",
  };
};

export const likePlace = async (userId, placeId) => {
  const result = await userRepo.saveUserLike(userId, placeId);
  if (result.status === "unliked") {
    return { message: "Interaksi dihapus (Unlike)." };
  }
  return {
    message: "Interaksi Like dicatat sebagai umpan balik implisit untuk CBF.",
  };
};

export const getUserLikes = async (userId) => {
  const likesData = await userRepo.getUserLikes(userId);
  if (!likesData) return [];
  return likesData.map((like) => like.placeId);
};

export const updateProfile = async (userId, updateData) => {
  if (updateData.email) {
    const existingUser = await userRepo.findUserByEmail(updateData.email);
    if (existingUser && existingUser.id !== userId) {
      throw new ApiError(400, "Email sudah digunakan oleh pengguna lain");
    }
  }
  if (updateData.password && updateData.password.trim() !== "") {
    updateData.password = await hashPassword(updateData.password);
  } else {
    delete updateData.password;
  }
  const updatedUser = await userRepo.updateUser(userId, updateData);
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const getLikedPlaces = async (userId) => {
  const likes = await userRepo.getUserLikedPlaces(userId);
  const likedPlaces = likes.map((like) => like.place);
  return likedPlaces;
};

export const getProfile = async (userId) => {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new Error("User tidak ditemukan");
  }
  const { password, ...userProfile } = user;
  return userProfile;
};
