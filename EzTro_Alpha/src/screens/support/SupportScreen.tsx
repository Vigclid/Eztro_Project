import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Bug,
  Clock,
  HelpCircle,
  Lightbulb,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import { postReportApi, ReportType } from "../../api/report/POST";
import { styles } from "./styles/SupportScreen.styles";
import { appNavigator } from "../../navigation/navigationActions";

const GRADIENT: [string, string] = ["#10b981", "#14b8a6"];

const faqs = [
  {
    category: "Tài khoản",
    icon: "👤",
    questions: [
      {
        q: "Làm sao để đổi mật khẩu?",
        a: "Vào Cá nhân > Đổi mật khẩu và làm theo hướng dẫn.",
      },
      {
        q: "Tôi quên mật khẩu, phải làm sao?",
        a: 'Nhấn "Quên mật khẩu?" ở màn hình đăng nhập, nhập email và làm theo hướng dẫn.',
      },
    ],
  },
  {
    category: "Thanh toán",
    icon: "💰",
    questions: [
      {
        q: "Hỗ trợ những phương thức thanh toán nào?",
        a: "Chúng tôi hỗ trợ chuyển khoản ngân hàng, thẻ tín dụng, MoMo và ZaloPay.",
      },
      {
        q: "Làm sao để xem lịch sử thanh toán?",
        a: "Vào tab Thanh toán từ menu chính để xem tất cả hóa đơn và lịch sử giao dịch.",
      },
    ],
  },
  {
    category: "Phòng trọ",
    icon: "🏠",
    questions: [
      {
        q: "Làm sao để thêm cụm trọ mới?",
        a: 'Vào tab Nhà trọ > Nhấn nút "+" > Điền thông tin cụm trọ và nhấn Lưu.',
      },
      {
        q: "Người thuê tham gia phòng như thế nào?",
        a: "Chủ trọ cung cấp mã phòng, người thuê vào Cài đặt ứng dụng > Tham gia phòng và nhập mã.",
      },
    ],
  },
];

type ContactType = "Help" | "Bug" | "Advice";

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.faqItem, open && styles.faqItemOpen]}
      onPress={() => setOpen(!open)}
      activeOpacity={0.8}
    >
      <View style={styles.faqQuestion}>
        <Text style={styles.faqArrow}>{open ? "▾" : "▸"}</Text>
        <Text style={styles.faqQuestionText}>{question}</Text>
      </View>
      {open && <Text style={styles.faqAnswer}>{answer}</Text>}
    </TouchableOpacity>
  );
};

export const SupportScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [contactType, setContactType] = useState<ContactType>("Help");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<"subject" | "message" | null>(null);

  const openDialog = (type: ContactType) => {
    setContactType(type);
    setSubject("");
    setMessage("");
    setShowModal(true);
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      const res = await postReportApi.createReport({
        typeReport: contactType as ReportType,
        title: subject.trim(),
        description: message.trim(),
      });
      if (res.status) {
        Alert.alert("Thành công", "Đã gửi yêu cầu hỗ trợ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.");
        setShowModal(false);
      } else {
        Alert.alert("Lỗi", "Không thể gửi báo cáo. Vui lòng thử lại.");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể gửi báo cáo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const modalTitle: Record<ContactType, string> = {
    Help: "Yêu cầu hỗ trợ",
    Bug: "Báo cáo lỗi",
    Advice: "Góp ý",
  };

  const subjectPlaceholder: Record<ContactType, string> = {
    Help: "VD: Làm sao để thêm phòng mới?",
    Bug: "VD: Lỗi không hiển thị danh sách phòng",
    Advice: "VD: Đề xuất thêm tính năng xuất báo cáo",
  };

  const modalIconColor: Record<ContactType, [string, string]> = {
    Help: ["#3b82f6", "#2563eb"],
    Bug: ["#ef4444", "#dc2626"],
    Advice: ["#10b981", "#14b8a6"],
  };

  // Get role name from either roleName or roleId.name
  const getRoleName = () => {
    if (user?.roleName) return user.roleName;
    if (user?.roleId && typeof user.roleId === "object" && "name" in user.roleId) {
      return (user.roleId as any).name;
    }
    return "Unknown";
  };

  const roleName = getRoleName();
  const roleLabel = 
    roleName === "Landlord" || roleName === "landlord" 
      ? "Chủ trọ" 
      : "Người thuê";

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENT} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => appNavigator.goBack()}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Liên hệ hỗ trợ</Text>
        <TouchableOpacity 
          style={styles.historyButton} 
          onPress={() => appNavigator.goToMyReportsScreen()}
        >
          <MessageCircle size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Hero */}
          <View style={styles.heroCard}>
            <LinearGradient colors={GRADIENT} style={styles.heroIconWrapper}>
              <MessageCircle size={36} color="#fff" />
            </LinearGradient>
            <Text style={styles.heroTitle}>Chúng tôi luôn sẵn sàng hỗ trợ</Text>
            <Text style={styles.heroDesc}>
              Đội ngũ hỗ trợ 24/7 luôn sẵn sàng giúp bạn giải quyết mọi vấn đề
            </Text>
          </View>

          {/* Contact Methods */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Phone size={20} color="#10b981" />
              <Text style={styles.sectionTitle}>Liên hệ trực tiếp</Text>
            </View>
            <View style={styles.contactGrid}>
              <TouchableOpacity
                style={[styles.contactCard, { borderColor: "#3b82f6" }]}
                onPress={() => Linking.openURL("mailto:support@eztro.com")}
                activeOpacity={0.8}
              >
                <LinearGradient colors={["#3b82f6", "#2563eb"]} style={styles.contactCardIconWrapper}>
                  <Mail size={22} color="#fff" />
                </LinearGradient>
                <Text style={styles.contactCardLabel}>Email</Text>
                <Text style={styles.contactCardValue}>support@eztro.com</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactCard, { borderColor: "#10b981" }]}
                onPress={() => Linking.openURL("tel:19001234")}
                activeOpacity={0.8}
              >
                <LinearGradient colors={["#10b981", "#059669"]} style={styles.contactCardIconWrapper}>
                  <Phone size={22} color="#fff" />
                </LinearGradient>
                <Text style={styles.contactCardLabel}>Hotline</Text>
                <Text style={styles.contactCardValue}>1900 1234</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactCard, { borderColor: "#14b8a6" }]}
                onPress={() => openDialog("Help")}
                activeOpacity={0.8}
              >
                <LinearGradient colors={GRADIENT} style={styles.contactCardIconWrapper}>
                  <MessageCircle size={22} color="#fff" />
                </LinearGradient>
                <Text style={styles.contactCardLabel}>Chat</Text>
                <Text style={styles.contactCardValue}>Nhắn tin ngay</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HelpCircle size={20} color="#10b981" />
              <Text style={styles.sectionTitle}>Bạn cần hỗ trợ gì?</Text>
            </View>
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: "#3b82f6" }]}
                onPress={() => openDialog("Help")}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconWrapper, { backgroundColor: "#eff6ff" }]}>
                  <HelpCircle size={28} color="#3b82f6" />
                </View>
                <Text style={styles.actionTitle}>Cần trợ giúp</Text>
                <Text style={styles.actionDesc}>Đặt câu hỏi về sử dụng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { borderColor: "#ef4444" }]}
                onPress={() => openDialog("Bug")}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconWrapper, { backgroundColor: "#fef2f2" }]}>
                  <Bug size={28} color="#ef4444" />
                </View>
                <Text style={styles.actionTitle}>Báo lỗi</Text>
                <Text style={styles.actionDesc}>Thông báo sự cố</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { borderColor: "#10b981" }]}
                onPress={() => openDialog("Advice")}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconWrapper, { backgroundColor: "#ecfdf5" }]}>
                  <Lightbulb size={28} color="#10b981" />
                </View>
                <Text style={styles.actionTitle}>Góp ý</Text>
                <Text style={styles.actionDesc}>Đề xuất tính năng</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Response Time Banner */}
          <View style={styles.infoBanner}>
            <LinearGradient colors={GRADIENT} style={styles.infoBannerIcon}>
              <Clock size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoBannerTitle}>Thời gian phản hồi</Text>
              <Text style={styles.infoBannerText}>
                Phản hồi trong{" "}
                <Text style={styles.infoBannerHighlight}>24 giờ</Text> làm việc •
                Gói Enterprise:{" "}
                <Text style={styles.infoBannerHighlight}>2 giờ</Text>
              </Text>
            </View>
          </View>

          {/* FAQs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MessageCircle size={20} color="#10b981" />
              <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
            </View>
            {faqs.map((cat, idx) => (
              <View key={idx} style={styles.faqSection}>
                <View style={styles.faqCategoryHeader}>
                  <Text style={styles.faqCategoryIcon}>{cat.icon}</Text>
                  <Text style={styles.faqCategoryTitle}>{cat.category}</Text>
                </View>
                {cat.questions.map((faq, qIdx) => (
                  <FaqItem key={qIdx} question={faq.q} answer={faq.a} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Contact Modal */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <LinearGradient colors={modalIconColor[contactType]} style={styles.modalIconWrapper}>
                  {contactType === "Help" && <HelpCircle size={22} color="#fff" />}
                  {contactType === "Bug" && <Bug size={22} color="#fff" />}
                  {contactType === "Advice" && <Lightbulb size={22} color="#fff" />}
                </LinearGradient>
                <Text style={styles.modalTitle}>{modalTitle[contactType]}</Text>
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.modalInfoBox}>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Tài khoản:</Text>
                  <Text style={styles.modalInfoValue}>{user?.email}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Vai trò:</Text>
                  <Text style={styles.modalInfoValue}>{roleLabel}</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tiêu đề</Text>
                <TextInput
                  style={[styles.textInput, focusedInput === "subject" && styles.textInputFocused]}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder={subjectPlaceholder[contactType]}
                  placeholderTextColor="#9ca3af"
                  onFocus={() => setFocusedInput("subject")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nội dung chi tiết</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, focusedInput === "message" && styles.textInputFocused]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Mô tả chi tiết vấn đề hoặc ý tưởng của bạn..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={5}
                  onFocus={() => setFocusedInput("message")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={handleSend}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient colors={GRADIENT} style={styles.submitBtn}>
                  <Send size={18} color="#fff" />
                  <Text style={styles.submitBtnText}>{loading ? "Đang gửi..." : "Gửi"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
