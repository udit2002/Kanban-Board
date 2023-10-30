const priorityIcons = {
  4: "fa-solid fa-circle-exclamation",
  3: "fas fa-arrow-up", // High
  2: "fas fa-arrow-right", // Medium
  1: "fas fa-arrow-down", // Low
  0: "fas fa-circle"
};
const statusIcons = {
  Backlog: "fa-solid fa-circle-xmark",
  "In progress": "fas fa-arrow-up",
  Todo: "fa-sharp fa-solid fa-circle-info",
  Done: "fa-solid fa-check"
};
const priorityLabels = {
  4: "Urgent",
  3: "High",
  2: "Medium",
  1: "Low",
  0: "No priority"
};

export default priorityIcons;
export { statusIcons, priorityLabels };
