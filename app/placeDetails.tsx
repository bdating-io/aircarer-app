// app/placeDetails.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PlaceDetails() {
    const router = useRouter();
  
    // 下拉菜单选项（示例，实际可从API或props获取）
    const properties = ['Property A', 'Property B', 'Property C'];
    const [selectedProperty, setSelectedProperty] = useState(properties[0]);
  
    // 清洁类型
    const [cleaningType, setCleaningType] = useState<'regular' | 'endOfLease'>('regular');
  
    // 是否自带工具
    const [equipmentProvided, setEquipmentProvided] = useState<'tasker' | 'owner'>('tasker');
  
    // 常见清洁工具 - 用一个数组来存储选中的工具
    const toolsList = [
      'Vacuum cleaner',
      'Mop & Bucket',
      'Broom & Dustpan',
      'Duster / Dust cloth',
      'All-purpose cleaner',
      'Disinfectant wipes',
      'Sponges / Scrub brush',
      'Rubber gloves',
    ];
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
  
    // (B) 若“多选里不包括”，让用户填一个Other
    const [otherTool, setOtherTool] = useState(''); // 存储用户自定义的工具名
  
    // 详情描述（至少 25 字）
    const [description, setDescription] = useState('');
  
    // 是否需要更换床单？
    const [changeSheets, setChangeSheets] = useState<boolean>(false);
  
    const handleToolSelection = (tool: string) => {
      // 如果已经选中，则取消；否则加入
      if (selectedTools.includes(tool)) {
        setSelectedTools(selectedTools.filter(t => t !== tool));
      } else {
        setSelectedTools([...selectedTools, tool]);
      }
    };
  
    const handleContinue = () => {
      // 如果选择了 "tasker" 并且填写了 OtherTool，则把它也并入 selectedTools 里
      // （也可以只在 handleToolSelection 时并入，本示例是在提交时才合并）
      let finalTools = [...selectedTools];
      if (equipmentProvided === 'tasker' && otherTool.trim().length > 0) {
        finalTools.push(otherTool.trim());
      }
  
      const payload = {
        selectedProperty,
        cleaningType,
        equipmentProvided,
        selectedTools: finalTools,
        description,
        changeSheets,
      };
  
      console.log('Form data:', payload);
      // 跳转到“日期选择”页面
      router.push('/dateSelection');
    };
  
    return (
      <ScrollView className="flex-1 bg-[#F8F9FA] px-4 pt-6">
        {/*
          选择房源
        */}
        <Text className="text-base mb-2 font-semibold">Select your property</Text>
        <View className="border border-gray-300 rounded-md px-2 py-1 mb-4">
          {properties.map((prop) => (
            <TouchableOpacity
              key={prop}
              onPress={() => setSelectedProperty(prop)}
              className={`py-2 ${selectedProperty === prop ? 'bg-gray-200' : ''}`}
            >
              <Text>{prop}</Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {/*
          清洁类型
        */}
        <Text className="text-base font-semibold mb-2">What kind of clean is this?</Text>
        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setCleaningType('regular')}
            className={`flex-1 mr-2 p-4 rounded-md items-center justify-center ${
              cleaningType === 'regular' ? 'bg-gray-300' : 'bg-gray-100'
            }`}
          >
            <Text>Regular</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCleaningType('endOfLease')}
            className={`flex-1 ml-2 p-4 rounded-md items-center justify-center ${
              cleaningType === 'endOfLease' ? 'bg-gray-300' : 'bg-gray-100'
            }`}
          >
            <Text>End of Lease</Text>
          </TouchableOpacity>
        </View>
  
        {/*
          选择工具来源
        */}
        <Text className="text-base font-semibold mb-2">
          Does the cleaner need to bring equipment and supplies?
        </Text>
        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setEquipmentProvided('tasker')}
            className={`flex-1 mr-2 p-3 rounded-md items-center justify-center ${
              equipmentProvided === 'tasker' ? 'bg-gray-300' : 'bg-gray-100'
            }`}
          >
            <Text>Yes, tasker brings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEquipmentProvided('owner')}
            className={`flex-1 ml-2 p-3 rounded-md items-center justify-center ${
              equipmentProvided === 'owner' ? 'bg-gray-300' : 'bg-gray-100'
            }`}
          >
            <Text>No, I will provide</Text>
          </TouchableOpacity>
        </View>
  
        {/*
          (A) 多选工具：只有当 equipmentProvided === 'tasker' 时才显示
        */}
        {equipmentProvided === 'tasker' && (
          <>
            <Text className="text-base font-semibold mb-2">Which tools should the cleaner bring?</Text>
            <View className="flex-row flex-wrap mb-4">
              {toolsList.map((tool) => {
                const isSelected = selectedTools.includes(tool);
                return (
                  <TouchableOpacity
                    key={tool}
                    onPress={() => handleToolSelection(tool)}
                    className={`border border-gray-300 rounded-full px-3 py-2 mr-2 mb-2 ${
                      isSelected ? 'bg-[#007BFF]' : 'bg-white'
                    }`}
                  >
                    <Text className={`${isSelected ? 'text-white' : 'text-black'}`}>
                      {tool}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
  
            {/*
              (B) Other: please comment
              若用户要添加一个不在 toolsList 中的工具，就在此输入
            */}
            <Text className="text-base font-semibold mb-2">Other (please comment)</Text>
            <View className="bg-white border border-gray-300 rounded-md px-3 py-2 mb-4">
              <TextInput
                placeholder="E.g. steam cleaners"
                placeholderTextColor="#888"
                value={otherTool}
                onChangeText={setOtherTool}
              />
            </View>
          </>
        )}
  
        {/*
          具体需求描述
        */}
        <Text className="text-base font-semibold mb-2">What needs cleaning?</Text>
        <View className="mb-4">
          <TextInput
            className="bg-white border border-gray-300 rounded-md p-3 text-base"
            placeholder="E.g. carpets vacuumed, oven cleaned, etc. (Minimum 25 words)"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>
  
        {/*
          是否更换床单
        */}
        <Text className="text-base font-semibold mb-2">
          Change the sheets and cover?
        </Text>
        <View className="flex-row mb-8">
          <TouchableOpacity
            onPress={() => setChangeSheets(true)}
            className={`flex-1 mr-2 p-3 rounded-md items-center justify-center ${
              changeSheets ? 'bg-gray-300' : 'bg-gray-100'
            }`}
          >
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setChangeSheets(false)}
            className={`flex-1 ml-2 p-3 rounded-md items-center justify-center ${
              !changeSheets ? 'bg-gray-300' : 'bg-gray-100'
            }`}
          >
            <Text>No</Text>
          </TouchableOpacity>
        </View>
  
        {/*
          提交按钮
        */}
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-[#007BFF] rounded-md p-4 mb-6"
        >
          <Text className="text-white text-center font-bold text-base">
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }