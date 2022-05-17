import React, { Component, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  LogBox,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { ImageBrowser } from "expo-image-picker-multiple";
import * as FileSystem from "expo-file-system";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const getFileInfo = async (fileURI) => {
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  return fileInfo;
};

const isLessThanTheMB = (fileSize, smallerThanSizeMB) => {
  const isOk = fileSize / 1024 / 1024 < smallerThanSizeMB;
  return isOk;
};

const ImageBrowserScreen = ({ navigation, route }) => {
  const [count, setCount] = useState(route.params.count);

  const imagesCallback = (callback) => {
    callback
      .then(async (photos) => {
        console.log(count);
        let checkPhoto = true;
        const cPhotos = [];
        for (let photo of photos) {
          const pPhoto = await _processImageAsync(photo.uri);
          // console.log(pPhoto);
          if (pPhoto != -1) {
            cPhotos.push({
              uri: pPhoto.uri,
              name: photo.filename,
              type: "image/jpg",
            });
          } else checkPhoto = false;
        }
        // route.params.
        route.params.onGoBack(cPhotos);
        navigation.goBack();
      })
      .catch((e) => console.log(e));
  };

  async function _processImageAsync(uri) {
    const fileInfo = await getFileInfo(uri);
    if (!fileInfo?.size) {
      console.log("Nie można wybrać tego pliku.\n Rozmiar nieznany.");
    }
    const isLt4MB = isLessThanTheMB(fileInfo.size, 4);
    if (!isLt4MB) {
      console.log("Rozmiar zdjęcia nie może być większy niż 4MB!");
    } else {
      const file = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1000 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return file;
    }
    return -1;
  }

  const _renderDoneButton = (count, onSubmit) => {
    if (!count) return null;
    return (
      <TouchableOpacity title={"Done"} onPress={onSubmit}>
        <Text onPress={onSubmit}>Zakończ</Text>
      </TouchableOpacity>
    );
  };

  const updateHandler = (count, onSubmit) => {
    navigation.setOptions({
      title: `Wybrano ${count}`,
      headerRight: () => _renderDoneButton(count, onSubmit),
    });
  };

  const renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  return (
    <View style={[styles.flex, styles.container]}>
      <ImageBrowser
        onChange={updateHandler}
        callback={imagesCallback}
        renderSelectedComponent={renderSelectedComponent}
        max={count}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: "relative",
  },
  emptyStay: {
    textAlign: "center",
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: "absolute",
    right: 3,
    bottom: 3,
    justifyContent: "center",
    backgroundColor: "#0580FF",
  },
  countBadgeText: {
    fontWeight: "bold",
    alignSelf: "center",
    padding: "auto",
    color: "#ffffff",
  },
});

export default ImageBrowserScreen;
