import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {TimeFilter} from '../utils/enums';

export const FilterButton = ({
  title,
  isActiveFilter,
  timeFilter,
  action,
}: {
  title: string;
  isActiveFilter: boolean;
  timeFilter?: TimeFilter;
  action: any;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {backgroundColor: isActiveFilter ? '#000000' : '#ffffff'},
      ]}
      onPress={() => {
        action();
      }}>
      <Text style={{color: isActiveFilter ? '#ffffff' : '#000000'}}>
        {title}
      </Text>
      {timeFilter ? (
        <View style={styles.sortTexContainer}>
          <Text style={styles.sortText}>
            {timeFilter === TimeFilter.ascending ? 'Ascending' : 'Descending'}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    padding: 14,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  sortTexContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    bottom: 5,
  },
  sortText: {
    fontSize: 10,
  },
});
