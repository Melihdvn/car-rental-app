import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { post, get } from "../../lib/api";
import CheckBox from "expo-checkbox";

const PaymentScreen = ({ route, navigation }) => {
  const { rentalDetails, userId } = route.params;
  const { vehicle, startDate, endDate, totalPrice } = rentalDetails;
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await get("/getallservices");
      if (response.success) {
        setAllServices(response.services || []);
      } else {
        setError(response.message || "Failed to fetch services.");
      }
    } catch (error) {
      setError("An error occurred while fetching services.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (additional_service_id) => {
    setSelectedServices((prevState) => {
      if (prevState.includes(additional_service_id)) {
        return prevState.filter(
          (serviceId) => serviceId !== additional_service_id
        );
      } else {
        return [...prevState, additional_service_id];
      }
    });
  };

  const calculateTotalPrice = () => {
    const totalServicePrice = allServices
      .filter((service) =>
        selectedServices.includes(service.additional_service_id)
      )
      .reduce((total, service) => total + service.price, 0);
    return totalPrice + totalServicePrice;
  };

  const validateCreditCard = (cardNumber) => {
    return /^\d{16}$/.test(cardNumber.replace(/\s+/g, ""));
  };

  const validateCvv = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };

  const validateExpirationDate = (date) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) return false;
    const [month, year] = date.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of the year
    const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
    return year > currentYear || (year === currentYear && month > currentMonth);
  };

  const handleCreditCardNumberChange = (number) => {
    const cleanNumber = number.replace(/\D/g, "");

    const formattedNumber = cleanNumber.replace(/(.{4})/g, "$1 ").trim();

    setCreditCardNumber(formattedNumber);
  };

  const handleExpirationDateChange = (date) => {
    if (date.length === 2 && !date.includes("/")) {
      setExpirationDate(date + "/");
    } else {
      setExpirationDate(date);
    }
  };

  const handlePayment = async () => {
    if (!validateCreditCard(creditCardNumber)) {
      setError("Invalid credit card number.");
      return;
    }
    if (!validateCvv(cvv)) {
      setError("Invalid CVV.");
      return;
    }
    if (!validateExpirationDate(expirationDate)) {
      setError("Invalid expiration date.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const paymentResponse = await post("/payment", {
        user_id: userId,
        amount: calculateTotalPrice(),
        credit_card_number: creditCardNumber,
        cvv: cvv,
        expire_date: expirationDate,
      });

      if (!paymentResponse.success) {
        throw new Error(
          paymentResponse.message || "Failed to process payment."
        );
      }

      const reservationResponse = await post("/createreservation", {
        user_id: userId,
        vehicle_id: vehicle.vehicle_id,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        total_price: calculateTotalPrice(),
      });

      if (!reservationResponse.success) {
        throw new Error(
          reservationResponse.message || "Failed to create reservation."
        );
      }

      const reservationId = reservationResponse.reservation[0].reservation_id;

      await Promise.all(
        selectedServices.map(async (additional_service_id) => {
          const service = allServices.find(
            (s) => s.additional_service_id === additional_service_id
          );
          if (service) {
            await post("/addservice", {
              reservation_id: reservationId,
              service_id: additional_service_id,
              name: service.name,
              price: service.price,
            });
          }
        })
      );

      alert("Reservation created successfully.");
      navigation.navigate("HomeTabs");
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailsContainer}>
          <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
          <Text style={styles.vehicleText}>
            {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.vehicleText}>
            Start Date: {startDate.toDateString()}
          </Text>
          <Text style={styles.vehicleText}>
            End Date: {endDate.toDateString()}
          </Text>
          <Text style={styles.vehicleText}>
            Total Price: ${calculateTotalPrice().toFixed(2)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Select Services</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#cd4100" />
        ) : (
          <View style={styles.servicesContainer}>
            {allServices.map((service) => (
              <View
                key={service.additional_service_id}
                style={styles.serviceItem}
              >
                <CheckBox
                  value={selectedServices.includes(
                    service.additional_service_id
                  )}
                  onValueChange={() =>
                    handleCheckboxChange(service.additional_service_id)
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.serviceText}>
                  {service.name} (${service.price.toFixed(2)})
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.reserveButtonText}>Reserve</Text>
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      {/* Credit Card Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Credit Card Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Credit Card Number"
              value={creditCardNumber}
              onChangeText={handleCreditCardNumberChange}
              keyboardType="numeric"
              maxLength={19}
              placeholderTextColor="#888"
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                placeholderTextColor="#888"
              />
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="MM/YY"
                value={expirationDate}
                onChangeText={handleExpirationDateChange}
                keyboardType="numeric"
                maxLength={5}
                placeholderTextColor="#888"
              />
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handlePayment}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Confirm Payment</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222f",
  },
  scrollContainer: {
    padding: 20,
  },
  detailsContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  vehicleImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
  },
  vehicleText: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 5,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
  },
  servicesContainer: {
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  serviceText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    marginBottom: 10,
    width: "100%",
  },
  smallInput: {
    width: "45%",
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reserveButton: {
    backgroundColor: "#cd4100",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  error: {
    color: "#f00",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "#cd4100",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PaymentScreen;
