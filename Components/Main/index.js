import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownTZ from './DropDownTZ';
import * as localize from 'react-native-localize';
import RNCalendarEvents from 'react-native-calendar-events';
import {Button, TextInput} from 'react-native-paper';
import moment from 'moment-timezone';
const Main = () => {
  const [destinationZone, setDestinationZone] = useState('Australia/ACT');
  const [currentZone, setCurrentZone] = useState(localize.getTimeZone());
  const [startDate, setStartDate] = useState(new Date());
  const [doWeHavePermission, setDoweHavePermission] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  useEffect(() => {
    getPermission();
  }, []);
  const getPermission = () => {
    RNCalendarEvents.requestPermissions()
      .then(status => {
        if (status === 'authorized') {
          setDoweHavePermission(true);
        } else {
          Alert.alert(
            'Grant Permission',
            'Please go to settings->Alarmmm, grant calendar permission',
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          );
          // Permission denied or restricted
        }
      })
      .catch(error => {
        // Handle any errors here
      });
  };
  const checkCalendarPermission = () => {
    RNCalendarEvents.checkPermissions()
      .then(permissions => {
        if (permissions.calendar === 'authorized') {
          Alert.alert('Thank you for granting the permission', {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          });
          setDoweHavePermission(true);
          console.log('permission granted');
        } else {
          console.log('here');
          getPermission();
        }
      })
      .catch(error => {
        Alert.alert('Some Issue Occured', {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        });
      });
  };

  function convertTime(time, tz1, tz2) {
    // Parse the input time using the specified format and source timezone
    const parsedTime = moment.tz(time, 'M/D/YYYY, h:mm:ss A', tz1);

    // Convert the time to the destination timezone (tz2)
    const convertedTime = parsedTime.clone().tz(tz2);

    // Format the converted time as a string
    const formattedTime = convertedTime.format('M/D/YYYY, h:mm:ss A');

    return formattedTime;
  }

  const convertToUserTimeZone = (eventTime, eventTimeZone, userTimeZone) => {
    return moment.tz(eventTime, eventTimeZone).tz(userTimeZone).format();
  };
  console.log(
    'final:',
    convertToUserTimeZone(startDate, destinationZone, currentZone),
  );

  const dateDeconstructor = date => {
    const dateParts = date.split(/[ ,:]+/); // Split the date string
    const year = parseInt(dateParts[0].split('/')[2]);
    const month = parseInt(dateParts[0].split('/')[0]) - 1; // Months are 0-based
    const day = parseInt(dateParts[0].split('/')[1]);
    const hour = parseInt(dateParts[1]);
    const minute = parseInt(dateParts[2]);
    const second = parseInt(dateParts[3]);
    return [year, month, day, hour, minute, second];
  };

  // Example usage:
  const addEventToCalendar = () => {
    // RNCalendarEvents.saveEvent(eventDetails)
    const a = convertTime(startDate, destinationZone, currentZone);
    RNCalendarEvents.saveEvent('test1', {
      calendarId: '1',
      startDate: new Date(
        ...dateDeconstructor(
          convertTime(startDate, destinationZone, currentZone),
        ),
      ).toISOString(),
      endDate: new Date(
        ...dateDeconstructor(
          convertTime(endDate, destinationZone, currentZone),
        ),
      ).toISOString(),
      location: '',
    })
      .then(eventId => {
        // Event saved successfully, eventId is the ID of the newly created event
        console.log('Event saved with ID:', eventId);
      })
      .catch(error => {
        // Handle any errors here
        console.error('Error saving event:', error);
      });
  };
  return (
    <View style={styles.mainView}>
      {console.log('sd', startDate)}
      {console.log('ed', endDate)}
      {console.log('cz', currentZone)}
      {console.log('dz', destinationZone)}
      <View style={{display: 'flex'}}>
        <View style={{display: 'none'}}>
          <Text>Your Current Zone</Text>
          <DropDownTZ
            dropDownLabel={'Current Zone'}
            zone={currentZone}
            setZone={setCurrentZone}
          />
        </View>
        <View style={styles.rowFlexContainer}>
          <Text>Event Start Time</Text>

          <DateTimePicker
            testID="datePicker"
            value={startDate}
            mode={'datetime'}
            is24Hour={false}
            onChange={(e, b) => {
              console.log(e);
              console.log('bbb', b);
              setStartDate(new Date(e.nativeEvent.timestamp));
            }}
          />
        </View>
        <View style={styles.rowFlexContainer}>
          <Text>Event End Time</Text>
          <DateTimePicker
            testID="datePicker"
            value={endDate}
            timeZoneName={currentZone}
            mode={'datetime'}
            is24Hour={true}
            onChange={(e, b) => {
              setEndDate(new Date(e.nativeEvent.timestamp));
            }}
          />
        </View>
      </View>
      <View>
        <View style={styles.flexContainer}>
          <Text>Your event's time zone</Text>
          <DropDownTZ
            dropDownLabel={'Destination Zone'}
            zone={destinationZone}
            setZone={setDestinationZone}
          />
        </View>
      </View>
      <TextInput
        style={{margin: 10, backgroundColor: 'rgb(225,225,225)', width: 300}}
        label="Event Title"
        value={eventTitle}
        onChangeText={text => setEventTitle(text)}
      />
      {!doWeHavePermission && (
        <Button
          style={{margin: 10}}
          buttonColor="rgb(225,225,225)"
          mode="contained"
          textColor="black"
          onPress={getPermission}>
          Grant Calendar permission
        </Button>
      )}
      <Button
        buttonColor="rgb(225,225,225)"
        mode="contained"
        textColor="black"
        onPress={addEventToCalendar}>
        Add Event{' '}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    // flexWrap: 'wrap',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  rowFlexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default Main;
