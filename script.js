const searchForm = document.getElementById('searchForm');
const bookingForm = document.getElementById('bookingForm');
const service = document.getElementById('service');
const timeslot = document.getElementById('timeslot');
const doctorData = document.getElementById('doctorData');
const result = document.getElementById('result');
const error = document.getElementById('error');
const loading = document.getElementById('loading');
const booking = document.getElementById('booking');
const doctor = document.getElementById('doctor');
const date = document.getElementById('date');
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    result.hidden = true;
    error.hidden = true;
    loading.hidden = false;
    fetch(`http://127.0.0.1:5000/api/availability?service=${service.value}&timeslot=${timeslot.value}`)
        .then(response => response.json())
        .then(data => {
            loading.hidden = true;
            if (data.length === 0) {
                error.hidden = false;
            } else {
                doctorData.innerHTML = '';
                const selectDoctorOption = document.createElement('option');
                selectDoctorOption.text = 'Select a doctor';
                selectDoctorOption.value = '';
                doctorData.appendChild(selectDoctorOption);
                data.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.doctor;
                    option.textContent = doctor.doctor;
                    doctorData.appendChild(option);
                });
                result.hidden = false;
            }
        });
    document.getElementById('booking_timeslot').value = timeslot.value;
    document.getElementById('booking_service').value = service.value;
});


doctorData.addEventListener('change', function () {
    booking.hidden = false;
    document.getElementById('booking_doctor').value = doctorData.value;
    document.getElementById('booking_date').value = new Date().toISOString().split('T')[0];
});


bookingForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (doctorData.value === '') {
        alert('Please select a doctor.');
        return;
    }
    
    const formData = new FormData(bookingForm);
    fetch('http://127.0.0.1:5000/api/book', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            alert('Booking successful');
        });
});


const chatchatbot = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

const responses = {
    "greeting": "Hello sir/ma'am,how can we help you?",
    "appointment_request": "Sure, I can help you schedule an appointment. Could you specify your name along with the details?",
    "date_request": "Great! When would you like to schedule the appointment? Please provide the date in the format 'day, date month'. For example, 'Monday, 15th March'.",
    "confirmation": "Your appointment has been scheduled. We will send you a reiteration shortly.",
    "hospital_services": " Our hospital provides a wide range of services to keep people healthy and cared for in times of illness or injury. Our hospital serves as hubs of healing, with managed care by dedicated professionals, from doctors and nurses to technicians and support staff for medical equipment, all working together to ensure our well-being..",
    "closing_time": "Our hospital is open from 8:00 AM to 10:00 PM from Monday to Saturday, and from 9:00 AM to 5:00 PM on weekends.",
    "ambulance_inquiry": "Yes, we provide ambulance services. If you need an ambulance, please call our emergency hotline at XXX-XXXX-XXXX.",
    "confirm_appointment": "Thank you for confirming. Your appointment is scheduled. Is there anything else I can assist you with?"
};

let currentStep = "greeting";
chatForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const userMessage = userInput.value.trim();
    if (userMessage !== '') {
        appendMessage('user', userMessage);
        processUserMessage(userMessage.toLowerCase());
        userInput.value = '';
    }
});

function processUserMessage(message) {
    switch (currentStep) {
        case "greeting":
            appendMessage('bot', responses.greeting);
            currentStep = "appointment_request";
            break;
        case "appointment_request":
            appendMessage('bot', responses.date_request);
            currentStep = "date_request";
            break;
        case "date_request":
            appendMessage('bot', responses.confirmation);
            currentStep = "confirmation";
            break;
        case "confirmation":
            if (message.includes("services") || message.includes("provide")) {
                appendMessage('bot', responses.hospital_services);
            } else if (message.includes("closing") || message.includes("closed")) {
                appendMessage('bot', responses.closing_time);
            } else if (message.includes("ambulance")) {
                appendMessage('bot', responses.ambulance_inquiry);
            } else if (message.includes("confirm")) {
                appendMessage('bot', responses.confirm_appointment);
            } else {
                appendMessage('bot', "I'm sorry, I couldn't understand your question. Please let me know if there's anything else I can assist you with.");
            }
            break;
        default:
            appendMessage('bot', "Hi");
            break;
    }
}

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender + '-message');
    messageElement.textContent = message;
    chatchatbot.appendChild(messageElement);
    chatchatbot.scrollTop = chatchatbot.scrollHeight;
}

function appointmentbook() {window.location.href = "#doctor";}