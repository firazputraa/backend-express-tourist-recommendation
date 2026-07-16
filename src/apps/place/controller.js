import * as placeService from "./service.js";
import catchAsync from "../../errors/controller-error.js";

export const getRecommendations = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const recommendations = await placeService.getRecommendations(userId);
  res.status(200).json({
    status: "success",
    data: recommendations,
    message: "Rekomendasi wisata terpersonalisasi berhasil dimuat",
  });
});

export const getPopularPlaces = catchAsync(async (req, res) => {
  const popularPlaces = await placeService.getPopularPlaces();
  res.status(200).json({
    status: "success",
    data: popularPlaces,
    message: "Data wisata populer berhasil dimuat",
  });
});

export const getSimilarPlaces = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const similarPlaces = await placeService.getSimilarPlaces(placeId);
  res.status(200).json({
    status: "success",
    data: similarPlaces,
    message: "Data wisata serupa berhasil dimuat",
  });
});

export const searchPlaces = catchAsync(async (req, res) => {
  const kataKunci = req.query.keyword || req.query.query;
  const hasilPencarian = await placeService.searchPlaces(kataKunci);
  res.status(200).json({
    status: "success",
    data: hasilPencarian,
  });
});

export const getRandomPlaces = catchAsync(async (req, res) => {
  const randomPlaces = await placeService.getRandomPlaces();
  res.status(200).json({
    status: "success",
    data: randomPlaces,
    message: "Data wisata acak (random sampling) berhasil dimuat",
  });
});
