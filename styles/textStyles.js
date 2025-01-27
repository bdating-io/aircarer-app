// textStyles.js
import { StyleSheet } from "react-native";

const textStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000", // 标题颜色
  },
  dropdownText: {
    fontSize: 16,
    color: "#333", // 下拉选项的默认颜色
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333", // 下拉菜单每一项的颜色
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // 按钮文字颜色
  },
});

export default textStyles;
