import React from 'react';
import {RaceType, TimeFilter} from '../utils/enums';
import {HelperMethods} from '../utils/HelperMethods';

test('Test function returns correct RaceType for category id', () => {
  const helperMethods = new HelperMethods();
  const greyhoundId = '9daef0d7-bf3c-4f50-921d-8e818c60fe61';
  const harnessId = '161d9be2-e909-4326-8c2c-35ed71fb460b';
  const horseId = '4a2788f8-e825-4d36-9894-efd4baf1cfae';
  const incorrectId = '4a2788f8-e825-zzzzzz-fffff-zzz';
  expect(helperMethods.getRaceTypeForCategoryId(greyhoundId)).toEqual(
    'Greyhound',
  );
  expect(helperMethods.getRaceTypeForCategoryId(harnessId)).toEqual('Harness');
  expect(helperMethods.getRaceTypeForCategoryId(horseId)).toEqual('Horse');
  expect(helperMethods.getRaceTypeForCategoryId(incorrectId)).toEqual('');
  // Test with a few random inputs
  expect(helperMethods.getRaceTypeForCategoryId([''].toString())).toEqual('');
  expect(
    helperMethods.getRaceTypeForCategoryId(JSON.stringify({test: 'test2'})),
  ).toEqual('');
  expect(
    helperMethods.getRaceTypeForCategoryId('' + '' + '2' + '1' + 'testId'),
  ).toEqual('');
});

test('Test method for getting DateFormat from advertised start', () => {
  const helperMethods = new HelperMethods();
  expect(helperMethods.getDateFormatForEventStart(1655046900)).toEqual(
    '2022-06-12T15:15:00.000Z',
  );
  expect(helperMethods.getDateFormatForEventStart(1827346900)).toEqual(
    '2027-11-27T20:21:40.000Z',
  );
  expect(helperMethods.getDateFormatForEventStart(1654000000)).toEqual(
    '2022-05-31T12:26:40.000Z',
  );
});

test('Test method for getting time in Neds format', () => {
  const helperMethods = new HelperMethods();
  expect(helperMethods.getTimeFormatted(-25)).toEqual(-25);
  expect(helperMethods.getTimeFormatted(37)).toEqual(37);
  expect(helperMethods.getTimeFormatted(75)).toEqual('1m15s');
  expect(helperMethods.getTimeFormatted(600)).toEqual('10m');
  expect(helperMethods.getTimeFormatted(3783)).toEqual('1h3m');
  expect(helperMethods.getTimeFormatted(10002999)).toEqual('2779h37m');
  expect(helperMethods.getTimeFormatted(parseFloat(''))).toEqual(0);
});

test('Test enum values', () => {
  expect(RaceType.greyhound).toEqual('9daef0d7-bf3c-4f50-921d-8e818c60fe61');
  expect(RaceType.harness).toEqual('161d9be2-e909-4326-8c2c-35ed71fb460b');
  expect(RaceType.horse).toEqual('4a2788f8-e825-4d36-9894-efd4baf1cfae');
});
