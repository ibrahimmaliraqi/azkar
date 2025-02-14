// Hadith page functionality
document.addEventListener('DOMContentLoaded', () => {
    const hadithElement = document.getElementById('daily-hadith');
    const refreshButton = document.getElementById('refresh-hadith');
    
    loadDailyHadith();
    
    refreshButton.addEventListener('click', loadDailyHadith);
    
    async function loadDailyHadith() {
        try {
            // Using an external API for Hadiths
            const response = await fetch('https://api.hadith.gading.dev/books/muslim?range=1-300');
            const data = await response.json();
            
            if (data.data && data.data.hadiths) {
                const randomIndex = Math.floor(Math.random() * data.data.hadiths.length);
                const hadith = data.data.hadiths[randomIndex];
                
                hadithElement.innerHTML = `
                    <p class="fs-4 mb-4 text-center">${hadith.arab}</p>
                    <p class="text-muted mb-2">${hadith.id}</p>
                    ${hadith.narrator ? `<p class="text-muted">الراوي: ${hadith.narrator}</p>` : ''}
                `;
            }
        } catch (error) {
            hadithElement.innerHTML = '<div class="alert alert-danger">حدث خطأ في تحميل الحديث</div>';
            console.error('Error loading hadith:', error);
            
            // Fallback to local API if external API fails
            try {
                const response = await fetch('/api/hadith/daily');
                const hadith = await response.json();
                hadithElement.innerHTML = `
                    <p class="fs-4 mb-4 text-center">${hadith.text}</p>
                    ${hadith.narrator ? `<p class="text-muted">الراوي: ${hadith.narrator}</p>` : ''}
                    ${hadith.source ? `<p class="text-muted">المصدر: ${hadith.source}</p>` : ''}
                `;
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
            }
        }
    }
});