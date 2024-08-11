export const accessTokenModelHandler =(mongoose) => {
    const accessTokenModel = new mongoose.Schema({
      accessId: { type: String, required: true, unique: true },
      identityNumber: { type: String, required: true, unique: true },
    }, { timestamps: true });
  
    const accessToken = mongoose.model('access_token', accessTokenModel);
  
    return accessToken;
}