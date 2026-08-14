import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { LeaveAttachment } from "../../services/api/hrLeaveService";

interface Props {
  attachments: LeaveAttachment[];
}

const API_URL = "http://172.20.10.2:5000";

const COLORS = {
  ink: "#050505",
  muted: "#65676B",
  border: "#E4E6EB",
  card: "#FFFFFF",
  bg: "#F0F2F5",
  primary: "#1877F2",
};

export default function LeaveAttachments({ attachments }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const validAttachments = attachments.filter(
    (file): file is LeaveAttachment => file != null && !!file.file_type
  );

  if (validAttachments.length === 0) {
    return null;
  }

  const images = validAttachments.filter((file) => file.file_type.startsWith("image"));
  const documents = validAttachments.filter((file) => !file.file_type.startsWith("image"));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Attachments <Text style={styles.count}>({attachments.length})</Text>
      </Text>

      {images.length > 0 && (
        <View style={styles.imageGrid}>
          {images.map((file) => {
            const fileUrl = `${API_URL}/${file.file_path}`;

            return (
              <TouchableOpacity
                key={file.id}
                activeOpacity={0.85}
                style={styles.imageTile}
                onPress={() => setSelectedImage(fileUrl)}
              >
                <Image source={{ uri: fileUrl }} style={styles.image} resizeMode="cover" />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {documents.length > 0 && (
        <View style={styles.docList}>
          {documents.map((file, index) => (
            <View
              key={file.id}
              style={[
                styles.docRow,
                index !== documents.length - 1 && styles.docRowDivider,
              ]}
            >
              <View style={styles.docIconWrap}>
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <Text style={styles.docName} numberOfLines={1}>
                {file.original_file_name}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* FULL SCREEN IMAGE VIEWER */}
      <Modal visible={selectedImage !== null} transparent animationType="fade">
        <Pressable style={styles.modalContainer} onPress={() => setSelectedImage(null)}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          )}

          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
            <MaterialCommunityIcons name="close" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 10,
  },

  count: {
    fontSize: 15,
    fontWeight: "400",
    color: COLORS.muted,
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 10,
  },

  imageTile: {
    width: "32%",
    aspectRatio: 1,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: COLORS.bg,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  docList: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    overflow: "hidden",
  },

  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.bg,
  },

  docRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  docIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },

  docName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.ink,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "100%",
    height: "80%",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
    padding: 8,
  },
});