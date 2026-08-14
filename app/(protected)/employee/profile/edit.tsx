import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { router } from "expo-router";

import AppButton from "../../../../components/Button/AppButton";
import AppInput from "../../../../components/Input/AppInput";

import { getCurrentUser } from "../../../../services/api/authService";
import { updateEmployeeProfile } from "../../../../services/api/userService";

const COLORS = {
  ink: "#050505",
  muted: "#65676B",
  border: "#E4E6EB",
  card: "#FFFFFF",
  bg: "#F0F2F5",
  primary: "#1877F2",
};


export default function EditProfileScreen() {

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showMaritalStatus, setShowMaritalStatus] =
    useState(false);


  const [maritalStatus, setMaritalStatus] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [emergencyContactName, setEmergencyContactName] =
    useState("");

  const [emergencyContactPhone, setEmergencyContactPhone] =
    useState("");


  /*
  ==========================================
  LOAD CURRENT PROFILE
  ==========================================
  */

  useEffect(() => {

    loadProfile();

  }, []);


  const loadProfile = async () => {

    try {

      const response =
        await getCurrentUser();

      console.log(
        "EDIT PROFILE USER:",
        response
      );

      const user =
        response.user;


      setMaritalStatus(
        user.marital_status || ""
      );

      setAddress(
        user.address || ""
      );

      setCity(
        user.city || ""
      );

      setEmergencyContactName(
        user.emergency_contact_name || ""
      );

      setEmergencyContactPhone(
        user.emergency_contact_phone || ""
      );


    } catch (error) {

      console.error(
        "Failed to load profile:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to load your profile."
      );

    } finally {

      setLoading(false);

    }

  };


  /*
  ==========================================
  SAVE PROFILE
  ==========================================
  */

  const handleSave = async () => {

  if (!maritalStatus) {
    Alert.alert(
      "Required",
      "Please select your marital status."
    );
    return;
  }

  if (!address.trim()) {
    Alert.alert(
      "Required",
      "Please enter your address."
    );
    return;
  }

  if (!city.trim()) {
    Alert.alert(
      "Required",
      "Please enter your city."
    );
    return;
  }

  if (!emergencyContactName.trim()) {
    Alert.alert(
      "Required",
      "Please enter your emergency contact name."
    );
    return;
  }

  if (!emergencyContactPhone.trim()) {
    Alert.alert(
      "Required",
      "Please enter your emergency contact phone."
    );
    return;
  }


  try {

    setSaving(true);


    const result =
      await updateEmployeeProfile({

        marital_status:
          maritalStatus,

        address:
          address.trim(),

        city:
          city.trim(),

        emergency_contact_name:
          emergencyContactName.trim(),

        emergency_contact_phone:
          emergencyContactPhone.trim(),

      });


    console.log(
      "PROFILE UPDATE RESPONSE:",
      result
    );


    Alert.alert(
      "Success",
      "Your profile has been updated successfully.",
      [
        {
          text: "OK",
          onPress: () =>
            router.back(),
        },
      ]
    );


  } catch (error: any) {

    console.error(
      "Profile update error:",
      error
    );


    Alert.alert(
      "Update Failed",
      error?.response?.data?.message ||
        "Unable to update your profile."
    );


  } finally {

    setSaving(false);

  }

};


  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {

    return (

      <SafeAreaView
        style={styles.center}
      >

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

      </SafeAreaView>

    );

  }


  /*
  ==========================================
  SCREEN
  ==========================================
  */

  return (

    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* Header */}

        <View
          style={styles.header}
        >

          <Pressable
            onPress={() =>
              router.back()
            }
            style={styles.backButton}
          >

            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={COLORS.ink}
            />

          </Pressable>


          <View>

            <Text
              style={styles.title}
            >
              Complete Your Profile
            </Text>

            <Text
              style={styles.subtitle}
            >
              Keep your personal information
              up to date.
            </Text>

          </View>

        </View>


        {/* Personal Information */}

        <View
          style={styles.section}
        >

          <Text
            style={styles.sectionTitle}
          >
            Personal Information
          </Text>


          {/* Marital Status */}

          <Text
            style={styles.label}
          >
            Marital Status
          </Text>


          <Pressable
            style={styles.selector}
            onPress={() =>
              setShowMaritalStatus(true)
            }
          >

            <Text
              style={
                maritalStatus
                  ? styles.selectorText
                  : styles.selectorPlaceholder
              }
            >
              {maritalStatus ||
                "Select marital status"}
            </Text>


            <MaterialCommunityIcons
              name="chevron-down"
              size={22}
              color={COLORS.muted}
            />

          </Pressable>


          <AppInput
            label="Address"
            value={address}
            onChangeText={setAddress}
          />


          <AppInput
            label="City"
            value={city}
            onChangeText={setCity}
          />

        </View>


        {/* Emergency Contact */}

        <View
          style={styles.section}
        >

          <Text
            style={styles.sectionTitle}
          >
            Emergency Contact
          </Text>


          <AppInput
            label="Contact Name"
            value={emergencyContactName}
            onChangeText={
              setEmergencyContactName
            }
          />


          <AppInput
            label="Contact Phone"
            value={emergencyContactPhone}
            onChangeText={
              setEmergencyContactPhone
            }
          />

        </View>


        {/* Actions */}

        <View
          style={styles.actions}
        >

          <AppButton
            title={
              saving
                ? "Saving..."
                : "Save Changes"
            }
            icon="content-save-outline"
            onPress={handleSave}
            disabled={saving}
          />


          <View
            style={{
              height: 12,
            }}
          />


          <AppButton
            title="Cancel"
            variant="outline"
            onPress={() =>
              router.back()
            }
            disabled={saving}
          />

        </View>

      </ScrollView>


      {/* Marital Status Modal */}

      <Modal
        visible={showMaritalStatus}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowMaritalStatus(false)
        }
      >

        <Pressable
          style={styles.modalOverlay}
          onPress={() =>
            setShowMaritalStatus(false)
          }
        >

          <Pressable
            style={styles.modalCard}
            onPress={(event) =>
              event.stopPropagation()
            }
          >

            <Text
              style={styles.modalTitle}
            >
              Select Marital Status
            </Text>


            {[
              "Single",
              "Married",
              "Divorced",
              "Widowed",
            ].map((status) => (

              <Pressable
                key={status}
                style={styles.option}
                onPress={() => {

                  setMaritalStatus(
                    status
                  );

                  setShowMaritalStatus(
                    false
                  );

                }}
              >

                <Text
                  style={styles.optionText}
                >
                  {status}
                </Text>


                {maritalStatus ===
                  status && (

                  <MaterialCommunityIcons
                    name="check"
                    size={22}
                    color={
                      COLORS.primary
                    }
                  />

                )}

              </Pressable>

            ))}

          </Pressable>

        </Pressable>

      </Modal>

    </SafeAreaView>

  );

}


/*
==========================================
STYLES
==========================================
*/

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },


  content: {
    padding: 16,
    paddingBottom: 50,
  },


  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },


  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 12,
  },


  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },


  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.ink,
  },


  subtitle: {
    marginTop: 5,
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 300,
  },


  section: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },


  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
    color: COLORS.ink,
  },


  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.ink,
  },


  selector: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },


  selectorText: {
    fontSize: 16,
    color: COLORS.ink,
  },


  selectorPlaceholder: {
    fontSize: 16,
    color: COLORS.muted,
  },


  actions: {
    marginTop: 4,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },


  modalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
  },


  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },


  option: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },


  optionText: {
    fontSize: 16,
    color: COLORS.ink,
  },

});