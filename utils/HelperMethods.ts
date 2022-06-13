import {RaceType, TimeFilter} from './enums';

export class HelperMethods {
  // Returns race category string for categoryId
  getRaceTypeForCategoryId(categoryId: string): string {
    switch (categoryId) {
      case RaceType.greyhound:
        return 'Greyhound';
      case RaceType.harness:
        return 'Harness';
      case RaceType.horse:
        return 'Horse';
      default:
        return '';
    }
  }
  // Get Date Format from seconds
  // EG: "1970-01-01T00:10:00.000Z"
  getDateFormatForEventStart(seconds: number): string {
    return new Date(seconds * 1000).toISOString();
  }
  // Get the time until race occurs in format similar to neds layout:
  //
  // EG:
  // countdown < 60s - Returns string of 'seconds + s' until or passed event
  //  => '36s'
  // countdown > 60s - Returns string of 'minutes + seconds + m' until event
  //  => '2m26s'
  // countdown > 600s (10 mins) - Returns string of 'minutes + m' until event
  //  => '13m'
  // countdown > 3600s (1 hour) - Returns string of 'hours + h + minutes + m' until event
  //  => '2h10m'
  getTimeUntilRaceFromAdvertisedStart = (advertisedStartTime: number) => {
    // Get current time for comparison against advertised start time
    let currentTime = new Date().getTime() / 1000;
    let timeUntilEventInSeconds = Math.round(advertisedStartTime - currentTime);
    return this.getTimeFormatted(timeUntilEventInSeconds);
  };
  // Helper method to return a formatted string based on paramaters similar to how
  // Neds & Ladbrokes layout countdown timers
  getTimeFormatted = (time: number) => {
    if (typeof time !== 'number') return;
    // Return seconds count if less than 60s
    if (time <= 60) {
      return time;
    }
    // Return minutes + seconds if > 60s and < 600s
    if (time > 60 && time < 600) {
      let mins = Math.floor(time / 60);
      let secs = time % 60;
      return mins + 'm' + secs + 's';
    }
    // Return minutes if >= 600s and < 3600s
    if (time >= 600 && time < 3600) {
      return Math.floor(time / 60) + 'm';
    }
    // Return hours and minutes if >= 3600s
    if (time >= 3600) {
      let hours = Math.round(time / 3600);
      let mins = Math.round((time % 3600) / 60);
      return hours + 'h' + mins + 'm';
    }
    // Failure to pass a correct value will return 0.
    return 0;
  };
  // Method to sort race data based on enum argument passed in
  // TODO - break method down into testable/maintainable functions
  getRacesInSortedOrderForTimeFilter = async (
    data: any,
    sortDirection: TimeFilter,
  ) => {
    let raceData = data?.data;
    let sortedRaces = raceData?.next_to_go_ids;
    try {
      switch (sortDirection) {
        case TimeFilter.ascending:
          sortedRaces.sort(
            (a: any, b: any) =>
              raceData.race_summaries[b].advertised_start.seconds -
              raceData.race_summaries[a].advertised_start.seconds,
          );
          return;
        case TimeFilter.descending:
          sortedRaces.sort(
            (a: any, b: any) =>
              raceData.race_summaries[a].advertised_start.seconds -
              raceData.race_summaries[b].advertised_start.seconds,
          );
          return;
      }
    } catch (e) {
      console.log('Error Sorting Upcoming Races - ERROR: ', e);
    }
    raceData.next_to_go_ids = sortedRaces;
    return sortedRaces;
  };
}
