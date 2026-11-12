/** Redelivery picker copy (B-45): a day and a window instead of free text. */
export const redeliveryLabels = {
  redeliveryPrompt: "This attempt didn't go through. Pick a new day and time:",
  redeliveryRequested: "Requested: {slot}",
  redeliveryDay: "Day",
  redeliveryDayPlaceholder: "Choose a day",
  redeliveryWindow: "Time window",
  redeliveryWindowPlaceholder: "Choose a time window",
  redeliveryMorning: "Morning (9am–12pm)",
  redeliveryAfternoon: "Afternoon (12pm–4pm)",
  redeliveryEvening: "Evening (4pm–8pm)",
  redeliveryConfirm: "Confirm",
} as const;
