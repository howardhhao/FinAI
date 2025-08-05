import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { styles } from '../styles/add.expenses.screen';

const BudgetModal = ({ visible, onClose, onSave }: any) => {
  const [budget, setBudget] = useState('');

  const handleBackgroundPress = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.label}>Set Budget (RM)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 100.00"
                keyboardType="numeric"
                value={budget}
                onChangeText={setBudget}
              />
              <TouchableOpacity
  style={styles.saveButton}
  onPress={async () => {
    const numericBudget = parseFloat(budget);

    if (isNaN(numericBudget) || numericBudget <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid amount greater than 0.');
      return;
    }

    const success = await onSave(numericBudget);
    if (success) {
      setBudget('');
      onClose();
      Alert.alert('Saved!', `Budget set to RM${numericBudget.toFixed(2)}`);
    } else {
      Alert.alert('Error', 'Failed to save budget.');
    }
  }}
>
  <Text style={styles.saveButtonText}>Update Budget</Text>
</TouchableOpacity>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BudgetModal;