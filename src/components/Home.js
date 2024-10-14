import React, { useState, useEffect } from 'react';
import { get, ref } from 'firebase/database';
import { Database } from '../firebase';
import { Bar, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register the necessary components of Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Home = () => {
    const [chartData, setChartData] = useState(null);  // Data for Bar Chart
    const [pieData, setPieData] = useState(null);      // Data for Pie Chart

    // Function to fetch data from Firebase
    const fetchData = () => {
        const userRef = ref(Database, 'user');
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userArray = Object.entries(snapshot.val()).map(([id, data]) => ({
                        id,
                        ...data,
                    }));

                    // Sort userArray by 'Jumlah' in ascending order
                    const sortedUserArray = userArray.sort((a, b) => a.Jumlah - b.Jumlah);

                    // Define a color palette for the bars and pie segments
                    const colors = [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(100, 255, 100, 0.6)',
                        'rgba(255, 99, 132, 0.4)',
                        'rgba(54, 162, 235, 0.4)',
                    ];

                    // Prepare data for the bar chart
                    const labels = sortedUserArray.map((user) => user.Nama); 
                    const data = sortedUserArray.map((user) => user.Jumlah); 

                    // Set data for Bar Chart
                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Jumlah',
                                data: data,
                                backgroundColor: data.map((_, index) => colors[index % colors.length]), // Change color by index
                                borderColor: data.map((_, index) => colors[index % colors.length]),
                                borderWidth: 1,
                            },
                        ],
                    });

                    // Set data for Pie Chart
                    setPieData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Jumlah',
                                data: data,
                                backgroundColor: colors, // Use the same color palette
                                borderColor: colors.map((color) => color.replace('0.6', '1')), // Stronger border colors
                                borderWidth: 1,
                            },
                        ],
                    });
                } else {
                    console.log('No Data EXISTS');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // UseEffect with setInterval for updating data every 2 minutes (120000 ms)
    useEffect(() => {
        fetchData(); // Initial fetch

        const intervalId = setInterval(() => {
            fetchData(); // Fetch data again every 2 minutes
        }, 20); // 120000 ms = 2 minutes

        return () => clearInterval(intervalId); // Clear the interval when the component is unmounted
    }, []);

    return (
        <div>
            <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <img src="https://blob.cloudcomputing.id/images/cff1b270-8f1e-49cc-a83e-dee70292f361/halodoc-l-min.jpg" alt="Logo" style={{ height: '50px', marginRight: '20px' }} />
                <Link to="/home" style={{ marginRight: '10px' }}>Home</Link>
                <Link to="/add" style={{ marginRight: '10px' }}>Add Data</Link>
                <Link to="/nambah" style={{ marginRight: '10px' }}>Nambah Data</Link>
                <Link to="/delete" style={{ marginRight: '10px' }}>Delete Data</Link>
                <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
                <Link to="/admin" style={{ marginRight: '10px' }}>Admin Table</Link>
            </nav>
            {/* Flex container for Bar and Pie Charts */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '30px' }}>
                {/* Render Bar Chart */}
                <div style={{ width: '800px', height: '600px' }}> {/* Increased width and height */}
                    {chartData ? (
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,  // Allow the chart to fill the container
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Jumlah Data Pengguna (Bar Chart)',
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p>Loading bar chart...</p>
                    )}
                </div>

                {/* Render Pie Chart */}
                <div style={{ width: '500px', height: '500px' }}> {/* Increased width and height */}
                    {pieData ? (
                        <Pie
                            data={pieData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,  // Allow the chart to fill the container
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Jumlah Data Pengguna (Pie Chart)',
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p>Loading pie chart...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
