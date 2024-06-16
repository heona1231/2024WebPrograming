const ctx = document.getElementById('doughnut').getContext('2d');
const doughnut = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['가슴', '등', '어깨', '팔', '하체', '그 외'],
        datasets: [{
            label: '# of Votes',
            data: [3, 2, 5, 2, 3, 1],
            backgroundColor: [                
                '#FE9929',                
                '#FEC44F',
                '#F2DB64',
                '#FEE391',
                '#FFF7BC',
                '#FFFFE5'
            ],
            borderColor: [
                '#000000'
                // '#FE9929',
                // '#FEC44F',
                // '#F2DB64',
                // '#FEE391',
                // '#FFF7BC',
                // '#FFFFE5'
            ],
            borderWidth: 0.5,
            borderRadius: 5
        }]
    },
    options: {
        scales: {
            y: {
                display: false,
            },
            x: {
                display: false,
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 20,
                    padding: 20,
                    font: {
                        family: 'Pretendard',
                        size: 30,
                        weight: 'bold',
                    },
                    marginTop: '60px',
                },
            },
        }
    }
});
