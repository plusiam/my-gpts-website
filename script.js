document.addEventListener('DOMContentLoaded', function() {
    const gptLinks = document.querySelectorAll('.gpt-link');

    gptLinks.forEach(function(button) {
        button.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank'); // 새 창 또는 새 탭에서 링크 열기
            }
        });
    });
});