import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {globalStyle} from '../styles/globalStyle';
import ChatHeader from '../components/ChatHeader';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {getChatGPTResponse, imageArtGeneration} from '../configs';
import {COLORS, FONT} from '../constants';
import Voice from '@react-native-voice/voice';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {requestMicrophonePermission} from '../utils/AskPermission';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAppContext from '../context/useAppContext';

const Chat = (props: any) => {
  const {storeChat, authUser, getChatCollectionData}: any = useAppContext();
  const inputRef: any = useRef();
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [isOnMic, setIsOnMic] = useState(false);

  useEffect(() => {
    const data = async () => {
      const chatData = await getChatCollectionData(
        props?.route?.params?.aiType
          ? props?.route?.params?.aiType
          : 'generalChat',
      );
      chatData?.map((singleChat: any) => {
        singleChat.createdAt = JSON.parse(singleChat.createdAt);
      });
      setMessages(chatData);
    };
    data();
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechErrorHandler;

    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
    };
  }, []);

  const onSpeechStartHandler = (e: any) => {};

  const onSpeechEndHandler = () => {
    setIsOnMic(false);
  };

  const onSpeechResultsHandler = (e: any) => {
    onSend([
      {
        _id: Math.random(),
        createdAt: new Date(),
        text: e.value[0],
        user: {
          _id: 1,
        },
      },
    ]);
  };

  const onSpeechErrorHandler = (e: any) => {
    console.log('Speech error handler', e);
    setIsOnMic(false);
  };

  const onSend = useCallback(async (messages: any) => {
    inputRef?.current?.clear();
    setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, messages),
    );
    setIsTyping(true);
    await storeChat(
      messages[0],
      props?.route?.params?.aiType
        ? props?.route?.params?.aiType
        : 'generalChat',
    );
    const userMessage = messages[0].text;
    const gptResponse: any =
      props?.route?.params?.aiType === 'Art'
        ? await imageArtGeneration(userMessage)
        : await getChatGPTResponse(userMessage);

    const responseObject = {
      _id: Math.random(),
      ...(props?.route?.params?.aiType === 'Art' && {
        image: gptResponse?.data[0]?.url,
      }),
      ...(props?.route?.params?.aiType == undefined && {text: gptResponse}),
      createdAt: new Date(),
      user: {
        _id: '2',
        name: 'ChatGPT',
        avatar:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf_jxvmlHQ4r4ful-PsH6MRHOAm6T6sskKZQ&usqp=CAU',
      },
    };
    await setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, [responseObject]),
    );
    await storeChat(
      responseObject,
      props?.route?.params?.aiType
        ? props?.route?.params?.aiType
        : 'generalChat',
    );
    setIsTyping(false);
  }, []);

  const RenderEmpty = (props: any) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Text style={styles.emptyText}>How can I help you today?</Text>
      </View>
    );
  };

  const startRecording = async () => {
    const permission = await requestMicrophonePermission();
    if (permission) {
      try {
        setIsOnMic(true);
        await Voice.start('en-GB');
      } catch (error) {
        console.log('Error when record audio :', error);
      }
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsOnMic(false);
    } catch (error) {
      console.log('Error when record audio OFF :', error);
    }
  };

  const customDownButton = () => {
    return (
      <View style={styles.customDown}>
        <Ionicons
          name={'chevron-down-circle'}
          size={30}
          color={COLORS.background}
        />
      </View>
    );
  };

  const renderInput = (props: any) => {
    return (
      <InputToolbar
        textInputStyle={{color: '#fff'}}
        {...props}
        containerStyle={styles.inputContainerStyle}
        renderActions={() => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => (!isOnMic ? startRecording() : stopRecording())}
              style={[
                styles.actionButton,
                {marginStart: 10, backgroundColor: COLORS.lightWhite},
              ]}>
              <Ionicons
                color={COLORS.black}
                name={isOnMic ? 'mic-off' : 'mic'}
                size={wp(4.6)}
              />
            </TouchableOpacity>
          );
        }}
        renderSend={() => {
          return (
            <TouchableOpacity
              onPress={() =>
                onSend([
                  {
                    _id: Math.random(),
                    createdAt: new Date(),
                    text: props?.text.trim(),
                    user: {
                      _id: 1,
                      avatar: authUser?.userImageUrl,
                      name: authUser?.email,
                    },
                  },
                ])
              }
              disabled={props?.text.trim().length == 0 ? true : false}
              activeOpacity={0.8}
              style={[
                styles.actionButton,
                {
                  marginEnd: 10,
                  backgroundColor: COLORS.blue,
                },
              ]}>
              <Ionicons color={COLORS.white} name={'send'} size={wp(4.6)} />
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  return (
    <View style={globalStyle.container}>
      <ChatHeader />
      <View style={styles.messageContainer}>
        <GiftedChat
          textInputRef={inputRef}
          messages={messages}
          user={{
            _id: 1,
            avatar: authUser?.userImageUrl,
            name: authUser?.email,
          }}
          alwaysShowSend={true}
          isTyping={isTyping}
          infiniteScroll={true}
          inverted={messages?.length !== 0}
          messagesContainerStyle={
            messages?.length !== 0 ? null : {transform: [{scaleY: -1}]}
          }
          scrollToBottom={true}
          scrollToBottomComponent={customDownButton}
          renderInputToolbar={(props: any) => renderInput(props)}
          isLoadingEarlier={true}
          renderChatEmpty={(props: any) => <RenderEmpty {...props} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    backgroundColor: COLORS.grayDark,
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
  },
  emptyText: {
    fontSize: wp(4),
    color: COLORS.lightWhite,
    textAlign: 'center',
    fontFamily: FONT.notoSansRegular,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customDown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainerStyle: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderTopColor: COLORS.background,
    minHeight: wp(12),
  },
  actionButton: {
    height: wp(8.6),
    width: wp(8.6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(4.3),
    alignSelf: 'center',
  },
});

export default Chat;
