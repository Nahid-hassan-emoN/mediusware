import { useState, useEffect } from "react";

const API_URL_ALL = "https://example.com/api/contacts/all";
const API_URL_US = "https://example.com/api/contacts/us";

function App() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [tasks, setTasks] = useState([]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const addTask = () => {
    setTasks([...tasks, { name, status }]);
    setName(""); // Reset the name input field after adding the task
  };

  const filterByStatus = (status) => {
    if (status === "All") {
      setTasks(
        tasks.sort((a, b) => {
          if (a.status === "Active" && b.status !== "Active") return -1;
          if (
            a.status === "Completed" &&
            b.status !== "Active" &&
            b.status !== "Completed"
          )
            return -1;
          return 1;
        })
      );
    } else {
      setTasks(tasks.filter((task) => task.status === status));
    }
  };
  const [modalType, setModalType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [evenOnly, setEvenOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (modalType === "all") {
      fetchContacts(API_URL_ALL);
    } else if (modalType === "us") {
      fetchContacts(API_URL_US);
    }
  }, [modalType]);

  const fetchContacts = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
    setPage(1);
  };

  const closeModal = () => {
    setModalType(null);
    setModalVisible(false);
  };

  const toggleEvenOnly = () => {
    setEvenOnly(!evenOnly);
  };

  const filterContacts = (searchTerm) => {
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const handleSearchChange = (event) => {
    filterContacts(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      filterContacts(event.target.value);
    }
  };

  const loadNextPage = () => {
    setPage(page + 1);
  };

  return (
    <>
      <h1>problem 1</h1>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            required
          />
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Archive">Archive</option>
          </select>
          <button type="button" onClick={addTask}>
            Submit
          </button>
        </form>

        <p>
          Filter by status:
          <button onClick={() => filterByStatus("Active")}>Active</button>
          <button onClick={() => filterByStatus("Completed")}>Completed</button>
          <button onClick={() => filterByStatus("All")}>All</button>
        </p>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.name}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h1>Problem 2</h1>
      <div>
        <div className="buttons">
          <button
            style={{ backgroundColor: "#461391" }}
            onClick={() => openModal("all")}
          >
            All Contacts
          </button>
          <button
            style={{ backgroundColor: "#ff7f50" }}
            onClick={() => openModal("us")}
          >
            US Contacts
          </button>
        </div>

        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <div className="header">
                <h2>{modalType === "all" ? "All Contacts" : "US Contacts"}</h2>
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="contacts">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="contact">
                    <p>{contact.name}</p>
                    <button onClick={() => openModal("details")}>
                      View Details
                    </button>
                  </div>
                ))}
                <button onClick={loadNextPage}>Load More</button>
              </div>
              <div className="footer">
                <label>
                  <input
                    type="checkbox"
                    checked={evenOnly}
                    onChange={toggleEvenOnly}
                  />{" "}
                  Only even
                </label>
                <button
                  style={{
                    backgroundColor: "#461391",
                    color: "white",
                    border: "1px solid #461391",
                  }}
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
