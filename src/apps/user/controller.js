import * as userService from "./service.js";
import { formatUserResponse } from "../../dtos/user-dto.js";
import catchAsync from "../../errors/controller-error.js";

export const register = catchAsync(async (req, res) => {
  const user = await userService.register(req.body);
  res
    .status(201)
    .json({ data: formatUserResponse(user), message: "Registrasi berhasil" });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.login(email, password);
  res.status(200).json({
    data: { user: formatUserResponse(result.user), token: result.token },
    message: "Login berhasil",
  });
});

export const setPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tags } = req.body;
    const result = await userService.setPreferences(userId, tags);
    res.status(200).json({ message: result.message, data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const likePlace = catchAsync(async (req, res) => {
  const { placeId } = req.body;
  const result = await userService.likePlace(req.user.id, placeId);
  res.status(200).json(result);
});

export const getUserLikes = catchAsync(async (req, res) => {
  const likedPlaces = await userService.getUserLikes(req.user.id);
  res.status(200).json({ status: "success", data: likedPlaces });
});

export const getLikedPlaces = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const likedPlaces = await userService.getLikedPlaces(userId);

  res.status(200).json({
    status: "success",
    data: likedPlaces,
    message: "Daftar wisata yang disukai berhasil dimuat",
  });
});

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await userService.updateProfile(userId, req.body);
    res
      .status(200)
      .json({ message: "Profil berhasil diperbarui", data: updatedUser });
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await userService.getProfile(userId);
    res.status(200).json({
      message: "Berhasil mengambil data profil",
      data: profile,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};