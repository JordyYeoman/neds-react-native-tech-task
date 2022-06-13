/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * Demo Neds Horse Racing Layout
 * https://www.neds.com.au/
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CountDownTimer} from './components/CountDownTimer';
import {FilterButton} from './components/FilterButton';
import {RaceInfoCard} from './components/RaceInfoCard';
import {RaceType, TimeFilter} from './utils/enums';
import {HelperMethods} from './utils/HelperMethods';

const App = () => {
  const URL =
    'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10';
  const helperMethods = new HelperMethods();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any>();
  const [refreshing, setRefreshing] = React.useState(false);
  const [raceTypeFilter, setRaceTypeFilter] = useState<RaceType | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(
    TimeFilter.ascending,
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUpcomingRaces(
      'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10',
    );
    // Add timeout to show user that an action has occurred.
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Get 10 of the upcoming races
  const getUpcomingRaces = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      // Data is returned from API in ascending order.
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      console.log('DATA FETCHED');
      setLoading(false);
    }
  };

  // Toggle list sort direction for time until event in either ascending or descending.
  const toggleTimeUntilEventSortDirection = () => {
    switch (timeFilter) {
      case TimeFilter.ascending:
        sortUpcomingEventsBytime(timeFilter);
        return setTimeFilter(TimeFilter.descending);
      case TimeFilter.descending:
        sortUpcomingEventsBytime(timeFilter);
        return setTimeFilter(TimeFilter.ascending);
      default:
        sortUpcomingEventsBytime(timeFilter);
        return setTimeFilter(TimeFilter.descending);
    }
  };
  // Sort data method
  const sortUpcomingEventsBytime = async (sortDirection: TimeFilter) => {
    await helperMethods.getRacesInSortedOrderForTimeFilter(data, sortDirection);
  };

  useEffect(() => {
    getUpcomingRaces(URL);
  }, []);

  // Method used to toggle RaceType list filter for enum
  const setRaceFilterFromRaceType = (raceFilter: RaceType) => {
    if (raceTypeFilter === raceFilter) {
      setRaceTypeFilter(null);
      return;
    }
    setRaceTypeFilter(raceFilter);
  };

  function doSomething() {
    console.log('Pressed!!');
    getUpcomingRaces(URL);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fc8d01'}}>
      <View style={styles.appContainer}>
        <View style={styles.filterBar}>
          <FilterButton
            title={'Time'}
            isActiveFilter={false}
            timeFilter={timeFilter}
            action={() => {
              toggleTimeUntilEventSortDirection();
            }}
          />
          <FilterButton
            title={'Horse'}
            isActiveFilter={raceTypeFilter === RaceType.horse}
            action={() => {
              setRaceFilterFromRaceType(RaceType.horse);
            }}
          />
          <FilterButton
            title={'Harness'}
            isActiveFilter={raceTypeFilter === RaceType.harness}
            action={() => {
              setRaceFilterFromRaceType(RaceType.harness);
            }}
          />
          <FilterButton
            title={'Greyhound'}
            isActiveFilter={raceTypeFilter === RaceType.greyhound}
            action={() => {
              setRaceFilterFromRaceType(RaceType.greyhound);
            }}
          />
        </View>
        <SectionTitle title={'Up & Racing:'} />
        <ScrollView style={styles.horizontalScrollStyles} horizontal={true}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            data?.data?.next_to_go_ids.map((id: any, index: number) => {
              if (id === null || id === '') return;
              let raceData = data?.data?.race_summaries[id];
              let formattedTime =
                helperMethods.getTimeUntilRaceFromAdvertisedStart(
                  raceData.advertised_start.seconds,
                );
              // Do not render element if advertised_start has started > 60s ago.
              if (!formattedTime || formattedTime < -60) return;
              return (
                <View key={index} style={styles.displayCard}>
                  <Text style={styles.displayCardTitle}>
                    {helperMethods.getRaceTypeForCategoryId(
                      raceData.category_id,
                    )}
                  </Text>
                  <Text style={styles.displayCardSubTitle}>
                    {raceData.meeting_name}
                  </Text>
                  <CountDownTimer
                    time={raceData.advertised_start.seconds}
                    action={() => {}}
                  />
                </View>
              );
            })
          )}
        </ScrollView>
        <SectionTitle title={'Next To Go:'} />
        <ScrollView
          style={styles.verticalScrollStyles}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            data?.data?.next_to_go_ids.map((id: any, index: number) => {
              if (id === null || id === '') return;
              // If category filter not null, filter list of races by RaceType enum.
              let raceData = data?.data?.race_summaries[id];
              if (raceTypeFilter) {
                if (raceData.category_id !== raceTypeFilter) return;
              }
              let formattedTime =
                helperMethods.getTimeUntilRaceFromAdvertisedStart(
                  raceData.advertised_start.seconds,
                );
              // Do not render element if advertised_start has started > 60s ago.
              if (!formattedTime || formattedTime < -60) return;
              return (
                <RaceInfoCard
                  key={index}
                  raceData={raceData}
                  action={doSomething}
                />
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const SectionTitle = ({title}: {title: string}) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },
  verticalScrollStyles: {
    flex: 1,
  },
  horizontalScrollStyles: {
    marginBottom: 10,
    maxHeight: 100,
  },
  displayCardTitle: {
    fontWeight: 'bold',
    fontSize: 10,
    paddingRight: 5,
  },
  displayCardSubTitle: {
    fontWeight: 'bold',
    fontSize: 8,
  },
  displayCard: {
    width: 'auto',
    maxHeight: 80,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    paddingBottom: 15,
  },
  filterBar: {
    backgroundColor: '#fc8d01',
    height: 60,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingBottom: 10,
    color: '#ffffff',
  },
});

export default App;
