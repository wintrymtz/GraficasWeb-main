
const modeTitle = document.getElementById('modeTitle');
const TableButton = document.getElementById('switchTable');

const tableHistory = document.getElementById('tableHistory');
const tableClock = document.getElementById('tableClock');

TableButton.addEventListener('click', () => {
    if (tableHistory.style.display === 'none') {
        tableHistory.style.display = 'block';
        tableClock.style.display = 'none';

        TableButton.textContent = 'Modo Contrarreloj';
        modeTitle.textContent = 'Modo Historia';
    } else {
        tableHistory.style.display = 'none';
        tableClock.style.display = 'block';

        TableButton.textContent = 'Modo Historia';
        modeTitle.textContent = 'Modo Contrarreloj';
    }
});
