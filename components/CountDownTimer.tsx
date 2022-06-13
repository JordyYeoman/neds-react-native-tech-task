import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {HelperMethods} from '../utils/HelperMethods';

export const CountDownTimer = ({
  time,
  action,
}: {
  time: number;
  action: Function;
}) => {
  const helperMethods = new HelperMethods();
  const [countDown, setCountDown] = useState<any>(0);
  let formattedTime = helperMethods.getTimeUntilRaceFromAdvertisedStart(time);
  let textColor =
    typeof formattedTime === 'number' && formattedTime && formattedTime <= 60
      ? 'red'
      : '#000000';

  useEffect(() => {
    // Keep the interval ID returned by the setInterval() method in a variable to prevent memory leak
    const intervalId = setInterval(() => {
      // Method to trigger re-render of countdown component at second.
      setCountDown((prevCount: number) => prevCount + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Call to API if ​formattedTime has exceeded -60.
  // Calling the action() method will trigger a re-render of the scrollView lists.
  if (
    typeof formattedTime === 'number' &&
    formattedTime &&
    formattedTime < -60
  ) {
    action();
  }

  return (
    <View style={styles.countDownTimer}>
      <TouchableOpacity
        onPress={() => {
          action();
        }}>
        <Text style={[styles.countDownText, {color: textColor}]}>
          {formattedTime}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  countDownTimer: {
    padding: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  countDownText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});
