import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { supabase } from '../supabase';
import { categories } from '../types/categories';
import { styles } from '../styles/add.expenses.screen';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import * as ImageManipulator from 'expo-image-manipulator';

const AddExpenseScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);


  const saveExpense = async () => {
    if (!amount) return Alert.alert('Enter a valid amount.');

    const newExpense = {
      amount: parseFloat(amount),
      category,
      note,
    };

    try {
      const { error } = await supabase.from('expenses').insert([newExpense]);
      if (error) throw error;

      Alert.alert('Saved!', 'Expense saved to Supabase.');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error saving to Supabase.');
    }
  };

const OCR_SPACE_API_KEY = 'K89683647188957';

const handleScanReceipt = async () => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setLoading(true);
      const asset = result.assets[0];
      const uri = asset.uri;

      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1000 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      const resizedUri = manipulated.uri;
      const base64Img = manipulated.base64;

      if (!base64Img || !resizedUri) {
        Alert.alert('Scan failed', 'No image data found.');
        return;
      }

      // ✅ Upload to Supabase
      const fileExt = 'jpg';
      const fileName = `${uuid.v4()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const fileData = await FileSystem.readAsStringAsync(resizedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, fileData, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError.message);
        Alert.alert('Error uploading image');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);
      const imageUrl = urlData?.publicUrl || '';

      // ✅ OCR with OCR.Space
      try {
        const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: {
            apikey: OCR_SPACE_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            base64Image: `data:image/jpeg;base64,${base64Img}`,
            language: 'eng',
            isOverlayRequired: 'false',
          }).toString(),
        });

        const ocrJson = await ocrResponse.json();
        
        const parsedText = ocrJson?.ParsedResults?.[0]?.ParsedText || '';
        console.log('📄 Parsed Text:\n' + parsedText);

      } catch (err) {
        console.error('🔥 OCR fetch failed:', err);
        Alert.alert('OCR Error', 'Failed to send image to OCR API. Check your internet or API key.');
      }
    }
  } catch (error) {
    console.error('Scan error:', error);
    Alert.alert('Error', 'Failed to scan receipt.');
  } finally {
    setLoading(false);
  }
};



  return (
     <>
     {/* Loading Modal */}
    {loading && (
      <Modal transparent animationType="fade" visible>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 24,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color="#111" />
            <Text style={{ marginTop: 16, fontSize: 16, fontWeight: 600, }}>Scanning receipt...</Text>
          </View>
        </View>
      </Modal>
    )}
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Add New Expense</Text>

          

          <TouchableOpacity style={styles.scanButton} onPress={handleScanReceipt}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="camera-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
    <Text style={styles.scanButtonText}>Scan Receipt</Text>
  </View>
</TouchableOpacity>

          <Text style={styles.label}>Amount (RM)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 25.50"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryButton,
                  category === cat.value && styles.activeCategory,
                ]}
                onPress={() => setCategory(cat.value)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.value && styles.activeCategoryText,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Write a short note..."
            value={note}
            onChangeText={setNote}
            multiline
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveExpense}>
            <Text style={styles.saveButtonText}>Save Expense</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
  );
};

export default AddExpenseScreen;

// let match = text.match(/(?:RM|\$)?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(\.\d{2})?)/i);

      // if (!match) {
      //   const totalLine = text
      //     .split('\n')
      //     .find((line: string) => /total/i.test(line) && /\d/.test(line));

      //   if (totalLine) {
      //     match = totalLine.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(\.\d{2})?)/);
      //   }
      // }

      // if (match) {
      //   const amountValue = match[1].replace(/,/g, '');

      //   const newExpense = {
      //     amount: parseFloat(amountValue),
      //     category,
      //     note: note || 'Scanned receipt',
      //     image_url: imageUrl,
      //   };

      //   const { error: insertError } = await supabase
      //     .from('expenses')
      //     .insert([newExpense]);

      //   if (insertError) {
      //     console.error('Insert error:', insertError.message);
      //     Alert.alert('Failed to save expense.');
      //   } else {
      //     setAmount(amountValue);
      //     Alert.alert('Scanned & Saved!', `Detected: RM${amountValue}`);
      //   }
      // } else {
      //   Alert.alert('Scan failed', 'No amount detected.');
      // }