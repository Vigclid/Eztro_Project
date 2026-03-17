// ─── Per-type metadata interfaces ────────────────────────────────────
export interface targetMetadata {
  kind: string;
  userId?: string;
  houseId?: string;
  roomId: string;
}
export interface notificationRequest {
  type: string;
  target: targetMetadata;
  metadata: LandlordNotificationMetadata;
}
export interface LandlordNotificationMetadata {
  message: string;
}
export interface SystemAnnouncementMetadata {
  message: string;
}

export interface SystemMaintenanceMetadata {
  message: string;
  scheduledAt?: string; // ISO date string
}

export interface LandlordBroadcastMetadata {
  message: string;
  houseId: string;
}

export interface LandlordInvoiceMetadata {
  invoiceId: string;
  amount: number;
  roomId: string;
  dueDate?: string; // ISO date string
}

export interface LandlordRuleUpdateMetadata {
  message: string;
  houseId: string;
}

export interface InteractionCommentMetadata {
  postId: string;
  commentId: string;
  preview: string; // first N chars of comment content
}

export interface InteractionLikeMetadata {
  postId: string;
  preview?: string;
}

export interface InteractionMentionMetadata {
  postId: string;
  commentId?: string;
  preview?: string;
}

export interface PaymentDueMetadata {
  invoiceId: string;
  amount: number;
  dueDate: string; // ISO date string
  roomId?: string;
}

export interface PaymentReceivedMetadata {
  invoiceId: string;
  amount: number;
  roomId?: string;
  paidAt?: string; // ISO date string
}

// ─── Discriminated union ─────────────────────────────────────────────

export type NotificationMetadata =
  | SystemAnnouncementMetadata
  | SystemMaintenanceMetadata
  | LandlordBroadcastMetadata
  | LandlordInvoiceMetadata
  | LandlordRuleUpdateMetadata
  | InteractionCommentMetadata
  | InteractionLikeMetadata
  | InteractionMentionMetadata
  | PaymentDueMetadata
  | PaymentReceivedMetadata;

// ─── Type-safe map: notification type → metadata shape ───────────────

export interface NotificationMetadataMap {
  SYSTEM_ANNOUNCEMENT: SystemAnnouncementMetadata;
  SYSTEM_MAINTENANCE: SystemMaintenanceMetadata;
  LANDLORD_BROADCAST: LandlordBroadcastMetadata;
  LANDLORD_INVOICE: LandlordInvoiceMetadata;
  LANDLORD_RULE_UPDATE: LandlordRuleUpdateMetadata;
  INTERACTION_COMMENT: InteractionCommentMetadata;
  INTERACTION_LIKE: InteractionLikeMetadata;
  INTERACTION_MENTION: InteractionMentionMetadata;
  PAYMENT_DUE: PaymentDueMetadata;
  PAYMENT_RECEIVED: PaymentReceivedMetadata;
}
