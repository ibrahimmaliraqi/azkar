// Athkar page functionality
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('athkar-category');
    categorySelect.addEventListener('change', loadAthkar);
    loadAthkar();
});

async function loadAthkar() {
    const categoryId = document.getElementById('athkar-category').value;
    const athkarList = document.getElementById('athkar-list');
    const dhikrStack = document.querySelector('.current-dhikr-stack');
    
    athkarList.innerHTML = '<div class="text-center w-100"><div class="spinner-border" role="status"></div></div>';

    try {
        const response = await fetch(`https://www.hisnmuslim.com/api/ar/${categoryId}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (!data || !data.content) {
            throw new Error('Invalid API response');
        }

        // Clear the list
        athkarList.innerHTML = '';

        // Create and append athkar items
        data.content.forEach((thikr, index) => {
            const div = document.createElement('div');
            div.className = 'col-md-6 col-lg-4 mb-4 athkar-item';
            div.innerHTML = `
                <div class="athkar-card" data-index="${index}">
                    <div class="card-body">
                        <div class="thikr-text">${thikr.text || thikr.ARABIC_TEXT}</div>
                        <div class="thikr-info">
                            <span class="count-badge">${thikr.repeat || thikr.count || 1} مرات</span>
                            ${thikr.fadl ? `<p class="description mt-2">${thikr.fadl}</p>` : ''}
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-outline-primary btn-sm copy-btn">
                                <i class="fas fa-copy"></i> نسخ
                            </button>
                            <button class="btn btn-outline-success btn-sm start-dhikr-btn">
                                <i class="fas fa-play"></i> ابدأ
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const card = div.querySelector('.athkar-card');
            const startBtn = div.querySelector('.start-dhikr-btn');
            const copyBtn = div.querySelector('.copy-btn');
            const dhikrText = thikr.text || thikr.ARABIC_TEXT;
            const targetCount = thikr.repeat || thikr.count || 1;

            startBtn.addEventListener('click', () => {
                if (card.classList.contains('active')) return;
                
                card.classList.add('active');
                
                const stackItem = document.createElement('div');
                stackItem.className = 'stack-item';
                stackItem.innerHTML = `
                    <div class="stack-content">
                        <div class="stack-text">${dhikrText}</div>
                        <div class="stack-progress">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: 0%">
                                    0/${targetCount}
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-counter">
                            <i class="fas fa-hand-point-up"></i>
                        </button>
                    </div>
                `;

                let currentCount = 0;
                const progressBar = stackItem.querySelector('.progress-bar');
                const counterBtn = stackItem.querySelector('.btn-counter');

                counterBtn.addEventListener('click', () => {
                    currentCount++;
                    const progress = (currentCount / targetCount) * 100;
                    progressBar.style.width = `${progress}%`;
                    progressBar.textContent = `${currentCount}/${targetCount}`;

                    // Vibration feedback
                    if ('vibrate' in navigator) {
                        navigator.vibrate(20);
                    }

                    if (currentCount === targetCount) {
                        // Completion animation and feedback
                        if ('vibrate' in navigator) {
                            navigator.vibrate([100, 30, 100]);
                        }

                        stackItem.style.animation = 'completeGlow 1s ease-in-out';
                        setTimeout(() => {
                            stackItem.classList.add('completed');
                            setTimeout(() => {
                                stackItem.style.animation = 'slideOutRight 0.5s ease-out forwards';
                                setTimeout(() => {
                                    stackItem.remove();
                                    card.classList.remove('active');
                                    
                                    // Update completed count
                                    const completedCount = document.querySelector('.completed-dhikr-count .badge');
                                    const currentCompleted = parseInt(completedCount.textContent) || 0;
                                    completedCount.textContent = `${currentCompleted + 1} أذكار مكتملة`;
                                }, 500);
                            }, 1000);
                        }, 500);
                    }
                });

                // Add to top of stack
                if (dhikrStack.firstChild) {
                    dhikrStack.insertBefore(stackItem, dhikrStack.firstChild);
                } else {
                    dhikrStack.appendChild(stackItem);
                }
            });

            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(dhikrText);
                copyBtn.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> نسخ';
                }, 2000);
            });

            athkarList.appendChild(div);
        });

    } catch (error) {
        console.error('Error:', error);
        athkarList.innerHTML = `
            <div class="alert alert-danger text-center">
                حدث خطأ في تحميل الأذكار
                <button class="btn btn-outline-danger btn-sm ms-2" onclick="loadAthkar()">
                    <i class="fas fa-sync-alt"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}