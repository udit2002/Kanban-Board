import React, { useState, useEffect } from "react";
import axios from "axios";
import priorityIcons, { statusIcons, priorityLabels } from "./Icons";

const userNames = {};

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState("user");
  const [sortingOption, setSortingOption] = useState("priority");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedGroupingOption = localStorage.getItem("groupingOption");
    const savedSortingOption = localStorage.getItem("sortingOption");

    if (savedGroupingOption) {
      setGroupingOption(savedGroupingOption);
    }

    if (savedSortingOption) {
      setSortingOption(savedSortingOption);
    }
    axios
      .get("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => {
        setTickets(response.data.tickets || []);
        const fetchedTickets = response.data.tickets || [];
        const fetchedUsers = response.data.users || [];
        fetchedUsers.forEach((user) => {
          userNames[user.id] = user.name;
        });

        setTickets(fetchedTickets);
        setUsers(fetchedUsers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleGroupingOptionChange = (value) => {
    setGroupingOption(value);
    localStorage.setItem("groupingOption", value); // Save the option to localStorage
  };

  const handleSortingOptionChange = (value) => {
    setSortingOption(value);
    localStorage.setItem("sortingOption", value); // Save the option to localStorage
  };
  const getPriorityLabel = (priority) => {
    return priorityLabels[priority] || "Unknown Priority";
  };
  const groupAndSortTickets = () => {
    let groupedAndSortedTickets = [...tickets];

    if (groupingOption === "user") {
      groupedAndSortedTickets = groupByUser(groupedAndSortedTickets);
    } else if (groupingOption === "priority") {
      groupedAndSortedTickets = groupByPriority(groupedAndSortedTickets);
    } else if (groupingOption === "status") {
      groupedAndSortedTickets = groupByStatus(groupedAndSortedTickets);
    }

    if (sortingOption === "user") {
      groupedAndSortedTickets = sortByUser(groupedAndSortedTickets);
    } else if (sortingOption === "priority") {
      groupedAndSortedTickets = sortByPriority(groupedAndSortedTickets);
    } else if (sortingOption === "status") {
      groupedAndSortedTickets = sortByStatus(groupedAndSortedTickets);
    }

    return groupedAndSortedTickets;
  };
  const getUserName = (userId) => {
    return userNames[userId] || "Unknown User";
  };

  const groupByUser = (tickets) => {
    const groupedTickets = {};
    tickets.forEach((ticket) => {
      const user = ticket.userId || "Unassigned";
      if (!groupedTickets[user]) {
        groupedTickets[user] = [];
      }
      groupedTickets[user].push(ticket);
    });
    return groupedTickets;
  };

  const groupByPriority = (tickets) => {
    const groupedTickets = {
      1: [],
      2: [],
      3: [],
      4: [],
      0: []
    };
    tickets.forEach((ticket) => {
      const priority = ticket.priority || 0;
      groupedTickets[priority].push(ticket);
    });
    return groupedTickets;
  };
  const groupByStatus = (tickets) => {
    const groupedTickets = {};
    tickets.forEach((ticket) => {
      const status = ticket.status || "Unknown Status";
      if (!groupedTickets[status]) {
        groupedTickets[status] = [];
      }
      groupedTickets[status].push(ticket);
    });
    return groupedTickets;
  };
  const sortByUser = (tickets) => {
    for (const group in tickets) {
      tickets[group] = tickets[group].sort((a, b) =>
        (a.userId || "Unassigned").localeCompare(b.userId || "Unassigned")
      );
    }
    return tickets;
  };

  const sortByPriority = (tickets) => {
    for (const group in tickets) {
      tickets[group] = tickets[group].sort(
        (a, b) => (b.priority || 0) - (a.priority || 0)
      );
    }
    return tickets;
  };

  const sortByStatus = (tickets) => {
    for (const group in tickets) {
      tickets[group] = tickets[group].sort((a, b) =>
        a.status.localeCompare(b.status)
      );
    }
    return tickets;
  };

  return (
    <div>
      <div className="heading">
        <h1>KanbanBoard</h1>
      </div>
      <div className="options">
        <label>
          Group By:
          <select
            value={groupingOption}
            onChange={(e) => handleGroupingOptionChange(e.target.value)}
          >
            <option value="user">User</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </label>

        <label>
          Sort By:
          <select
            value={sortingOption}
            onChange={(e) => handleSortingOptionChange(e.target.value)}
          >
            <option value="user">User</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </label>
      </div>
      <div className="board">
        <div className="user-columns">
          {Object.keys(groupAndSortTickets()).map((group) => (
            <div key={group} className="user-column">
              <h2>
                {groupingOption === "user" ? (
                  <>
                    <i className="fas fa-user"></i> {getUserName(group)}
                  </>
                ) : groupingOption === "status" ? (
                  <>
                    <i className={statusIcons[group]}></i> {group}
                  </>
                ) : (
                  <>
                    <i className={priorityIcons[group]}></i>{" "}
                    {getPriorityLabel(group)}
                  </>
                )}
              </h2>
              {groupAndSortTickets()[group].map((ticket) => (
                <div key={ticket.id} className="ticket">
                  <h3>{ticket.title}</h3>
                  <p>Status: {ticket.status}</p>
                  <p>User: {getUserName(ticket.userId) || "Unassigned"}</p>
                  <p>Priority: {ticket.priority || "No priority"}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
