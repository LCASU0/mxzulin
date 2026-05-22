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
        primaryPhone: '13752931757',
        secondaryPhone: '13752981786',
        wechatPrimary: '13752931757',
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

    document.querySelectorAll('[data-consult="phone-secondary"]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const phone = companyInfo.secondaryPhone;
            if (isMobile) {
                window.location.href = `tel:${phone}`;
                return;
            }
            copyText(
                phone,
                `电话号码已复制：${phone}`,
                `请手动拨打：${phone}`
            );
        });
    });

    document.querySelectorAll('[data-consult="wechat"]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            scrollToWechat();
            copyText(
                companyInfo.wechatPrimary,
                `手机号已复制：${companyInfo.wechatPrimary}，请打开微信搜索添加好友。`,
                `请手动复制手机号：${companyInfo.wechatPrimary}，然后到微信中搜索添加。`
            );
        });
    });

    document.querySelectorAll('[data-copy-text]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const text = button.getAttribute('data-copy-text');
            const label = button.getAttribute('data-copy-label') || '内容';
            if (!text) {
                return;
            }
            copyText(
                text,
                `${label}已复制：${text}`,
                `请手动复制${label}：${text}`
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
