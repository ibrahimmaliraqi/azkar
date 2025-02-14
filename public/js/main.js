// Main JavaScript file for frontend functionality
document.addEventListener('DOMContentLoaded', () => {
    loadDailyHadith();
    loadRandomDhikr();

    // Add refresh button after hadith loads
    const hadithSection = document.querySelector('.hadith-section');
    const refreshButton = document.createElement('div');
    refreshButton.className = 'text-center mt-3';
    refreshButton.innerHTML = `
        <button class="btn btn-outline-primary" onclick="loadDailyHadith()">
            <i class="fas fa-sync-alt"></i> حديث آخر
        </button>
    `;
    hadithSection.appendChild(refreshButton);
});

// Hadith functionality
async function loadDailyHadith() {
    const hadithElement = document.getElementById('daily-hadith');
    hadithElement.innerHTML = `
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
            </div>
        </div>
    `;

    try {
        // Using sunnah.com API for reliable hadiths
        const response = await fetch('https://api.sunnah.com/v1/hadiths/random', {
            headers: {
                'X-API-Key': 'SqD712P3E82xnwOAEOkGd5JZH8s9wRR24TqNFzjk'
            }
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        
        hadithElement.innerHTML = `
            <div class="hadith-content">
                <p class="hadith-text">${data.hadith.arabic}</p>
                <div class="hadith-info">
                    <p class="narrator">${data.hadith.narrator}</p>
                    <p class="source">صحيح ${data.collection}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error with primary API:', error);
        
        // Fallback to alternative API
        try {
            const response = await fetch('https://api.hadith.gading.dev/books/muslim?range=1-300');
            const data = await response.json();
            
            if (data.data && data.data.hadiths) {
                const randomIndex = Math.floor(Math.random() * data.data.hadiths.length);
                const hadith = data.data.hadiths[randomIndex];
                
                hadithElement.innerHTML = `
                    <div class="hadith-content">
                        <p class="hadith-text">${hadith.arab}</p>
                        <div class="hadith-info">
                            ${hadith.number ? `<p class="source">حديث رقم: ${hadith.number}</p>` : ''}
                        </div>
                    </div>
                `;
            } else {
                throw new Error('Invalid data from fallback API');
            }
        } catch (fallbackError) {
            console.error('Error with fallback API:', fallbackError);
            
            // Final fallback to local static hadith
            hadithElement.innerHTML = `
                <div class="hadith-content">
                    <p class="hadith-text">إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى</p>
                    <div class="hadith-info">
                        <p class="narrator">رواه عمر بن الخطاب رضي الله عنه</p>
                        <p class="source">متفق عليه</p>
                    </div>
                </div>
            `;
        }
    }
}

// Random Dhikr functionality
async function loadRandomDhikr() {
    const adhkarData = {
        morning: [
            { text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", count: 100, virtue: "حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ" },
            { text: "لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10, virtue: "كان كمن أعتق أربعة أنفس من ولد إسماعيل" },
            { text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3, virtue: "لم يضره شيء حتى يمسي" }
        ],
        evening: [
            { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", count: 1, virtue: "من أذكار المساء المأثورة" },
            { text: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ", count: 100, virtue: "من قالها في اليوم مائة مرة كتبت له براءة من النفاق" },
            { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد", count: 10, virtue: "من صلى علي حين يصبح وحين يمسي أدركته شفاعتي يوم القيامة" }
        ]
    };

    const allAdhkar = [...adhkarData.morning, ...adhkarData.evening];
    const randomDhikr = allAdhkar[Math.floor(Math.random() * allAdhkar.length)];

    const dhikrSection = document.createElement('section');
    dhikrSection.className = 'dhikr-section mb-5';
    dhikrSection.innerHTML = `
        <div class="section-header text-center mb-4">
            <h2><i class="fas fa-heart"></i> ذكر اليوم</h2>
            <div class="divider"></div>
        </div>
        <div class="dhikr-card">
            <div class="dhikr-content">
                <p class="dhikr-text">${randomDhikr.text}</p>
                <div class="dhikr-info">
                    <span class="count-badge">${randomDhikr.count} مرات</span>
                    <p class="virtue mt-3">${randomDhikr.virtue}</p>
                </div>
                <div class="action-buttons mt-3">
                    <button class="btn btn-outline-primary copy-btn" onclick="navigator.clipboard.writeText('${randomDhikr.text}')">
                        <i class="fas fa-copy"></i> نسخ
                    </button>
                    <a href="tasbih.html" class="btn btn-primary">
                        <i class="fas fa-calculator"></i> سبّح
                    </a>
                </div>
            </div>
        </div>
    `;

    // Insert the dhikr section after the hadith section
    const hadithSection = document.querySelector('.hadith-section');
    hadithSection.parentNode.insertBefore(dhikrSection, hadithSection.nextSibling);
}

// Athkar functionality
async function loadAthkar() {
    try {
        const response = await fetch('/api/athkar');
        const athkar = await response.json();
        const athkarList = document.getElementById('athkar-list');
        
        athkar.forEach(thikr => {
            const div = document.createElement('div');
            div.className = 'col-md-6 col-lg-4 athkar-item';
            div.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <p class="card-text">${thikr.text}</p>
                        <p class="text-muted">التكرار: ${thikr.count}</p>
                        ${thikr.virtue ? `<p class="text-muted">الفضل: ${thikr.virtue}</p>` : ''}
                    </div>
                </div>
            `;
            athkarList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading athkar:', error);
    }
}

// Tasbih functionality
function initializeTasbih() {
    const tasbihButton = document.getElementById('tasbih-button');
    const resetButton = document.getElementById('reset-button');
    const countDisplay = document.querySelector('.tasbih-count');
    let count = 0;

    tasbihButton.addEventListener('click', () => {
        count++;
        countDisplay.textContent = count;
        // Add vibration feedback if supported
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
    });

    resetButton.addEventListener('click', () => {
        count = 0;
        countDisplay.textContent = count;
    });

    // Enable keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            tasbihButton.click();
        } else if (e.code === 'KeyR') {
            resetButton.click();
        }
    });
}