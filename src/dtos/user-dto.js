export const formatUserResponse = (user) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    preferredTags: user.preferredTags,
  };
};
