import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {globalStyle} from '../styles/globalStyle';
import ChatHeader from '../components/ChatHeader';
import {Bubble, GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {getChatGPTResponse, imageArtGeneration} from '../configs';
import {COLORS, FONT} from '../constants';
import Voice from '@react-native-voice/voice';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {requestMicrophonePermission} from '../utils/AskPermission';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import useAppContext from '../context/useAppContext';
import {BackHandler} from 'react-native';
import {RewardedVideo} from '../utils/IronSource';

const initialLanguage = [
  'English',
  'Chinese',
  'French',
  'German',
  'Gujarati',
  'Hindi',
  'Italian',
  'Japanese',
  'Korean',
  'Russian',
  'Spanish',
];

const Chat = (props: any) => {
  const {
    storeChat,
    authUser,
    getChatCollectionData,
    aiAPIKey,
    adsDetails,
  }: any = useAppContext();
  const inputRef: any = useRef();
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [isOnMic, setIsOnMic] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [firstLanguage, setFirstLanguage] = useState('English');
  const [secondLanguage, setSecondLanguage] = useState('');

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const handleBackPress = () => {
    adsDetails?.showAdsGlobally && RewardedVideo(adsDetails?.rewardPlacement);
    return false;
  };

  useEffect(() => {
    const data = async () => {
      setIsLoader(true);
      const chatData = await getChatCollectionData(
        props?.route?.params?.aiType
          ? props?.route?.params?.aiType
          : 'generalChat',
      );
      chatData?.map((singleChat: any) => {
        singleChat.createdAt = JSON.parse(singleChat.createdAt);
      });
      setMessages(chatData);
      setIsLoader(false);
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
          avatar: authUser?.userImageUrl,
          name: authUser?.email,
        },
      },
    ]);
  };

  const onSpeechErrorHandler = (e: any) => {
    console.log('Speech error handler', e);
    setIsOnMic(false);
  };

  const onSend = useCallback(
    async (messages: any) => {
      inputRef?.current?.clear();
      setMessages((previousMessages: any) =>
        GiftedChat.append(previousMessages, messages),
      );
      setIsTyping(true);
      const userChat = await storeChat(
        messages[0],
        props?.route?.params?.aiType
          ? props?.route?.params?.aiType
          : 'generalChat',
      );
      if (userChat?.code) {
        setIsTyping(false);
      } else {
        const userMessage = messages[0].text;
        const gptResponse: any =
          props?.route?.params?.aiType === 'Art'
            ? await imageArtGeneration(aiAPIKey, userMessage)
            : await getChatGPTResponse(
                aiAPIKey,
                props?.route?.params?.aiType,
                userMessage,
                firstLanguage,
                secondLanguage,
              );

        const responseObject = {
          _id: Math.random(),
          ...(props?.route?.params?.aiType === 'Art' && {
            image: gptResponse?.data[0]?.url,
          }),
          ...(props?.route?.params?.aiType != 'Art' && {text: gptResponse}),
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
      }
      setIsTyping(false);
    },
    [secondLanguage],
  );

  const RenderEmpty = (props: any) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        {isLoader && <ActivityIndicator color={COLORS.white} size={'small'} />}
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
          name={'chevron-down-outline'}
          size={26}
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
                  backgroundColor: COLORS.lightBlue,
                },
              ]}>
              <Ionicons color={COLORS.white} name={'send'} size={wp(4.6)} />
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const Bubbles = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.lightBlue,
          },
          left: {
            backgroundColor: COLORS.cards,
          },
        }}
        textStyle={{
          right: {
            fontFamily: FONT.notoSansMedium,
            fontSize: wp(3.6),
            color: COLORS.white,
          },
          left: {
            fontFamily: FONT.notoSansMedium,
            fontSize: wp(3.6),
            color: COLORS.white,
          },
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ChatHeader
        title={props?.route?.params?.aiType ? props?.route?.params?.aiType : ''}
        shouldBackBtnVisible={props?.route?.params?.shouldBackBtnVisible}
      />

      {(props?.route?.params?.aiType === 'Translate' ||
        props?.route?.params?.aiType === 'Health') && (
        <View
          style={{
            height: wp(12),
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <SelectDropdown
            data={initialLanguage}
            dropdownStyle={{borderRadius: 10}}
            selectedRowTextStyle={styles.selectedRowTextStyle}
            buttonStyle={styles.buttonStyle}
            defaultValueByIndex={0}
            buttonTextStyle={styles.buttonTextStyle}
            selectedRowStyle={styles.selectedRowStyle}
            defaultButtonText="Select language"
            rowTextStyle={styles.rowTextStyle}
            onSelect={(selectedItem, index) => {
              setFirstLanguage(selectedItem);
            }}
          />

          <Text style={styles.heading}>To</Text>

          <SelectDropdown
            data={initialLanguage}
            dropdownStyle={{borderRadius: 10}}
            selectedRowTextStyle={styles.selectedRowTextStyle}
            buttonStyle={styles.buttonStyle}
            buttonTextStyle={styles.buttonTextStyle}
            selectedRowStyle={styles.selectedRowStyle}
            defaultButtonText="Select language"
            rowTextStyle={styles.rowTextStyle}
            onSelect={(selectedItem, index) => {
              setSecondLanguage(selectedItem);
            }}
          />
        </View>
      )}
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
          renderBubble={(props: any) => <Bubbles {...props} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {backgroundColor: COLORS.background, flex: 1},
  messageContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderTopWidth: 0.8,
    borderColor: '#181D2C',
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
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  inputContainerStyle: {
    backgroundColor: COLORS.tabBackColor,
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderTopColor: COLORS.tabBackColor,
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
  image: {
    height: wp(30),
    width: wp(60),
  },
  selectedRowTextStyle: {
    color: COLORS.black,
    fontSize: wp(4),
    fontFamily: FONT.notoSansMedium,
  },
  buttonStyle: {
    backgroundColor: COLORS.lightWhite,
    height: wp(8),
    width: '38%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
  buttonTextStyle: {
    fontFamily: FONT.notoSansMedium,
    fontSize: wp(3.5),
  },
  selectedRowStyle: {
    backgroundColor: COLORS.lightWhite,
  },
  rowTextStyle: {
    fontSize: wp(3.5),
    fontFamily: FONT.notoSansLight,
  },
  heading: {
    color: COLORS.white,
    fontFamily: FONT.notoSansMedium,
    fontSize: hp(2),
    alignSelf: 'center',
  },
});

export default Chat;
