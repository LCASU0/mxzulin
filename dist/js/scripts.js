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

    const plannerForm = document.querySelector('#liftingPlannerForm');
    const plannerResult = document.querySelector('#liftingResult');
    const plannerSubmitButton = document.querySelector('#generateLiftingSuggestion');
    if (plannerForm && plannerResult) {
        const craneOptions = [
            { ton: 25, type: 'truck', label: '25吨汽车式起重机' },
            { ton: 55, type: 'truck', label: '55吨汽车式起重机' },
            { ton: 75, type: 'truck', label: '75吨汽车式起重机' },
            { ton: 100, type: 'truck', label: '100吨汽车式起重机' },
            { ton: 135, type: 'truck', label: '135吨汽车式起重机' },
            { ton: 150, type: 'truck', label: '150吨汽车式起重机' },
            { ton: 200, type: 'truck', label: '200吨汽车式起重机' },
            { ton: 280, type: 'truck', label: '280吨汽车式起重机' },
            { ton: 320, type: 'truck', label: '320吨汽车式起重机' },
            { ton: 400, type: 'truck', label: '400吨汽车式起重机' },
            { ton: 500, type: 'truck', label: '500吨汽车式起重机' },
            { ton: 25, type: 'crawler', label: '25吨伸缩臂履带式起重机' },
            { ton: 55, type: 'crawler', label: '55吨履带式起重机' },
            { ton: 75, type: 'crawler', label: '75吨履带式起重机' },
            { ton: 100, type: 'crawler', label: '100吨履带式起重机' },
            { ton: 135, type: 'crawler', label: '135吨履带式起重机' },
            { ton: 150, type: 'crawler', label: '150吨履带式起重机' },
            { ton: 200, type: 'crawler', label: '200吨履带式起重机' },
            { ton: 280, type: 'crawler', label: '280吨履带式起重机' },
            { ton: 320, type: 'crawler', label: '320吨履带式起重机' },
            { ton: 400, type: 'crawler', label: '400吨履带式起重机' },
            { ton: 500, type: 'crawler', label: '500吨履带式起重机' }
        ];
        const conditionLabels = {
            normal: '场地较平整，站位空间正常',
            limited: '站位受限或有障碍物',
            rough: '地面承载不确定/工况复杂',
            long: '长距离或高空作业偏多'
        };
        const typeLabels = {
            auto: '自动判断',
            truck: '汽车式起重机',
            crawler: '履带式起重机'
        };
        const getNumber = (selector) => Number.parseFloat(document.querySelector(selector).value);
        const getRadiusFactor = (radius) => {
            if (radius <= 5) return 1.3;
            if (radius <= 8) return 1.7;
            if (radius <= 12) return 2.2;
            if (radius <= 16) return 3;
            if (radius <= 20) return 4.2;
            if (radius <= 26) return 5.6;
            return 7;
        };
        const getHeightFactor = (height) => {
            if (height <= 12) return 1;
            if (height <= 20) return 1.1;
            if (height <= 30) return 1.25;
            if (height <= 40) return 1.45;
            return 1.7;
        };
        const conditionFactors = {
            normal: 1,
            limited: 1.15,
            rough: 1.25,
            long: 1.35
        };
        const roundToFive = (value) => Math.ceil(value / 5) * 5;
        const formatNumber = (value) => Number.isInteger(value) ? `${value}` : `${value.toFixed(1)}`;

        const generatePlannerSuggestion = (event) => {
            event.preventDefault();
            if (typeof plannerForm.reportValidity === 'function' && !plannerForm.reportValidity()) {
                return;
            }
            const load = getNumber('#liftLoad');
            const height = getNumber('#liftHeight');
            const radius = getNumber('#liftRadius');
            const condition = document.querySelector('#liftCondition').value;
            const preferredInput = document.querySelector('#liftType').value;
            const notes = document.querySelector('#liftNotes').value.trim();

            if (!load || !height || !radius || load <= 0 || height <= 0 || radius <= 0) {
                showToast('请先填写有效的吊重、高度和距离。');
                return;
            }

            const baseClass = load * getRadiusFactor(radius) * getHeightFactor(height) * conditionFactors[condition];
            const suggestedTon = roundToFive(baseClass);
            const preferredType = preferredInput === 'auto'
                ? ((radius >= 16 || height >= 32 || condition === 'rough') ? 'crawler' : 'truck')
                : preferredInput;
            const sameTypeOptions = craneOptions.filter((item) => item.type === preferredType);
            const otherTypeOptions = craneOptions.filter((item) => item.type !== preferredType);
            const primary = sameTypeOptions.find((item) => item.ton >= suggestedTon) || sameTypeOptions[sameTypeOptions.length - 1];
            const backup = sameTypeOptions.find((item) => item.ton > primary.ton);
            const alternative = otherTypeOptions.find((item) => item.ton >= suggestedTon);
            const overRange = suggestedTon > 500;
            const primaryText = overRange ? '500吨级以上或专项方案复核' : primary.label;
            const backupText = overRange
                ? '建议电话沟通大型设备和专项吊装方案'
                : [backup && backup.label, alternative && alternative.label].filter(Boolean).slice(0, 2).join(' / ');
            const planText = [
                '吊装初步选型咨询：',
                `吊装物重量：${formatNumber(load)}吨`,
                `作业高度：${formatNumber(height)}米`,
                `作业半径/距离：${formatNumber(radius)}米`,
                `现场条件：${conditionLabels[condition]}`,
                `倾向设备：${typeLabels[preferredInput]}`,
                `页面初步建议：${primaryText}`,
                backupText ? `备选沟通：${backupText}` : '',
                notes ? `补充信息：${notes}` : '',
                '请帮忙结合现场站位、地基、索具、工况表和安全要求复核吨位及吊装方案。'
            ].filter(Boolean).join('\n');

            plannerResult.classList.add('has-result');
            plannerResult.innerHTML = `
                <div class="result-label">初步建议</div>
                <h3>${primaryText}</h3>
                <p>估算沟通级别：${overRange ? '超过500吨级' : `${suggestedTon}吨级以上`}。实际起重量会随作业半径、臂长、配重、站位和地基条件变化。</p>
                ${backupText ? `<p><strong>备选沟通：</strong>${backupText}</p>` : ''}
                <ul class="result-checklist">
                    <li>吊重需包含吊具、索具、吊钩和可能的动载影响。</li>
                    <li>作业半径越大，实际可吊重量下降越明显。</li>
                    <li>正式方案需按具体车型工况表和现场条件复核。</li>
                </ul>
                <label class="form-label" for="copyPlanText">可复制给经理的需求说明</label>
                <textarea id="copyPlanText" class="form-control result-copy" rows="8" readonly></textarea>
                <div class="result-actions">
                    <button class="btn btn-primary" type="button" data-copy-plan>复制需求</button>
                    <a class="btn btn-outline-secondary" href="tel:${companyInfo.primaryPhone}" data-consult="phone">电话复核</a>
                </div>
            `;
            const copyArea = plannerResult.querySelector('#copyPlanText');
            copyArea.value = planText;
            const copyButton = plannerResult.querySelector('[data-copy-plan]');
            copyButton.addEventListener('click', () => {
                copyText(planText, '吊装需求已复制，可直接发给经理。', '请手动复制需求说明。');
            });
            const phoneButton = plannerResult.querySelector('[data-consult="phone"]');
            phoneButton.addEventListener('click', (phoneEvent) => {
                phoneEvent.preventDefault();
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
        };

        plannerForm.addEventListener('submit', generatePlannerSuggestion);
        plannerForm.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.target.matches('input, select')) {
                generatePlannerSuggestion(event);
            }
        });
        if (plannerSubmitButton) {
            plannerSubmitButton.addEventListener('click', generatePlannerSuggestion);
        }
    }

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
