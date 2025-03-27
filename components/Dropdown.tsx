import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownProps {
  title: string;
  placeholder: string;
  options: string[];
  selectedOption: string;
  // 支持传入字符串或对象
  titleStyle?: string | StyleProp<TextStyle>;
  textStyles?: string | StyleProp<TextStyle>;
  dropdownStyle?: string | StyleProp<ViewStyle>;
  onSelect: (option: string) => void;
}

const Dropdown = ({
  title,
  options,
  selectedOption,
  placeholder,
  titleStyle,
  textStyles,
  dropdownStyle,
  onSelect,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderTitle = () => {
    if (typeof titleStyle === 'string') {
      return <Text className={titleStyle}>{title}</Text>;
    }
    return <Text style={titleStyle}>{title}</Text>;
  };

  const renderText = () => {
    if (typeof textStyles === 'string') {
      return <Text className={textStyles}>{selectedOption || placeholder}</Text>;
    }
    return <Text style={textStyles}>{selectedOption || placeholder}</Text>;
  };

  const containerStyle =
    typeof dropdownStyle === 'string'
      ? { className: dropdownStyle }
      : dropdownStyle;

  return (
    <View style={{ marginBottom: 16 }}>
      {renderTitle()}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        // 如果使用 tailwind 库，请确保 dropdownStyle 有效，否则使用 style prop
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#1E90FF',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 14,
          },
          // 如果 dropdownStyle 为对象则合并进去
          typeof dropdownStyle !== 'string' ? dropdownStyle : {},
        ]}
      >
        {renderText()}
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
      </TouchableOpacity>
      {isOpen && (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#ccc',
            borderTopWidth: 0,
            marginTop: -1,
          }}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderColor: '#eee',
              }}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text style={{ fontSize: 16, color: '#000' }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Dropdown;

