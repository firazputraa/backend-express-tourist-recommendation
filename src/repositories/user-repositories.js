import prisma from "../utils/prisma.js";

export const createUser = async (data) => {
  return await prisma.user.create({ data });
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const saveUserPreferences = async (userId, tags) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { preferredTags: tags },
  });
};

export const saveUserLike = async (userId, placeId) => {
  try {
    const like = await prisma.like.create({
      data: { userId, placeId },
    });
    return { status: "liked", data: like };
  } catch (error) {
    if (error.code === "P2002") {
      await prisma.like.delete({
        where: {
          userId_placeId: { userId, placeId },
        },
      });
      return { status: "unliked" };
    }
    throw error;
  }
};

export const getUserLikes = async (userId) => {
  return await prisma.like.findMany({
    where: { userId },
    select: { placeId: true },
  });
};

export const getUserLikedPlaces = async (userId) => {
  return await prisma.like.findMany({
    where: { userId: userId },
    include: {
      place: true, 
    },
    orderBy: {
      createdAt: "desc", 
    },
  });
};

export const updateUser = async (userId, data) => {
  return await prisma.user.update({
    where: { id: userId },
    data: data,
  });
};