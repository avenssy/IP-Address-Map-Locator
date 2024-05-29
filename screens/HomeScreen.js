import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, ScrollView, TouchableOpacity, Button } from 'react-native';
import CheckBox from 'expo-checkbox';
import axios from 'axios';

const HomeScreen = () => {
  let clearFlag = false;
  const [ipAddress, setIpAddress] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [history, setHistory] = useState([]);
  const [invalidIpError, setInvalidIpError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchDefaultIpAddress();
  }, []);

  useEffect(() => {
    if (ipAddress) {
      fetchLocationData(ipAddress);
    }
  }, [ipAddress]);

  const fetchDefaultIpAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const ip = response.data.ip;
      setIpAddress(ip);
    } catch (error) {
      console.error("Error fetching default IP address: ", error);
    }
  };

  const fetchLocationData = async (ip) => {
    try {
      setLoading(true);
      const geoResponse = await axios.get(`https://ipinfo.io/${ip}/geo`);
      setLocationData(geoResponse.data);
      setLoading(false);
      addToHistory(ip);      
      setInvalidIpError('');
    } catch (error) {
      console.error("Error fetching location data: ", error);
      setLoading(false);
      setInvalidIpError('Invalid IP address');
    }
  };

  const addToHistory = (ip) => {
    setHistory([ip, ...history]);
  };

  const deleteFromHistory = () => {
    const updatedHistory = history.filter((_, index) => !selectedItems.includes(index));
    setHistory(updatedHistory);
    setSelectedItems([]);
  };

  const clearHistory = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const ip = response.data.ip;
      clearFlag = true;
      setHistory([]);
      setIpAddress(ip);
      fetchLocationData(ip);
    } catch (error) {
      console.error("Error fetching default IP address: ", error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IP Location Finder</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter IP Address"
          value={newIpAddress}
          onChangeText={setNewIpAddress}
          onSubmitEditing={() => {
            setIpAddress(newIpAddress);
            setNewIpAddress('');
          }}
        />
        {invalidIpError ? <Text style={styles.error}>{invalidIpError}</Text> : null}
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {locationData ? (
            <>
              <Text style={styles.text}>IP Address: {ipAddress}</Text>
              <Text style={styles.text}>Latitude: {locationData.loc.split(',')[0]}</Text>
              <Text style={styles.text}>Longitude: {locationData.loc.split(',')[1]}</Text>
            </>
          ) : (
            <Text style={styles.text}>Unable to fetch location data</Text>
          )}
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>History Log</Text>
            <ScrollView style={styles.historyDropdown}>
              {history.length > 0 && history.map((ip, index) => (
                <TouchableOpacity key={index} onPress={() => {
                  setIpAddress(ip);
                }}>
                  <View style={styles.historyItemContainer}>
                    <CheckBox
                      value={selectedItems.includes(index)}
                      onValueChange={(newValue) => {
                        if (newValue) {
                          setSelectedItems([...selectedItems, index]);
                        } else {
                          setSelectedItems(selectedItems.filter((item) => item !== index));
                        }
                      }}
                    />
                    <Text style={styles.historyItem}>{ip}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <Button title="Delete Selected" onPress={deleteFromHistory} />
          <Button title="Clear History" onPress={clearHistory} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  historyContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    padding: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyDropdown: {
    maxHeight: 150,
  },
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItem: {
    fontSize: 16,
    paddingVertical: 5,
    marginLeft: 5,
  },
  map: {
    marginTop: 20,
    width: '100%',
    aspectRatio: 1.5, 
  },
  error: {
    color: 'red',
  },
});

export default HomeScreen;
