import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/clients/supabase';
import { supabaseAuthClient } from '@/clients/supabase/auth';
import { DOCUMENT_TYPE_LABELS, DocumentType } from '@/types/backgroundChecks'; // 假设你在 types 目录下定义了 DocumentType 类型

export default function VerificationScreen() {
    const [selectedOption, setSelectedOption] = useState<DocumentType>('none');
    const [docImage, setDocImage] = useState<string | null>(null);
    const [docBackImage, setDocBackImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const navigation = useNavigation();

    const insertDocRecord = async ({ userId, docType, docUrl, docBackUrl }: {
        userId: string;
        docType: string;
        docUrl: string;
        docBackUrl?: string;
    }) => {
        try {
            const { error } = await supabase.from('background_checks').insert([
                {
                    user_id: userId,
                    doc_type: docType,
                    doc_url: docUrl,
                    doc_back_url: docBackUrl ?? null,
                    status: 'pending',
                    updated_at: new Date().toISOString(),
                },
            ]);

            if (error) {
                Alert.alert('Error', 'Failed to insert');
                console.error('[Insertion Error]', error);
                return;
            }
            Alert.alert('Success', 'Document record saved!');
        } catch (error) {
            console.error('Insert Error:', error);
            Alert.alert('Error', 'Failed to save document record');
        }
    };

    const decode = (base64: string): Uint8Array => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    const handleUpload = async () => {
        if (!docImage) return;
        setUploading(true);
        try {
            const user = await supabaseAuthClient.getUser();
            if (!user) {
                Alert.alert('Error', 'User not authenticated');
                console.error('AUTH ERROR: User not authenticated');
                return;
            }
            const userId = user.id;

            const uploadImage = async (uri: string, label: string): Promise<string> => {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                const filePath = `background-checks/${userId}_${label}_${Date.now()}.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from('profile-documents')
                    .upload(filePath, decode(base64), {
                        contentType: 'image/jpeg',
                        cacheControl: '3600',
                    });
                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('profile-documents')
                    .getPublicUrl(filePath);
                return urlData.publicUrl;
            };

            const docImageUrl = await uploadImage(docImage, 'front');
            const docBackImageUrl = docBackImage ? await uploadImage(docBackImage, 'back') : undefined;

            await insertDocRecord({
                userId,
                docType: selectedOption,
                docUrl: docImageUrl,
                docBackUrl: docBackImageUrl,
            });

            Alert.alert('Success', 'Documents uploaded and saved!');
            setSelectedOption('none');
            setDocImage(null);
            setDocBackImage(null);
        } catch (error) {
            console.error('[Upload Error]', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            Alert.alert('Upload Failed', errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const pickImage = async (side: 'front' | 'back', fromCamera: boolean = false) => {
        try {
            const permissionMethod = fromCamera
                ? ImagePicker.requestCameraPermissionsAsync
                : ImagePicker.requestMediaLibraryPermissionsAsync;

            const { status } = await permissionMethod();
            if (status !== 'granted') {
                Alert.alert('Permission denied', fromCamera ? 'Camera' : 'Gallery' + ' permission is required.');
                return;
            }

            const result = fromCamera
                ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
                : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });

            if (!result.canceled && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                if (side === 'front') setDocImage(uri);
                else setDocBackImage(uri);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to select image';
            Alert.alert('Error', message);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-4 py-6">
                <Text className="text-2xl font-bold mb-2 text-center">Verify Your Identity</Text>
                <Text className="text-base text-gray-600 text-center mb-6">
                    Choose a document type below to start verifying your identity.
                </Text>

                {selectedOption === 'none' && (
                    <View className="space-y-4">
                        {(['license', 'passport'] as DocumentType[]).map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setSelectedOption(type)}
                                className="p-4 bg-gray-100 rounded-xl flex-row justify-between items-center"
                            >
                                <Text className="text-base font-medium capitalize">{DOCUMENT_TYPE_LABELS[type as keyof typeof DOCUMENT_TYPE_LABELS]}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#888" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {selectedOption !== 'none' && (
                    <View className="mt-6">
                        <Text className="text-lg font-semibold mb-4">
                            {selectedOption === 'license'
                                ? 'Upload your Driver License (Front and Back)'
                                : 'Upload your Passport'}
                        </Text>

                        <View className="space-y-3">
                            <Text className="text-sm font-medium">Front Side</Text>
                            <View className="flex-row gap-4">
                                <TouchableOpacity onPress={() => pickImage('front', false)} className="flex-1 bg-gray-100 p-4 rounded-lg items-center">
                                    <Ionicons name="images-outline" size={28} color="#555" />
                                    <Text className="text-xs text-gray-700 mt-1">Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => pickImage('front', true)} className="flex-1 bg-gray-100 p-4 rounded-lg items-center">
                                    <Ionicons name="camera-outline" size={28} color="#555" />
                                    <Text className="text-xs text-gray-700 mt-1">Take Photo</Text>
                                </TouchableOpacity>
                            </View>
                            {docImage && (
                                <View className="mt-4 items-center">
                                    <Image source={{ uri: docImage }} className="w-60 h-36 rounded-lg" resizeMode="cover" />
                                    <Text className="text-sm text-gray-600 mt-1">Front preview</Text>
                                </View>
                            )}

                            {selectedOption === 'license' && (
                                <>
                                    <Text className="text-sm font-medium mt-4">Back Side</Text>
                                    <View className="flex-row gap-4">
                                        <TouchableOpacity onPress={() => pickImage('back', false)} className="flex-1 bg-gray-100 p-4 rounded-lg items-center">
                                            <Ionicons name="images-outline" size={28} color="#555" />
                                            <Text className="text-xs text-gray-700 mt-1">Gallery</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => pickImage('back', true)} className="flex-1 bg-gray-100 p-4 rounded-lg items-center">
                                            <Ionicons name="camera-outline" size={28} color="#555" />
                                            <Text className="text-xs text-gray-700 mt-1">Take Photo</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {docBackImage && (
                                        <View className="mt-4 items-center">
                                            <Image source={{ uri: docBackImage }} className="w-60 h-36 rounded-lg" resizeMode="cover" />
                                            <Text className="text-sm text-gray-600 mt-1">Back preview</Text>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>

                        <View className="space-y-4 mt-6">
                            <TouchableOpacity onPress={handleUpload} disabled={uploading} className="bg-blue-600 px-6 py-3 rounded-xl">
                                <Text className="text-white text-base font-medium text-center">
                                    {uploading ? 'Uploading...' : 'Upload Now'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setSelectedOption('none')} className="mt-4">
                                <Text className="text-blue-500 text-center">Back to Document Options</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <TouchableOpacity onPress={() => navigation.goBack()} className="mt-10">
                    <Text className="text-blue-500 text-center">Back to Profile</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
