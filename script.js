document.addEventListener('DOMContentLoaded', function() {
    // GPT 링크 기능
    const gptLinks = document.querySelectorAll('.gpt-link');
    gptLinks.forEach(function(button) {
        button.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank');
            }
        });
    });

    // 검색 기능
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const gptItems = document.querySelectorAll('.gpt-item');
    const noResults = document.getElementById('noResults');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        gptItems.forEach(function(item) {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            
            const isVisible = title.includes(searchTerm) || description.includes(searchTerm);
            
            if (isVisible) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // 검색 결과가 없을 때 메시지 표시
        if (visibleCount === 0 && searchTerm !== '') {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }

        // Clear 버튼 표시/숨김
        if (searchTerm !== '') {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }

    // 검색 입력 이벤트
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });

    // 검색 초기화 기능
    function clearSearch() {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        noResults.style.display = 'none';
        
        // 현재 활성화된 필터에 따라 아이템 표시
        const activeFilter = document.querySelector('.filter-btn.active');
        filterByCategory(activeFilter.getAttribute('data-category'));
    }

    clearSearchBtn.addEventListener('click', clearSearch);

    // 카테고리 필터 기능
    const filterButtons = document.querySelectorAll('.filter-btn');

    function filterByCategory(category) {
        gptItems.forEach(function(item) {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // 검색어가 있으면 검색도 다시 수행
        if (searchInput.value.trim() !== '') {
            performSearch();
        }
    }

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // 모든 버튼에서 active 클래스 제거
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            
            // 카테고리별 필터링 수행
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });

    // 초기 상태: 모든 아이템 표시
    filterByCategory('all');

    // 접근성을 위한 키보드 네비게이션
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const firstVisibleItem = document.querySelector('.gpt-item:not([style*="display: none"]) .gpt-link');
            if (firstVisibleItem) {
                firstVisibleItem.focus();
            }
        }
    });

    // GPT 아이템들 간의 키보드 네비게이션
    gptLinks.forEach(function(link, index) {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const visibleLinks = Array.from(gptLinks).filter(l => 
                    l.closest('.gpt-item').style.display !== 'none'
                );
                const currentIndex = visibleLinks.indexOf(this);
                const nextIndex = (currentIndex + 1) % visibleLinks.length;
                visibleLinks[nextIndex].focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const visibleLinks = Array.from(gptLinks).filter(l => 
                    l.closest('.gpt-item').style.display !== 'none'
                );
                const currentIndex = visibleLinks.indexOf(this);
                const prevIndex = currentIndex === 0 ? visibleLinks.length - 1 : currentIndex - 1;
                visibleLinks[prevIndex].focus();
            } else if (e.key === 'Escape') {
                searchInput.focus();
            }
        });
    });

    // 스크롤 시 헤더 그림자 효과
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 아래로 스크롤할 때
            header.style.transform = 'translateY(-10px)';
            header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        } else {
            // 위로 스크롤하거나 상단일 때
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 페이지 로드 시 애니메이션 효과
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // GPT 아이템들에 페이드인 효과 적용
    gptItems.forEach(function(item, index) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
});