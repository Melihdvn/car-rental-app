import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { post } from "../../lib/api";
import Icon from "react-native-vector-icons/FontAwesome5";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";

const RentVehicle = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showVehicleList, setShowVehicleList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rentalDetails, setRentalDetails] = useState(null); // State for rental details
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const route = useRoute();
  const userId = route.params.userId;

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    if (showStartDatePicker) {
      setStartDate(currentDate);
      setShowStartDatePicker(false);
    } else {
      setEndDate(currentDate);
      setShowEndDatePicker(false);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      setVehicles([]);
      const response = await post("/getvehiclesondate", {
        start_date: startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        end_date: endDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      });
      if (response.success) {
        if (vehicles) {
          setVehicles(response.vehicles || []);
        } else {
          setError("No vehicles available.");
        }
      } else {
        setError(response.message || "Failed to fetch vehicles.");
      }
    } catch (error) {
      setError("An error occurred while fetching vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchVehicles = () => {
    fetchVehicles();
    setShowVehicleList(true);
  };

  const images = {
    "camry.jpg": require("../../assets/camry.jpg"),
    "civic.jpg": require("../../assets/civic.jpg"),
    "mustang.jpg": require("../../assets/mustang.jpg"),
    "malibu.jpg": require("../../assets/malibu.jpg"),
    "bmw_3series.jpg": require("../../assets/bmw_3series.jpg"),
    "audi_a4.jpg": require("../../assets/audi_a4.jpg"),
    "outlander.jpg": require("../../assets/outlander.jpg"),
    "elantra.jpg": require("../../assets/elantra.jpg"),
    "mini.jpg": require("../../assets/mini.jpg"),
    "mazda6.jpg": require("../../assets/mazda6.jpg"),
  };

  const getImage = (imageName) => {
    return images[imageName];
  };

  const handleRentNow = (item) => {
    const totalPrice =
      item.daily_rate *
      ((endDate - startDate) / (1000 * 60 * 60 * 24)).toFixed(2);
    setRentalDetails({
      vehicle: item,
      startDate,
      endDate,
      totalPrice,
    });
    setModalVisible(true);
  };

  const handleReturn = () => {
    setShowVehicleList(false);
  };

  const handleLogin = () => {
    navigation.replace("Login");
  };

  useEffect(() => {
    if (!userId) {
      setError("You must login to use this page.");
      return;
    }
  }, [userId]);

  const handlePayment = () => {
    if (rentalDetails) {
      navigation.navigate("Payments", { userId, rentalDetails });
      setRentalDetails(null);
      setModalVisible(false);
      fetchVehicles();
      setShowVehicleList(false);
    } else {
      alert("Rental details are missing.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <Image source={getImage(item.image)} style={styles.vehicleImage} />
      <View style={styles.vehicleInfoContainer}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.makeModel}>{`${item.make} ${item.model}`}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="dollar-sign" size={20} width={11} color="#cd4100" />
            <Text style={styles.priceText}>{item.daily_rate} / day</Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Icon name="gas-pump" size={20} width={20} color="#cd4100" />
            <Text style={styles.detailText}>{item.fuel}</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="atom" size={20} width={20} color="#cd4100" />
            <Text style={styles.detailText}>{item.transmission}</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="calendar" size={20} width={20} color="#cd4100" />
            <Text style={styles.detailText}>{item.year}</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="tachometer-alt" size={20} width={24} color="#cd4100" />
            <Text style={styles.detailText}>{item.kilometers} km</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.rentButton}
          onPress={() => handleRentNow(item)}
        >
          <Text style={styles.rentButtonText}>Make Reservation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      {showVehicleList && (
        <TouchableOpacity style={styles.returnButton} onPress={handleReturn}>
          <Icon name="angle-left" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.returnButtonText}>Return</Text>
        </TouchableOpacity>
      )}
      <View style={styles.panel}>
        {userId ? (
          <>
            {!showVehicleList ? (
              <>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>Select Start Date</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {startDate.toDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="default"
                      accentColor="#cd4100"
                      themeVariant="dark"
                      minimumDate={new Date()}
                      onChange={(event, date) => handleDateChange(event, date)}
                    />
                  )}
                  <Text style={styles.dateText}>Select End Date</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {endDate.toDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display="default"
                      accentColor="#cd4100"
                      themeVariant="dark"
                      minimumDate={new Date()}
                      onChange={(event, date) => handleDateChange(event, date)}
                    />
                  )}
                </View>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearchVehicles}
                >
                  <Text style={styles.searchButtonText}>Search Vehicles</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {loading ? (
                  <ActivityIndicator size="large" color="#cd4100" />
                ) : vehicles.length > 0 ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={vehicles}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.vehicle_id.toString()}
                  />
                ) : (
                  <Text style={styles.error}>
                    {error || "No vehicles available."}
                  </Text>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                height: 45,
                width: "80%",
                backgroundColor: "#cd4100",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
                marginTop: 10,
                paddingHorizontal: 100,
              }}
            >
              <Text style={{ color: "white" }}>Login</Text>
            </TouchableOpacity>
            {error ? (
              <Text style={{ color: "#cd4100", marginTop: 15 }}>{error}</Text>
            ) : null}
          </>
        )}
      </View>

      {/* Rental Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rental Details</Text>
            {rentalDetails && (
              <>
                <Image
                  source={getImage(rentalDetails.vehicle.image)}
                  style={styles.modalImage}
                />
                <Text style={styles.modalText}>
                  Vehicle: {rentalDetails.vehicle.make}{" "}
                  {rentalDetails.vehicle.model}
                </Text>
                <Text style={styles.modalText}>
                  Start Date: {rentalDetails.startDate.toDateString()}
                </Text>
                <Text style={styles.modalText}>
                  End Date: {rentalDetails.endDate.toDateString()}
                </Text>
                <Text style={styles.modalText}>
                  Total Price: ${rentalDetails.totalPrice.toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={styles.paymentButton}
                  onPress={handlePayment}
                >
                  <Text style={styles.paymentButtonText}>Reserve</Text>
                </TouchableOpacity>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  dateContainer: {
    width: "100%",
    marginBottom: 20,
    marginTop: 170,
    alignItems: "center",
  },
  dateText: {
    color: "#fff",
    marginVertical: 5,
    fontSize: 18,
    fontWeight: "350",
  },
  dateButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: "80%",
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "300",
  },
  searchButton: {
    backgroundColor: "#cd4100",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  panel: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(34, 34, 34, 0.95)",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginTop: 75,
    alignItems: "center",
  },
  vehicleCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 15,
    marginVertical: 11,
    width: "100%",
    alignItems: "center",
  },
  vehicleImage: {
    height: 150,
    width: "88%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  makeModel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  vehicleInfoContainer: {
    backgroundColor: "#fff1",
    borderRadius: 10,
    marginTop: 10,
  },
  vehicleInfo: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff1",
    padding: 10,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginBottom: 7,
  },
  detailText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    width: 63,
  },
  priceText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  rentButton: {
    backgroundColor: "#cd4100",
    padding: 10,
    margin: 9,
    borderRadius: 5,
    alignItems: "center",
  },
  rentButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  error: {
    color: "#f00",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#222f",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    height: 200,
    width: "88%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  paymentButton: {
    backgroundColor: "#cd4100",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  returnButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 5,
    marginTop: 35,
    zIndex: 2,
  },
  returnButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default RentVehicle;
