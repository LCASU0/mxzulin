/*!
* Start Bootstrap - 重庆敏祥吊装租赁责任有限公司官网 v7.0.12 ()
* Copyright 2013-2026 重庆敏祥吊装租赁责任有限公司
* Licensed under MIT (https://github.com/StartBootstrap/chongqing-minxiang-crane-rental/blob/master/LICENSE)
*/
/*!
* 重庆敏祥吊装租赁责任有限公司
*/

window.addEventListener('DOMContentLoaded', () => {
    const companyInfo = window.companyInfo || {
        primaryPhone: '13759231757',
        secondaryPhone: '13752981786',
        wechatPrimary: '13759231757',
        wechatNote: '微信电话同号',
        qrcode: 'assets/img/contact/wechat-qrcode.jpg'
    };
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const toast = document.querySelector('#consultToast');

    const showToast = (message) => {
        if (!toast) {
            return;
        }
        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    };

    const copyText = async (text, successMessage, fallbackMessage) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast(successMessage);
        } catch (error) {
            showToast(fallbackMessage);
        }
    };

    const scrollToWechat = () => {
        const qrcode = document.querySelector('#wechat-qrcode');
        if (qrcode) {
            qrcode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            window.location.hash = '#contact';
        }
        showToast(`长按识别二维码添加微信，${companyInfo.wechatNote}。`);
    };

    document.querySelectorAll('[data-consult="phone"]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (isMobile) {
                window.location.href = `tel:${companyInfo.primaryPhone}`;
                return;
            }
            copyText(
                companyInfo.primaryPhone,
                `电话号码已复制：${companyInfo.primaryPhone}`,
                `请手动拨打：${companyInfo.primaryPhone}`
            );
        });
    });

    document.querySelectorAll('[data-consult="wechat"]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (isMobile) {
                scrollToWechat();
                return;
            }
            copyText(
                companyInfo.wechatPrimary,
                `微信号已复制：${companyInfo.wechatPrimary}`,
                `请手动添加微信：${companyInfo.wechatPrimary}`
            );
        });
    });

    const navbarShrink = () => {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav && window.bootstrap) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.forEach((responsiveNavItem) => {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});
