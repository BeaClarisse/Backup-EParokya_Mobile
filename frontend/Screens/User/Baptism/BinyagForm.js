import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Add this package
import axios from 'axios';
import SyncStorage from 'sync-storage';
import baseURL from '../../../assets/common/baseUrl';

const BaptismForm = ({ navigation }) => {
  const [baptismDate, setBaptismDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [showBaptismDatePicker, setShowBaptismDatePicker] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  const [church, setChurch] = useState('');
  const [priest, setPriest] = useState('');
  const [childName, setChildName] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SyncStorage.get('jwt');
        if (!token) {
          Alert.alert('Error', 'Token is missing. Please log in again.');
          navigation.navigate('LoginPage');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${baseURL}/users/profile`, config);
        setUserId(data.user._id);
      } catch (error) {
        console.error('Failed to retrieve user ID:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Unable to retrieve user ID. Please log in again.');
        navigation.navigate('LoginPage');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (
      !baptismDate ||
      !church ||
      !priest ||
      !childName ||
      !birthDate ||
      !placeOfBirth ||
      !gender ||
      !fatherName ||
      !motherName ||
      !address ||
      !contactNumber
    ) {
      setError('Please fill in all the fields.');
      return;
    }

    const formData = {
      baptismDate,
      church,
      priest,
      child: {
        fullName: childName,
        dateOfBirth: birthDate,
        placeOfBirth,
        gender,
      },
      parents: {
        fatherFullName: fatherName,
        motherFullName: motherName,
        address,
        contactInfo: contactNumber,
      },
      godparents: [], // Placeholder for godparents
      userId,
    };

    try {
      const token = await SyncStorage.get('jwt');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.post(`${baseURL}/binyag/create`, formData, config);

      if (response.status === 201) {
        Alert.alert('Success', 'Baptism form submitted successfully.');
        navigation.navigate('Home');
      } else {
        setError('Failed to submit form. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err.response ? err.response.data : err.message);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Baptism Form</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View>
        <Button title="Select Baptism Date" onPress={() => setShowBaptismDatePicker(true)} />
        {showBaptismDatePicker && (
          <DateTimePicker
            value={baptismDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowBaptismDatePicker(false);
              if (selectedDate) setBaptismDate(selectedDate.toISOString());
            }}
          />
        )}
        <Text>{baptismDate ? new Date(baptismDate).toLocaleDateString() : 'No date selected'}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Church"
        value={church}
        onChangeText={setChurch}
      />
      <TextInput
        style={styles.input}
        placeholder="Priest"
        value={priest}
        onChangeText={setPriest}
      />

      <View>
        <Button title="Select Child's Birth Date" onPress={() => setShowBirthDatePicker(true)} />
        {showBirthDatePicker && (
          <DateTimePicker
            value={birthDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowBirthDatePicker(false);
              if (selectedDate) setBirthDate(selectedDate.toISOString());
            }}
          />
        )}
        <Text>{birthDate ? new Date(birthDate).toLocaleDateString() : 'No date selected'}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Child's Full Name"
        value={childName}
        onChangeText={setChildName}
      />
      <TextInput
        style={styles.input}
        placeholder="Place of Birth"
        value={placeOfBirth}
        onChangeText={setPlaceOfBirth}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender (Male/Female)"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Father's Full Name"
        value={fatherName}
        onChangeText={setFatherName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mother's Full Name"
        value={motherName}
        onChangeText={setMotherName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        keyboardType="phone-pad"
        value={contactNumber}
        onChangeText={setContactNumber}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default BaptismForm;