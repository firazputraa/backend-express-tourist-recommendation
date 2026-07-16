import prisma from "../../utils/prisma.js";
import axios from "axios";
import ApiError from "../../errors/api-error.js";

const FLASK_API_URL = process.env.FLASK_API_URL;

export const searchPlaces = async (kataKunci) => {
  if (!kataKunci) {
    throw new ApiError(400, "Kata kunci tidak boleh kosong");
  }
  try {
    const flaskResponse = await axios.post(`${FLASK_API_URL}/wisata/search`, {
      query: kataKunci,
      top_n: 50,
    });
    return flaskResponse.data.data || [];
  } catch (error) {
    console.error("Gagal menembak Flask API:", error.message);
    throw new ApiError(
      500,
      "Gagal terhubung ke layanan Machine Learning Flask",
    );
  }
};

export const getPopularPlaces = async (limit) => {
  try {
    const flaskResponse = await axios.get(
      `${FLASK_API_URL}/wisata/populer?top_n=${limit}`,
    );
    const popularData = flaskResponse.data.data;
    const placeIds = popularData.map((item) => item.placeId);
    const detailedPlaces = await prisma.place.findMany({
      where: { placeId: { in: placeIds } },
    });
    return popularData.map((flaskItem) => {
      const detail = detailedPlaces.find(
        (p) => p.placeId === flaskItem.placeId,
      );
      return { ...detail };
    });
  } catch (error) {
    console.error("Gagal mengambil data populer dari Flask:", error.message);
    return await prisma.place.findMany({
      orderBy: [{ reviews: "desc" }, { rating: "desc" }],
      take: limit,
    });
  }
};

export const getRecommendations = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { likes: true },
  });
  if (!user) throw new ApiError(404, "Pengguna tidak ditemukan");
  try {
    const likedPlaceIds = user.likes.map((like) => like.placeId);
    const flaskResponse = await axios.post(
      `${FLASK_API_URL}/wisata/recommend_user`,
      {
        liked_places: likedPlaceIds,
        preferred_tags: user.preferredTags,
      },
    );
    const recommendedData = flaskResponse.data.data;
    if (!recommendedData || recommendedData.length === 0) {
      return [];
    }

    const placeIds = recommendedData.map((item) => item.placeId);
    const detailedPlaces = await prisma.place.findMany({
      where: { placeId: { in: placeIds } },
    });
    return recommendedData.map((flaskItem) => {
      const detail = detailedPlaces.find(
        (p) => p.placeId === flaskItem.placeId,
      );
      return { ...detail, skor_rekomendasi: flaskItem.skor_rekomendasi };
    });
  } catch (error) {
    console.error("Gagal terhubung ke Flask ML Service:", error.message);
    return [];
  }
};

export const getSimilarPlaces = async (placeId) => {
  try {
    const flaskResponse = await axios.post(
      `${FLASK_API_URL}/wisata/recommend`,
      {
        placeId: placeId,
      },
    );
    const similarData = flaskResponse.data.data;
    if (!similarData || similarData.length === 0) return [];
    const placeIds = similarData.map((item) => item.placeId);
    const detailedPlaces = await prisma.place.findMany({
      where: { placeId: { in: placeIds } },
    });
    return similarData.map((flaskItem) => {
      const detail = detailedPlaces.find(
        (p) => p.placeId === flaskItem.placeId,
      );
      return { ...detail, skor_kemiripan: flaskItem.skor_kemiripan };
    });
  } catch (error) {
    console.error("Gagal mengambil wisata serupa:", error.message);
    return []; 
  }
};

export const getRandomPlaces = async () => {
  const count = await prisma.place.count();
  const skip = Math.max(0, Math.floor(Math.random() * count) - 10);
  return await prisma.place.findMany({
    take: 10,
    skip: skip,
  });
};
