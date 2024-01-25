import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, FONT} from '../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

interface IProps {
  data: {};
}

const Card = (props: IProps) => {
  const {data}: any = props;
  return (
    <TouchableOpacity onPress={() => {}} style={styles.container}>
      <View style={styles.imageContainer}>
        <MaterialCommunityIcons
          name={data?.image}
          size={wp(7.64)}
          color={data?.color}
        />
      </View>
      <Text style={styles.title}>{data?.title}</Text>
      <Text style={styles.description}>{data?.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    backgroundColor: COLORS.cards,
    flex: 1,
    marginHorizontal: wp(1.3),
    marginVertical: wp(1.3),
    borderRadius: wp(2.6),
    padding: wp(2.6),
  },
  imageContainer: {
    marginStart: wp(2.6),
    marginTop: wp(1.3),
  },
  title: {
    marginStart: wp(2.6),
    fontSize: wp(4.6),
    marginTop: wp(2.6),
    color: COLORS.white,
    fontFamily: FONT.notoSansMedium,
  },
  description: {
    marginStart: wp(2.6),
    fontSize: wp(3.9),
    marginTop: wp(1.3),
    color: COLORS.white,
    fontFamily: FONT.notoSansRegular,
  },
});

export default Card;
