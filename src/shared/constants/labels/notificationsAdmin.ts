/**
 * Admin notification log filters + broadcast composer copy.
 * NOT YET merged into the root LABELS export — see "SHARED FILE CHANGES
 * NEEDED" in the delivering task's report. Imported directly for now.
 */
export const notificationsAdminLabels = {
  notificationLogFilters: "Filters",
  notificationFilterType: "Type",
  notificationFilterChannel: "Channel",
  notificationFilterStatus: "Status",
  notificationFilterAllTypes: "All types",
  notificationFilterAllChannels: "All channels",
  notificationFilterAllStatuses: "All statuses",
  broadcastTitle: "Send broadcast",
  broadcastHint:
    "Send a one-off email to every user in a role. Delivered through the same queue as transactional notifications.",
  broadcastTargetRole: "Target role",
  broadcastSubject: "Subject",
  broadcastMessage: "Message",
  broadcastSubmit: "Send broadcast",
  broadcastSubjectPlaceholder: "e.g. Scheduled maintenance tonight",
  broadcastMessagePlaceholder: "Write the message body shown to recipients…",
  broadcastMissingFields: "Enter a subject and a message before sending.",
  broadcastSending: "Sending broadcast…",
} as const;
