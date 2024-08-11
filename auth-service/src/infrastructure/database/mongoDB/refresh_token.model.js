export const refreshTokenModelHandler =(mongoose) => {
  const refreshTokenTokenModel = new mongoose.Schema({
    refreshId: { type: String, required: true, unique: true },
    accessTokenId: { type: String, required: true, unique: true },
    identityNumber: { type: String, required: true, unique: true },
  }, { timestamps: true });

  const refreshToken = mongoose.model('refresh_token', refreshTokenTokenModel);

  return refreshToken;
}