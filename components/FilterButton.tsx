import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export const FilterButton = ({
  title,
  isActiveFilter,
  action,
}: {
  title: string;
  isActiveFilter: boolean;
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
});
