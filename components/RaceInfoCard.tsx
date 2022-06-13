import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {HelperMethods} from '../utils/HelperMethods';
import {CountDownTimer} from './CountDownTimer';

export const RaceInfoCard = ({
  raceData,
  action,
}: {
  raceData: any;
  action: Function;
}) => {
  const helperMethods = new HelperMethods();

  return (
    <View style={styles.raceContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Text style={styles.cardTitle}>
            {helperMethods.getRaceTypeForCategoryId(raceData.category_id)}
          </Text>
          <CountDownTimer
            time={raceData.advertised_start.seconds}
            action={action}
          />
        </View>
        <Text style={styles.cardSubTitle}>{raceData.meeting_name}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 5,
        }}>
        <Text>{raceData.race_name}</Text>
        <Text>Race #{raceData.race_number}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingRight: 5,
  },
  cardSubTitle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  raceContainer: {
    width: 'auto',
    backgroundColor: '#ffffff',
    minWidth: 100,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
