import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatInput = ({
  micStatus,
  micPress,
  textInput,
  fillInput,
  onSubmitSearch,
}: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={micPress} activeOpacity={0.9}>
        <Ionicons
          name={micStatus ? 'mic-off' : 'mic'}
          color={COLORS.white}
          size={24}
          style={{paddingVertical: 10, paddingStart: 5, marginEnd: 5}}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.inputContainer}
        placeholder="Send a message"
        value={textInput}
        onChangeText={(data: any) => fillInput(data)}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.sendContainer, {marginStart: 5}]}
        onPress={onSubmitSearch}>
        <Ionicons name={'send'} color={COLORS.white} size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  inputContainer: {
    flex: 10,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    paddingStart: 10,
    padding: 5,
  },
  sendContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: COLORS.blue,
    padding: 8,
    marginEnd: 10,
  },
});
