from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import csv

app = Flask(__name__)
CORS(app)

def read_csv(service, timeslot):
    data = []
    df = pd.read_csv('data/'+service + '.csv')
    for index, row in df.iterrows():
        availability = row['slot' + str(timeslot)]
        if availability != 0:
            data.append({'doctor': row['doc_name'], 'timeslot': timeslot, 'service': service})
    return data

@app.route('/api/availability', methods=['GET'])
def get_availability():
    service = request.args.get('service')
    timeslot = int(request.args.get('timeslot'))
    return jsonify(read_csv(service, timeslot))


def write_to_csv(data):
    with open('databookings.csv', mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([data['name'], data['email'], data['phone'], data['doctor'], data['timeslot'], data['service'], data['date']])
    doctor_csv = 'data/'+data['service'] + '.csv'
    df = pd.read_csv(doctor_csv)
    for index, row in df.iterrows():
        if row['doc_name'] == data['doctor']:
            slot_column = 'slot' + str(data['timeslot'])
            print("Current slot value:", row[slot_column])
            if row[slot_column] > 0:
                df.at[index, slot_column] -= 1
                print("Slot value after decrement:", df.at[index, slot_column]) 
            else:
                print("Slot already booked, no change needed.")
            break 
    df.to_csv(doctor_csv, index=False)


@app.route('/api/book', methods=['POST'])
def book_appointment():
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    doctor = request.form.get('doctor')
    timeslot = int(request.form.get('timeslot'))
    service = request.form.get('service')
    date = request.form.get('date')
    doctor_csv = service + '.csv'
    df = pd.read_csv('data/'+doctor_csv)
    for index, row in df.iterrows():
        if row['doc_name'] == doctor:
            slot_column = 'slot' + str(timeslot)
            if row[slot_column] == 0:
                return jsonify({'status': 'error', 'message': 'Slot not available'})
            break
    booking_data = {'name': name, 'email': email, 'phone': phone, 'doctor': doctor, 'timeslot': timeslot, 'service': service, 'date': date}
    write_to_csv(booking_data)
    return jsonify({'status': 'success', 'message': 'Appointment booked successfully'})


@app.route('/')
def index():
    return 'Server is online'

if __name__ == '__main__':
    app.run(debug=True)
