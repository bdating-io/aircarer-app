import { decode } from 'base64-arraybuffer';
import { supabase } from '.';
import { ImagePickerAsset } from 'expo-image-picker';

export const supabaseStorageClient = {
  uploadImage: async (
    path: string,
    imageAsset: ImagePickerAsset,
    fileExt?: string,
  ) => {
    // 确保图片有base64数据
    if (!imageAsset.base64) {
      throw new Error('No image data available');
    }

    const { data, error } = await supabase.storage
      .from('profile-documents')
      .upload(path, decode(imageAsset.base64), {
        contentType: `image/${fileExt}`,
      });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  getPublicUrl: (path: string) => {
    const { data: urlData } = supabase.storage
      .from('profile-documents')
      .getPublicUrl(path);
    return urlData;
  },
};
