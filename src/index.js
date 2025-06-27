document.addEventListener("DOMContentLoaded", async () => {
  const seatContainer = document.getElementById("seats-container");
  const form = document.getElementById("bookingForm");
  const ticketInfo = document.getElementById("ticket-info");
  const displayName = document.getElementById("displayName");
  const displayPhone = document.getElementById("displayPhone");
  const displaySeats = document.getElementById("displaySeats");
  const displayDate = document.getElementById("displayDate");
  const displayTime = document.getElementById("displayTime");
  const displayDestination = document.getElementById("displayDestination");
  const displayPickup = document.getElementById("displayPickup");
  const travelDateInput = document.getElementById("travelDate");
  const travelTimeInput = document.getElementById("travelTime");
  const destinationInput = document.getElementById("destination");
  const pickupInput = document.getElementById("pickupPoint");
  const bookingHistoryList = document.getElementById("booking-history-list");

  const API_URL = "http://localhost:3000/bookings";
  const TICKET_URL = "http://localhost:3000/latestTicket";

  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 5;

  function isValidPhone(p) {
    return /^07\d{8}$/.test(p);
  }

  function createGrid() {
    seatContainer.innerHTML = "";
    rows.forEach((r) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.dataset.seat = `${r}${i}`;
        seat.textContent = `${r}${i}`;
        seatContainer.appendChild(seat);
      }
    });
  }

  async function loadBooked(date, time) {
    try {
      const res = await fetch(API_URL);
      const allBookings = await res.json();
      const filtered = allBookings.filter(
        (b) => b.travelDate === date && b.travelTime === time
      );
      const bookedSeats = filtered.flatMap((b) => b.seats);

      document.querySelectorAll(".seat").forEach((seat) => {
        seat.classList.remove("booked", "selected");
        if (bookedSeats.includes(seat.dataset.seat)) {
          seat.classList.add("booked");
        }
      });
    } catch (err) {
      console.error("Error loading bookings:", err);
    }
  }

  async function loadLatestTicket() {
    try {
      const res = await fetch(TICKET_URL);
      if (!res.ok) return;
      const ticket = await res.json();

      if (ticket.name && ticket.phone && ticket.seats?.length) {
        displayName.textContent = ticket.name;
        displayPhone.textContent = ticket.phone;
        displaySeats.textContent = ticket.seats.join(", ");
        displayDate.textContent = ticket.travelDate || "N/A";
        displayTime.textContent = ticket.travelTime || "N/A";
        displayDestination.textContent = ticket.destination || "N/A";
        displayPickup.textContent = ticket.pickup || "N/A";
        ticketInfo.style.display = "block";
      }
    } catch (err) {
      console.error("Error loading latest ticket:", err);
    }
  }

  // Booking History Functions
  async function displayBookingHistory() {
    if (!bookingHistoryList) return;

    bookingHistoryList.innerHTML = "<li>Loading bookings...</li>";

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to load bookings");
      const bookings = await res.json();

      if (bookings.length === 0) {
        bookingHistoryList.innerHTML = "<li>No bookings found</li>";
        return;
      }

      bookingHistoryList.innerHTML = bookings
        .map(
          (booking) => `
          <li class="booking-item" data-id="${booking.id || booking.ref}">
            <div class="booking-info">
              <span class="booking-name">${booking.name}</span>
              <span class="booking-phone">${booking.phone}</span>
              <span class="booking-date">${booking.travelDate} at ${
            booking.travelTime
          }</span>
              <span class="booking-seats">Seats: ${
                booking.seats?.join(", ") || "N/A"
              }</span>
              <span class="booking-status">
                ${
                  booking.paymentStatus === "Completed"
                    ? "✅ Paid"
                    : "❌ Pending"
                }
              </span>
            </div>
            <div class="booking-actions">
              <button class="edit-booking" data-id="${
                booking.id || booking.ref
              }" ${booking.paymentStatus === "Completed" ? "disabled" : ""}>
                Mark as Paid
              </button>
              <button class="delete-booking" data-id="${
                booking.id || booking.ref
              }">Delete</button>
            </div>
          </li>
        `
        )
        .join("");

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-booking").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const bookingId = e.target.dataset.id;
          if (confirm("Are you sure you want to cancel this booking?")) {
            await deleteBooking(bookingId);
          }
        });
      });

      // Add event listeners to edit buttons
      document.querySelectorAll(".edit-booking").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const bookingId = e.target.dataset.id;
          if (confirm("Mark this booking as paid?")) {
            await updateBookingStatus(bookingId);
          }
        });
      });
    } catch (error) {
      bookingHistoryList.innerHTML = `<li style="color: red;">Error: ${error.message}</li>`;
      console.error("Booking history error:", error);
    }
  }

  async function deleteBooking(bookingId) {
    try {
      const response = await fetch(`${API_URL}/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete booking");
      await displayBookingHistory();
      alert("Booking cancelled successfully");

      // Refresh the seat grid if we're viewing the same date/time
      const date = travelDateInput.value;
      const time = travelTimeInput.value;
      if (date && time) await loadBooked(date, time);
    } catch (error) {
      console.error("Delete booking error:", error);
      alert(`Failed to cancel booking: ${error.message}`);
    }
  }

  async function updateBookingStatus(bookingId) {
    try {
      // First get the current booking to update
      const getRes = await fetch(`${API_URL}/${bookingId}`);
      if (!getRes.ok) throw new Error("Failed to fetch booking");
      const booking = await getRes.json();

      // Then update it
      const response = await fetch(`${API_URL}/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          paymentStatus: "Completed",
          mpesaCode: "MANUAL_PAYMENT",
        }),
      });

      if (!response.ok) throw new Error("Failed to update booking status");
      await displayBookingHistory();
      alert("✅ Booking marked as paid!");
    } catch (error) {
      console.error("Update error:", error);
      alert(`❌ Failed: ${error.message}`);
    }
  }

  function showReceipt(booking) {
    const paymentStatus =
      booking.paymentStatus === "Completed"
        ? `✅ Paid (Ref: ${booking.ref})`
        : `❌ Unpaid`;

    const receiptDetails = `
Booking Receipt 

PAYMENT STATUS: ${paymentStatus}
Name: ${booking.name}
Phone: ${booking.phone}
Route: ${booking.destination} from ${booking.pickup}
Departure: ${booking.travelDate} at ${booking.travelTime}
Seats: ${booking.seats?.join(", ") || "N/A"}

Thank you for your booking!
`;

    const existingPopup = document.querySelector(".receipt-popup");
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement("div");
    popup.className = "receipt-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    popup.style.zIndex = "1000";
    popup.style.maxWidth = "90%";
    popup.style.width = "400px";

    popup.innerHTML = `
      <pre style="white-space: pre-wrap; font-family: inherit;">${receiptDetails}</pre>
      <button id="closePopup" style="margin-top: 10px; padding: 8px 16px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    `;

    document.body.appendChild(popup);
    document.getElementById("closePopup").addEventListener("click", () => {
      popup.remove();
    });
  }

  seatContainer.addEventListener("click", (e) => {
    const seat = e.target;
    if (seat.classList.contains("seat") && !seat.classList.contains("booked")) {
      seat.classList.toggle("selected");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const travelDate = travelDateInput.value;
    const travelTime = travelTimeInput.value;
    const destination = destinationInput.value.trim();
    const pickup = pickupInput.value.trim();
    const selected = Array.from(
      document.querySelectorAll(".seat.selected")
    ).map((s) => s.dataset.seat);

    if (
      !name ||
      !phone ||
      !selected.length ||
      !travelDate ||
      !travelTime ||
      !destination ||
      !pickup
    ) {
      return alert(
        "Please fill all fields, select seat, date, time, destination and pickup point."
      );
    }

    if (!isValidPhone(phone)) {
      return alert("Phone must start with 07 and be 10 digits.");
    }

    const booking = {
      name,
      phone,
      travelDate,
      travelTime,
      destination,
      pickup,
      seats: selected,
      timestamp: new Date().toISOString(),
      ref: Math.floor(Math.random() * 1000000000).toString(),
      paymentStatus: "Pending",
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      if (!res.ok) throw new Error("Failed to book");

      await fetch(TICKET_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      displayName.textContent = name;
      displayPhone.textContent = phone;
      displaySeats.textContent = selected.join(", ");
      displayDate.textContent = travelDate;
      displayTime.textContent = travelTime;
      displayDestination.textContent = destination;
      displayPickup.textContent = pickup;
      ticketInfo.style.display = "block";

      await loadBooked(travelDate, travelTime);
      form.reset();

      // Show receipt and refresh history
      showReceipt(booking);
      await displayBookingHistory();
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Try again.");
    }
  });

  travelDateInput.addEventListener("change", () => {
    const date = travelDateInput.value;
    const time = travelTimeInput.value;
    if (date && time) loadBooked(date, time);
  });

  travelTimeInput.addEventListener("change", () => {
    const date = travelDateInput.value;
    const time = travelTimeInput.value;
    if (date && time) loadBooked(date, time);
  });

  createGrid();
  await loadLatestTicket();
  await displayBookingHistory();
});
