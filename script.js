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
