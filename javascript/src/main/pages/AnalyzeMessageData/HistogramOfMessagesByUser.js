import React, { useState } from "react";
import { fetchWithToken } from "../../utils/fetch";
import { useAuth0 } from "@auth0/auth0-react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Row, Col, Button, Form } from "react-bootstrap";
import {Bar} from 'react-chartjs-2';

const columns = [{
    dataField: 'week',
    text: 'Week'
},
{
    dataField: 'count',
    text: 'Message Count'
}
];

const msInDay = 86400*1000;

const HistogramOfMessagesByUser = () => {
    const { getAccessTokenSilently: getToken } = useAuth0();
    const [selectedUser, setSelectedUser] = useState('');
    const [inputName, setInputName] = useState('');
    const [perWeekHistogramData, setPerWeekHistogramData] = useState([]);
    const [histogramChartData, setHistogramChartData] = useState();

    const handleSelectUserOnSubmit = async () => { 
        setSelectedUser(inputName);
        const url = `/api/members/messages/usersearch?searchUser=${inputName}`;
        const options = {
            method: 'GET',
        }
        const messages = await fetchWithToken(url, getToken, options);

        let histogramData = {};

        messages.forEach(i => {
            //mulitply by 1000 to get timestamp in ms
            const date = new Date(i.ts*1000);

            const weekStartDate = new Date(date.getTime() - msInDay*date.getDay());
            const weekEndDate = new Date(date.getTime() + msInDay*(6-date.getDay()));
            const weekString = `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`;

            histogramData[weekString] = histogramData[weekString] > 0? histogramData[weekString]+1 : 1;
        })

        let tableData = [];
        Object.keys(histogramData).forEach(week => tableData.push({
            week: week,
            count: histogramData[week]
        }));
        setPerWeekHistogramData(tableData);


        const label = [];
        const datas = [];

        tableData.forEach(i => {
            label.push(i.week)
        })

        tableData.forEach(i => {
            datas.push(i.count)
        })
        
        let chartData = {
            labels: label,
            datasets: [{
                label: "Messages per Week",
                data: datas,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            }],
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
            order: 0,
            padding: 5,
        };
        setHistogramChartData(chartData);
    };

    return (
        <div>
            <h1>Histogram of Messages By User</h1>
            <Row>
                <Col>
                    <Form.Group controlId="form-select" className="pt-3" style={{ textAlign: "left" }}>
                        <Form.Label>Enter a user</Form.Label>
                        <Form.Control
                            onChange={val => setInputName(val.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={2} className="d-flex align-items-center" style={{ marginTop: "35px" }}>
                    <Button id="submit-button" onClick={handleSelectUserOnSubmit}>Go</Button>
                </Col>
            </Row>
            { selectedUser !== '' &&
                <div>
                    <h3>Histogram of Activity for {selectedUser}</h3>
                    <Bar
                        data={histogramChartData}
                        options={{
                        title:{
                            display:true,
                            text:'Histogram Chart',
                            fontSize:20
                        },
                        legend:{
                            display:true,
                            position:'right'
                        }
                        }}
                    />
                    <h3>Table of Activity for {selectedUser}</h3>
                    <BootstrapTable keyField='week' data={perWeekHistogramData} columns={columns}></BootstrapTable>
                </div>
            }
        </div>
    );
};

export default HistogramOfMessagesByUser;        