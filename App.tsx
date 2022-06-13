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

import {DemoData} from './utils/DemoData';
import {RaceType, TimeFilter} from './utils/enums';
import {HelperMethods} from './utils/HelperMethods';

const App = () => {
  const helperMethods = new HelperMethods();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any>();
  const [filteredData, setFilteredData] = useState<any>();
  const [refreshing, setRefreshing] = React.useState(false);
  const [raceTypeFilter, setRaceTypeFilter] = useState<RaceType | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(
    TimeFilter.descending,
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
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      console.log('------API CALLED-------');
    }
  };

  const sortRacesByTimeFilter = (filter: TimeFilter, elements: []) => {};

  const handleFilterTap = () => {
    switch (timeFilter) {
      case TimeFilter.ascending:
        return setTimeFilter(TimeFilter.descending);
      case TimeFilter.descending:
        return setTimeFilter(TimeFilter.ascending);
      default:
        return setTimeFilter(TimeFilter.descending);
    }
  };

  useEffect(() => {
    getUpcomingRaces(
      'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10',
    );
  }, []);

  const setRaceFilterFromRaceType = (raceFilter: RaceType) => {
    if (raceTypeFilter === raceFilter) {
      setRaceTypeFilter(null);
      return;
    }
    setRaceTypeFilter(raceFilter);
  };
  // 2.5 Add sort by time ascending/descending
  // 3. Add unit testing

  // console.log(data?.data?.race_summaries);

  function doSomething() {
    console.log('Pressed!!');
    getUpcomingRaces(
      'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10',
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.appContainer}>
        <View style={styles.filterBar}>
          <FilterButton
            title={'Time'}
            isActiveFilter={false}
            action={() => {
              console.log('Sort by time start');
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
        <View>
          <Text style={styles.appTitle}>Next to go:</Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            data?.data?.next_to_go_ids.map((id: any, index: number) => {
              if (id === null || id === '') return;
              // If category filter not null, filter list of races by RaceType enum.
              let race = data?.data?.race_summaries[id];
              if (raceTypeFilter) {
                if (race.category_id !== raceTypeFilter) return;
              }
              let formattedTime =
                helperMethods.getTimeUntilRaceFromAdvertisedStart(
                  race.advertised_start.seconds,
                );
              // Do not render element if advertised_start has started > 60s ago.
              if (!formattedTime || formattedTime < -60) return;
              return (
                <View key={index} style={styles.raceContainer}>
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
                        {helperMethods.getRaceTypeForCategoryId(
                          race.category_id,
                        )}
                      </Text>
                      <CountDownTimer
                        time={race.advertised_start.seconds}
                        action={doSomething}
                      />
                    </View>
                    <Text style={styles.cardSubTitle}>{race.meeting_name}</Text>
                    {/* <Text style={styles.cardSubTitle}>{race.}</Text> */}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingBottom: 5,
                    }}>
                    <Text>{race.race_name}</Text>
                    <Text>Race #{race.race_number}</Text>
                  </View>
                </View>
              );
            })
          )}
          <View style={{paddingBottom: 45}}></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    paddingHorizontal: 15,
  },
  filterBar: {
    backgroundColor: 'orange',
    height: 60,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
    backgroundColor: 'skyblue',
    minWidth: 100,
    margin: 5,
    padding: 10,
    borderRadius: 10,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
});

export default App;
