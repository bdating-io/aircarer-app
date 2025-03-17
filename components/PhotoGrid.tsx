import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface PhotoGridProps {
  images: string[];
  onImagesChange: (newImages: string[]) => void; // 通知父组件更新
  maxImages?: number;                            // 可选，默认9
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  images,
  onImagesChange,
  maxImages = 9,
}) => {
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // 仅iOS14+支持
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      const newImages = [...images];
      for (const asset of result.assets) {
        if (newImages.length < maxImages) {
          newImages.push(asset.uri);
        } else {
          break;
        }
      }
      onImagesChange(newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const renderGridItems = () => {
    // 注意在 React Native 中，不能直接使用 <img> 标签
    // 需要使用 <Image /> 组件
    const gridItems = images.map((uri, index) => (
      <View style={styles.imageWrapper} key={index}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveImage(index)}
        >
          <Text style={{ color: '#fff' }}>X</Text>
        </TouchableOpacity>
        <Image
          source={{ uri }}
          style={styles.image}
        />
      </View>
    ));

    if (images.length < maxImages) {
      gridItems.push(
        <TouchableOpacity
          key="add-button"
          style={[styles.imageWrapper, styles.addImageWrapper]}
          onPress={pickImages}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      );
    }
    return gridItems;
  };

  return <View style={styles.gridContainer}>{renderGridItems()}</View>;
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    width: '30%',
    aspectRatio: 1, // 保持正方形
    margin: '1.5%',
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // 替代 objectFit: 'cover'
  },
  addImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  addText: {
    fontSize: 28,
    color: '#888',
  },
});


export default PhotoGrid;
