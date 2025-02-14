document.addEventListener('DOMContentLoaded', () => {
    const dhikrSelect = document.getElementById('dhikr-select');
    const customDhikrInput = document.getElementById('custom-dhikr-input');
    const dhikrText = document.getElementById('dhikr-text');
    const targetCountSelect = document.getElementById('target-count');
    const customCountInput = document.getElementById('custom-count');
    const tasbihButton = document.getElementById('tasbih-button');
    const resetButton = document.getElementById('reset-button');
    const saveButton = document.getElementById('save-button');
    const counter = document.getElementById('counter');
    const currentDhikr = document.getElementById('current-dhikr');
    const progressBar = document.getElementById('progress-bar');
    const counterInfo = document.getElementById('counter-info');
    const savedList = document.getElementById('saved-list');

    let count = 0;
    let targetCount = 33;
    let currentDhikrText = '';

    // Load saved counts from localStorage
    loadSavedCounts();

    // Event Listeners
    dhikrSelect.addEventListener('change', () => {
        if (dhikrSelect.value === 'custom') {
            customDhikrInput.classList.remove('d-none');
        } else {
            customDhikrInput.classList.add('d-none');
            currentDhikrText = dhikrSelect.value;
            updateCurrentDhikr();
        }
    });

    targetCountSelect.addEventListener('change', () => {
        if (targetCountSelect.value === 'custom') {
            customCountInput.classList.remove('d-none');
        } else {
            customCountInput.classList.add('d-none');
            targetCount = parseInt(targetCountSelect.value);
            updateCounterInfo();
        }
    });

    customCountInput.addEventListener('change', () => {
        targetCount = parseInt(customCountInput.value) || 33;
        updateCounterInfo();
    });

    dhikrText.addEventListener('input', () => {
        currentDhikrText = dhikrText.value;
        updateCurrentDhikr();
    });

    tasbihButton.addEventListener('click', () => {
        if (count < targetCount) {
            count++;
            updateCounter();
            // Add vibration feedback if supported
            if ('vibrate' in navigator) {
                navigator.vibrate(20);
            }
        }
        if (count === targetCount) {
            completeDhikr();
        }
    });

    resetButton.addEventListener('click', () => {
        count = 0;
        updateCounter();
    });

    saveButton.addEventListener('click', saveDhikrCount);

    // Enable keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent page scroll
            tasbihButton.click();
        } else if (e.code === 'KeyR') {
            resetButton.click();
        } else if (e.code === 'KeyS') {
            saveButton.click();
        }
    });

    // Helper functions
    function updateCounter() {
        counter.textContent = count;
        updateProgress();
        updateCounterInfo();
    }

    function updateProgress() {
        const progress = (count / targetCount) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function updateCounterInfo() {
        counterInfo.textContent = `${count}/${targetCount}`;
    }

    function updateCurrentDhikr() {
        currentDhikr.textContent = currentDhikrText || 'اختر ذكراً';
    }

    function completeDhikr() {
        tasbihButton.classList.add('btn-success');
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('أكملت الذكر!', {
                body: `أتممت ${targetCount} مرة من ${currentDhikrText}`,
            });
        }
    }

    function saveDhikrCount() {
        const timestamp = new Date().toLocaleString('ar-SA');
        const savedCount = {
            dhikr: currentDhikrText,
            count: count,
            target: targetCount,
            timestamp: timestamp
        };

        let savedCounts = JSON.parse(localStorage.getItem('savedCounts') || '[]');
        savedCounts.unshift(savedCount); // Add to beginning of array
        if (savedCounts.length > 10) savedCounts.pop(); // Keep only last 10 entries
        localStorage.setItem('savedCounts', JSON.stringify(savedCounts));

        loadSavedCounts();
    }

    function loadSavedCounts() {
        const savedCounts = JSON.parse(localStorage.getItem('savedCounts') || '[]');
        savedList.innerHTML = '';
        
        savedCounts.forEach(saved => {
            const item = document.createElement('div');
            item.className = 'list-group-item';
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${saved.dhikr}</strong>
                        <br>
                        <small class="text-muted">${saved.timestamp}</small>
                    </div>
                    <span class="badge bg-primary rounded-pill">${saved.count}/${saved.target}</span>
                </div>
            `;
            savedList.appendChild(item);
        });
    }

    // Initialize
    updateCurrentDhikr();
    updateCounterInfo();

    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});