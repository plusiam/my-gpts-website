document.addEventListener('DOMContentLoaded', function() {
    // 사용자 환경 감지
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isDesktop = !isMobile;

    // GPT 링크 기능
    const gptLinks = document.querySelectorAll('.gpt-link');
    gptLinks.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const link = this.getAttribute('data-link');
            const gptName = this.closest('.gpt-item').querySelector('h3').textContent;
            
            if (link) {
                handleGPTAccess(link, gptName);
            }
        });
    });

    // GPT 접근 방식 처리
    function handleGPTAccess(link, gptName) {
        if (isMobile) {
            showMobileAccessModal(link, gptName);
        } else {
            showDesktopAccessModal(link, gptName);
        }
    }

    // 모바일 접근 모달
    function showMobileAccessModal(link, gptName) {
        const modal = createAccessModal(gptName, 'mobile', link);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // 데스크톱 접근 모달
    function showDesktopAccessModal(link, gptName) {
        const modal = createAccessModal(gptName, 'desktop', link);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // 접근 모달 생성
    function createAccessModal(gptName, deviceType, link) {
        const modal = document.createElement('div');
        modal.className = 'access-modal';
        
        // 고유 ID 생성 (링크 충돌 방지)
        const modalId = 'modal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        modal.id = modalId;
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚀 ${gptName} 사용하기</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${getModalContent(deviceType, link, gptName, modalId)}
                </div>
            </div>
        `;

        // 모달 닫기 이벤트
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        return modal;
    }

    // 디바이스별 모달 콘텐츠
    function getModalContent(deviceType, link, gptName, modalId) {
        if (deviceType === 'mobile') {
            return `
                <div class="device-detection">
                    <div class="device-info">
                        <i class="fas fa-mobile-alt"></i>
                        <p>모바일에서 더 편리하게 사용하세요!</p>
                    </div>
                </div>
                
                <div class="access-options">
                    <div class="option recommended">
                        <div class="option-header">
                            <i class="fas fa-star"></i>
                            <h4>📱 앱에서 사용 (추천)</h4>
                            <span class="badge">BEST</span>
                        </div>
                        <p>더 빠르고 안정적인 사용이 가능해요</p>
                        <div class="steps">
                            <div class="step">
                                <span class="step-num">1</span>
                                <span>ChatGPT 앱 설치</span>
                            </div>
                            <div class="step">
                                <span class="step-num">2</span>
                                <span>앱에서 로그인</span>
                            </div>
                            <div class="step">
                                <span class="step-num">3</span>
                                <span>아래 버튼 클릭!</span>
                            </div>
                        </div>
                        <div class="app-downloads">
                            ${isIOS ? `<a href="https://apps.apple.com/app/openai-chatgpt/id1448169396" class="app-link ios" target="_blank">
                                <i class="fab fa-apple"></i> App Store
                            </a>` : ''}
                            ${isAndroid ? `<a href="https://play.google.com/store/apps/details?id=com.openai.chatgpt" class="app-link android" target="_blank">
                                <i class="fab fa-google-play"></i> Google Play
                            </a>` : ''}
                        </div>
                        <button class="access-btn primary" onclick="tryOpenInApp('${link}', '${modalId}')">
                            <i class="fas fa-mobile-alt"></i> 앱에서 열기
                        </button>
                    </div>
                    
                    <div class="option">
                        <div class="option-header">
                            <i class="fas fa-globe"></i>
                            <h4>🌐 웹에서 사용</h4>
                        </div>
                        <p>브라우저에서 바로 사용 (로그인 필요)</p>
                        <button class="access-btn secondary" onclick="openInWeb('${link}', '${modalId}')">
                            <i class="fas fa-external-link-alt"></i> 웹에서 열기
                        </button>
                    </div>
                </div>
                
                <div class="qr-section">
                    <h4>📱 QR 코드로 빠른 접근</h4>
                    <div class="qr-container">
                        <div class="qr-code" data-url="${link}">
                            <canvas id="qr-${modalId}"></canvas>
                        </div>
                        <p>다른 기기에서 QR 코드를 스캔하세요</p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="device-detection">
                    <div class="device-info">
                        <i class="fas fa-desktop"></i>
                        <p>데스크톱에서 사용 중이시네요!</p>
                    </div>
                </div>
                
                <div class="access-options desktop">
                    <div class="option recommended">
                        <div class="option-header">
                            <i class="fas fa-star"></i>
                            <h4>🌐 웹에서 사용 (추천)</h4>
                            <span class="badge">BEST</span>
                        </div>
                        <p>데스크톱에서는 웹 버전이 가장 편리해요</p>
                        <button class="access-btn primary" onclick="openInWeb('${link}', '${modalId}')">
                            <i class="fas fa-external-link-alt"></i> 웹에서 열기
                        </button>
                    </div>
                    
                    <div class="option">
                        <div class="option-header">
                            <i class="fas fa-mobile-alt"></i>
                            <h4>📱 모바일로 전송</h4>
                        </div>
                        <p>QR 코드로 모바일에서 사용하기</p>
                        <div class="qr-container">
                            <div class="qr-code" data-url="${link}">
                                <canvas id="qr-${modalId}"></canvas>
                            </div>
                            <p>모바일로 스캔해서 사용하세요</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // 앱에서 열기 시도 (수정된 버전)
    window.tryOpenInApp = function(url, modalId) {
        console.log('Opening in app:', url); // 디버깅용
        
        if (isIOS) {
            // iOS 딥링크 시도 - 정확한 URL 사용
            const iOSDeepLink = url.replace('https://chatgpt.com', 'chatgpt:');
            console.log('iOS Deep Link:', iOSDeepLink); // 디버깅용
            
            // 시도 1: 딥링크
            window.location = iOSDeepLink;
            
            // 1.5초 후 앱이 안 열리면 웹으로
            setTimeout(() => {
                window.open(url, '_blank');
            }, 1500);
        } else if (isAndroid) {
            // Android Intent 시도 - 정확한 URL 경로 사용
            const gptPath = url.split('chatgpt.com')[1];
            const androidIntent = `intent://chat${gptPath}#Intent;scheme=chatgpt;package=com.openai.chatgpt;end`;
            console.log('Android Intent:', androidIntent); // 디버깅용
            
            try {
                window.location = androidIntent;
            } catch (e) {
                console.log('Intent failed, opening in web');
                window.open(url, '_blank');
            }
            
            // 1.5초 후 앱이 안 열리면 웹으로
            setTimeout(() => {
                window.open(url, '_blank');
            }, 1500);
        } else {
            // 기타 환경에서는 웹으로
            window.open(url, '_blank');
        }
        
        // 모달 닫기
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
    }

    // 웹에서 열기 (수정된 버전)
    window.openInWeb = function(url, modalId) {
        console.log('Opening in web:', url); // 디버깅용
        window.open(url, '_blank');
        
        // 모달 닫기
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
    }

    // QR 코드 생성 (Google API 사용)
function generateQRCode(text, canvas) {
    console.log('🔄 QR 코드 생성 시작:', text);
    
    // Canvas 대신 img 태그 사용
    const container = canvas.parentElement;
    container.innerHTML = ''; // 기존 canvas 제거
    
    // Google API로 QR 코드 생성
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(text)}`;
    
    const img = document.createElement('img');
    img.src = qrUrl;
    img.alt = 'QR Code for ' + text;
    img.style.width = '120px';
    img.style.height = '120px';
    img.style.border = '1px solid #ddd';
    img.style.borderRadius = '8px';
    
    // 로딩 상태 표시
    img.onload = function() {
        console.log('✅ QR 코드 로드 완료!');
    };
    
    img.onerror = function() {
        console.error('❌ QR 코드 로드 실패');
        // 에러 시 대체 텍스트
        container.innerHTML = `
            <div style="width:120px;height:120px;background:#ff4444;color:white;display:flex;align-items:center;justify-content:center;border-radius:8px;text-align:center;font-size:12px;">
                QR 생성<br>실패
            </div>
        `;
    };
    
    container.appendChild(img);
}

    // QR 코드 초기화
function initQRCodes() {
    document.querySelectorAll('.qr-code').forEach(qrContainer => {
        const url = qrContainer.dataset.url;
        if (url) {
            // 기존 canvas를 임시 div로 교체
            const canvas = qrContainer.querySelector('canvas');
            if (canvas) {
                const tempDiv = document.createElement('div');
                canvas.parentNode.replaceChild(tempDiv, canvas);
                generateQRCode(url, tempDiv);
            }
        }
    });
}
    // 모달이 생성될 때마다 QR 코드 초기화
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const addedModal = Array.from(mutation.addedNodes).find(node => 
                    node.classList && node.classList.contains('access-modal')
                );
                if (addedModal) {
                    setTimeout(initQRCodes, 100);
                }
            }
        });
    });
    observer.observe(document.body, { childList: true });

    // 검색 기능 (기존 코드)
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

        if (visibleCount === 0 && searchTerm !== '') {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }

        if (searchTerm !== '') {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }

    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });

    function clearSearch() {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        noResults.style.display = 'none';
        
        const activeFilter = document.querySelector('.filter-btn.active');
        filterByCategory(activeFilter.getAttribute('data-category'));
    }

    clearSearchBtn.addEventListener('click', clearSearch);

    // 카테고리 필터 기능 (기존 코드)
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

        if (searchInput.value.trim() !== '') {
            performSearch();
        }
    }

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });

    filterByCategory('all');

    // 접근성을 위한 키보드 네비게이션 (기존 코드)
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const firstVisibleItem = document.querySelector('.gpt-item:not([style*="display: none"]) .gpt-link');
            if (firstVisibleItem) {
                firstVisibleItem.focus();
            }
        }
    });

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

    // 스크롤 시 헤더 그림자 효과 (기존 코드)
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-10px)';
            header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 페이지 로드 시 애니메이션 효과 (기존 코드)
    const observer2 = new IntersectionObserver(function(entries) {
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

    gptItems.forEach(function(item, index) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer2.observe(item);
    });

    // 사용자 가이드 표시 (처음 방문자용)
    function showWelcomeGuide() {
        const hasVisited = localStorage.getItem('gpts-visited');
        if (!hasVisited) {
            setTimeout(() => {
                showOnboardingModal();
                localStorage.setItem('gpts-visited', 'true');
            }, 2000);
        }
    }

    function showOnboardingModal() {
        const modal = document.createElement('div');
        modal.className = 'onboarding-modal';
        modal.innerHTML = `
            <div class="modal-content onboarding">
                <div class="modal-header">
                    <h3>🎉 룰루랄라 한기쌤의 GPTs에 오신 것을 환영합니다!</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="welcome-content">
                        <div class="feature">
                            <i class="fas fa-search"></i>
                            <h4>🔍 검색 기능</h4>
                            <p>상단 검색창에서 원하는 GPT를 빠르게 찾아보세요</p>
                        </div>
                        <div class="feature">
                            <i class="fas fa-filter"></i>
                            <h4>🏷️ 카테고리 필터</h4>
                            <p>교육, 토론, 놀이 등 분야별로 정리된 GPT들을 확인하세요</p>
                        </div>
                        <div class="feature">
                            <i class="fas fa-mobile-alt"></i>
                            <h4>📱 스마트 접근</h4>
                            <p>모바일에서는 앱, 데스크톱에서는 웹으로 최적화된 경험을 제공합니다</p>
                        </div>
                    </div>
                    <button class="start-btn" onclick="this.closest('.onboarding-modal').remove()">
                        시작하기 🚀
                    </button>
                </div>
            </div>
        `;

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // 웰컴 가이드 실행
    showWelcomeGuide();

    // FAQ 토글 기능 추가
    window.toggleFAQ = function(element) {
        const faqItem = element.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const icon = element.querySelector('.faq-icon');
        
        if (faqItem.classList.contains('active')) {
            faqItem.classList.remove('active');
            answer.style.maxHeight = '0';
            icon.style.transform = 'rotate(0deg)';
        } else {
            // 다른 FAQ 닫기
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = '0';
                item.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
            });
            
            // 현재 FAQ 열기
            faqItem.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
        }
    }
});
