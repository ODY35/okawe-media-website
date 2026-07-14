// Admin password - change this to your secret code!
const ADMIN_PASSWORD = "mado260805A";

let currentLanguage = localStorage.getItem('okawe-language') || 'en'; // Default to English
let currentData = {};
let currentLangData = {};
let currentFile = "home";
let pendingAsset = null;

function getStorageKey(lang, file) {
    return `okawe-admin-${lang}-${file}`;
}

function mergeDeep(target, source) {
    if (!source || typeof source !== 'object') return target;
    if (Array.isArray(source)) {
        return source.map((item, index) => mergeDeep(Array.isArray(target) ? target[index] : undefined, item));
    }
    const output = { ...(target || {}) };
    Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            output[key] = mergeDeep(output[key], source[key]);
        } else {
            output[key] = source[key];
        }
    });
    return output;
}

function applySavedOverrides(lang) {
    const dataFiles = ['home', 'about', 'services', 'testimonials', 'contact', 'portfolio', 'video', 'language'];
    dataFiles.forEach(file => {
        const storageKey = getStorageKey(lang, file);
        const savedValue = localStorage.getItem(storageKey);
        if (!savedValue) return;

        try {
            const parsed = JSON.parse(savedValue);
            if (file === 'language') {
                currentLangData = mergeDeep(currentLangData, parsed);
            } else {
                currentData[file] = mergeDeep(currentData[file], parsed);
            }
        } catch (error) {
            console.error(`Unable to parse saved override for ${file}`, error);
        }
    });
}

function updateLanguageButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });
}

function setDocumentLanguage(lang) {
    document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';
}

// Helper to get nested value from object using dot notation
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

async function loadLanguageData(lang) {
    const dataFiles = ['home', 'about', 'services', 'testimonials', 'contact', 'portfolio', 'video', 'language'];
    currentData = {};
    currentLangData = {};
    
    for (const file of dataFiles) {
        try {
            const response = await fetch(`data/${lang}/${file}.json`);
            if (file === 'language') {
                currentLangData = await response.json();
            } else {
                currentData[file] = await response.json();
            }
        } catch (e) {
            console.error(`Error loading ${lang}/${file}.json:`, e);
            // Fallback to English if we can't load the requested language
            try {
                const fallbackResponse = await fetch(`data/en/${file}.json`);
                if (file === 'language') {
                    currentLangData = await fallbackResponse.json();
                } else {
                    currentData[file] = await fallbackResponse.json();
                }
            } catch (fe) {
                console.error(`Error loading en/${file}.json as fallback:`, fe);
            }
        }
    }

    applySavedOverrides(lang);
    
    updateLanguageButtons(lang);
    setDocumentLanguage(lang);
    
    renderContent();
}

document.addEventListener('DOMContentLoaded', async function() {
    setDocumentLanguage(currentLanguage);
    updateLanguageButtons(currentLanguage);

    // Load initial language data
    await loadLanguageData(currentLanguage);

    // Language switch button handlers
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const newLang = this.dataset.lang;
            if (newLang !== currentLanguage) {
                currentLanguage = newLang;
                localStorage.setItem('okawe-language', currentLanguage);
                await loadLanguageData(currentLanguage);
            }
        });
    });

    // Admin entry click handler
    const adminEntry = document.getElementById('admin-entry');
    if (adminEntry) {
        adminEntry.addEventListener('click', function() {
            const modal = document.getElementById('admin-modal');
            const passwordPrompt = document.getElementById('password-prompt');
            const adminContent = document.getElementById('admin-content');
            passwordPrompt.style.display = 'block';
            adminContent.innerHTML = '';
            modal.style.display = 'block';
        });
    }

    // Password submit handler
    const submitPassword = document.getElementById('submit-password');
    if (submitPassword) {
        submitPassword.addEventListener('click', function() {
            const input = document.getElementById('admin-password');
            const error = document.getElementById('password-error');
            if (input.value === ADMIN_PASSWORD) {
                input.value = '';
                error.style.display = 'none';
                openAdminPanel();
            } else {
                error.style.display = 'block';
            }
        });
    }

    // Admin modal close
    const adminClose = document.getElementById('admin-close');
    if (adminClose) {
        adminClose.addEventListener('click', function() {
            document.getElementById('admin-modal').style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('admin-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function applyUploadedAssetToJson(payload, asset) {
    if (!payload || typeof payload !== 'object') return payload;

    if (currentFile === 'home') {
        if (asset.type.startsWith('video/')) {
            payload.video = asset.dataUrl;
        } else {
            payload.image = asset.dataUrl;
        }
        return payload;
    }

    if (currentFile === 'services' && payload.slides) {
        const firstSlide = Array.isArray(payload.slides[0]) ? payload.slides[0][0] : payload.slides[0];
        if (firstSlide) {
            firstSlide.icon = asset.dataUrl;
        }
        return payload;
    }

    if (currentFile === 'video') {
        if (asset.type.startsWith('video/')) {
            payload.videoUrl = asset.dataUrl;
        } else {
            payload.thumbnail = asset.dataUrl;
        }
        return payload;
    }

    if (currentFile === 'portfolio' && Array.isArray(payload)) {
        payload[0] = { ...(payload[0] || {}), image: asset.dataUrl };
        return payload;
    }

    if (currentFile === 'about') {
        if (asset.type.startsWith('video/')) {
            payload.video = asset.dataUrl;
        } else {
            payload.image = asset.dataUrl;
        }
        return payload;
    }

    return payload;
}

function renderContent() {
    // First, render all language-specific UI elements (data-i18n attributes)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const value = getNestedValue(currentLangData, key);
        if (value) {
            el.textContent = value;
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        const value = getNestedValue(currentLangData, key);
        if (value) {
            el.placeholder = value;
        }
    });
    
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
        const key = el.dataset.i18nValue;
        const value = getNestedValue(currentLangData, key);
        if (value) {
            el.value = value;
        }
    });
    
    // Home content
    if (currentData.home) {
        const homeTitle = document.querySelector('.big-title');
        const homeSubtitle = document.querySelector('.title-desc');
        const heroVideo = document.querySelector('.hero-video source');
        if (homeTitle) homeTitle.textContent = currentData.home.title;
        if (homeSubtitle) homeSubtitle.textContent = currentData.home.subtitle;
        if (heroVideo) heroVideo.src = currentData.home.video;
    }

    // About content
    if (currentData.about) {
        const aboutDesc = document.querySelector('#about .one_half');
        if (aboutDesc) aboutDesc.textContent = currentData.about.description;
        
        const teamSlider = document.querySelector('#team1');
        if (teamSlider && currentData.about.team.length > 0) {
            teamSlider.innerHTML = currentData.about.team.map(member => `
                <li>
                    <div class="member-content-holder">
                        <h4 class="member-name">${member.name}</h4>
                        <p class="member-position">${member.position}</p>
                        <div class="member-content">
                            ${member.bio.replace(/\n/g, '<br>')}<br>
                        </div>
                    </div>
                    <div class="member-image-holder">
                        <img src="demo-images/about_img_01.jpg" alt="">
                    </div>
                    <div class="clear"></div>
                </li>
            `).join('');
        }
    }

    // Services content
    if (currentData.services && currentData.services.slides) {
        const services = currentData.services.slides.flat();
        const serviceHolders = document.querySelectorAll('.service-holder');
        serviceHolders.forEach((holder, index) => {
            const service = services[index];
            if (service) {
                const img = holder.querySelector('img');
                const titleEl = holder.querySelector('.service-title');
                const contentEl = holder.querySelector('.service-content');
                if (img && service.icon) img.src = service.icon;
                if (titleEl) titleEl.textContent = service.title;
                if (contentEl) contentEl.textContent = service.description;
            }
        });
    } else {
        const fallbackServices = currentLanguage === 'fr' ? [
            { title: 'MARKETING VIDÉO', description: 'Grâce au marketing vidéo, votre entreprise augmente sa portée, développe ses revenus et élargit sa clientèle.' },
            { title: 'MARKETING DES RÉSEAUX SOCIAUX', description: 'Nous créons des contenus adaptés à chaque plateforme pour renforcer votre présence en ligne.' },
            { title: 'WEB', description: 'Nous concevons des sites web professionnels pour présenter votre entreprise et attirer de nouveaux clients.' },
            { title: 'SEO ON PAGE ET OFF PAGE', description: 'Nous optimisons votre visibilité sur Google grâce à une stratégie SEO complète et efficace.' }
        ] : [
            { title: 'VIDEO MARKETING', description: 'We help your business grow with clear, engaging video campaigns that reach the right audience.' },
            { title: 'SOCIAL MEDIA MARKETING', description: 'We create tailored social content that strengthens your brand and keeps your audience engaged.' },
            { title: 'WEB', description: 'We build professional websites that present your business and attract new customers.' },
            { title: 'SEO ON AND OFF PAGE', description: 'We improve your online visibility with a complete SEO strategy that drives better results.' }
        ];

        const serviceHolders = document.querySelectorAll('.service-holder');
        serviceHolders.forEach((holder, index) => {
            const service = fallbackServices[index];
            if (service) {
                const titleEl = holder.querySelector('.service-title');
                const contentEl = holder.querySelector('.service-content');
                if (titleEl) titleEl.textContent = service.title;
                if (contentEl) contentEl.textContent = service.description;
            }
        });
    }

    // Portfolio
    if (currentData.portfolio) {
        const portfolioContainer = document.getElementById('portfolio-container');
        if (portfolioContainer) {
            portfolioContainer.innerHTML = currentData.portfolio.map((item, index) => `
                <article class="relative blog-item-holder center-relative">
                    <div class="num">${String(index + 1).padStart(2, '0')}</div>
                    <div class="info">
                        <div class="author vcard ">OKAWE MEDIA</div>
                        <div class="cat-links">
                            <ul>
                                <li><a href="#">${item.category}</a></li>
                            </ul>
                        </div>
                    </div>
                    <h3 class="entry-title">
                        <a href="${item.url}">${item.title}</a>
                    </h3>
                    <div class="clear"></div>
                </article>
            `).join('');
        }
    }

    // Video
    if (currentData.video) {
        const videoSection = document.querySelector('#video');
        if (videoSection) {
            const sectionTitle = videoSection.querySelector('.entry-title');
            const oneHalf = videoSection.querySelector('[data-video-description]');
            const oneHalfLast = videoSection.querySelector('.one_half.last');
            const videoPopup = videoSection.querySelector('.video-popup-holder');

            if (sectionTitle) sectionTitle.textContent = currentData.video.title;
            if (oneHalf) oneHalf.textContent = currentData.video.description;
            if (oneHalfLast) {
                oneHalfLast.innerHTML = currentData.video.strengths.map(strength => 
                    `<span style="color: #FFBA42;"><strong>${strength.split(' — ')[0]}</strong></span> — ${strength.split(' — ')[1]}<br>`
                ).join('');
            }
            if (videoPopup) {
                videoPopup.href = currentData.video.videoUrl;
                const thumbImg = videoPopup.querySelector('.thumb');
                if (thumbImg) thumbImg.src = currentData.video.thumbnail;
            }
        }
    }

    // Testimonials
    if (currentData.testimonials) {
        const testimonialSlider = document.querySelector('#text1');
        if (testimonialSlider) {
            testimonialSlider.innerHTML = currentData.testimonials.map(t => `
                <li>
                    <div class="testimonial-content">
                        <p class="testimonial-text">${t.text}</p>
                        <p class="testimonial-author">${t.author}</p>
                    </div>
                    <div class="clear">
                    </div>
                </li>
            `).join('');
        }
    }

    // Contact
    if (currentData.contact) {
        const contactOneHalf = document.querySelector('#contact .one_half');
        const branchesContainer = document.getElementById('branches-container');
        
        if (contactOneHalf) {
            contactOneHalf.innerHTML = `
                <p><strong><span style="color: #e64b77;">OKAWE Media.Ghana</span></strong> ${currentData.contact.description}</p>
                <br>
                <p>Email: <a href="mailto:${currentData.contact.email}" style="color: #32db89;">${currentData.contact.email}</a></p>
                <p>Phone/WhatsApp: <a href="tel:${currentData.contact.phone.replace(/\s/g, '')}" style="color: #32db89;">${currentData.contact.phone}</a></p>
                <p>WhatsApp: <a href="https://wa.me/${currentData.contact.whatsapp.replace(/\s/g, '')}" target="_blank" style="color: #32db89;">${currentData.contact.whatsapp}</a></p>
                <br>
                <div id="branches-container"></div>
            `;
        }
        
        // Render branches
        if (branchesContainer && currentData.contact.branches) {
            branchesContainer.innerHTML = currentData.contact.branches.map(branch => `
                <p><strong style="color: #55B286;">${branch.name}</strong>: <a href="${branch.facebook}" target="_blank" style="color: #32db89;"><span class="fa fa-facebook"></span> Facebook</a></p>
            `).join('');
        }
        const footerBranches = document.getElementById('footer-branches');
        if (footerBranches && currentData.contact.branches) {
            footerBranches.innerHTML = currentData.contact.branches.map(branch => `
                <span class="footer-branch-item"><a href="${branch.facebook}" target="_blank">${branch.name}</a></span>
            `).join('');
        }
    }
}

function openAdminPanel() {
    const modal = document.getElementById('admin-modal');
    const content = document.getElementById('admin-content');
    const passwordPrompt = document.getElementById('password-prompt');
    passwordPrompt.style.display = 'none';
    modal.style.display = 'block';

    const editorHtml = `
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: end;">
                <label style="font-weight: 700;">Section
                    <select id="section-select" style="display: block; margin-top: 6px; padding: 8px 10px; min-width: 220px; border: 1px solid #ddd; border-radius: 6px;">
                        <option value="home">Home</option>
                        <option value="about">About</option>
                        <option value="services">Services</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="video">Video</option>
                        <option value="testimonials">Testimonials</option>
                        <option value="contact">Contact</option>
                    </select>
                </label>
                <button id="load-section" style="padding: 8px 16px; background: #0056d2; color: white; border: none; border-radius: 6px; cursor: pointer;">Load section</button>
            </div>

            <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; background: #f9fafb;">
                <h3 style="margin: 0 0 8px; font-size: 16px;">Content fields</h3>
                <div id="editor-fields" style="display: grid; gap: 12px;"></div>
            </div>

            <div style="padding: 16px; border: 1px dashed #cbd5e1; border-radius: 10px; background: #fcfdff;">
                <h3 style="margin: 0 0 8px; font-size: 16px;">Upload image or video</h3>
                <p style="margin: 0 0 10px; color: #666; font-size: 13px;">Drop a file here or click to browse. It will be attached to the selected section after you save.</p>
                <div id="drop-zone" style="padding: 24px; text-align: center; border: 2px dashed #aaa; border-radius: 8px; cursor: pointer; background: white;">
                    <p style="margin: 0;">Drop image or video here</p>
                    <input type="file" id="file-input" style="display: none;" accept="image/*,video/*">
                </div>
                <div id="upload-preview" style="margin-top: 12px;"></div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                <button id="save-section" style="padding: 10px 18px; background: #32db89; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 700;">Save & apply</button>
                <span id="save-status" style="color: #32db89; display: none; font-weight: 700;">Saved and applied!</span>
            </div>
        </div>
    `;
    content.innerHTML = editorHtml;

    const fieldsContainer = document.getElementById('editor-fields');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadPreview = document.getElementById('upload-preview');
    const sectionSelect = document.getElementById('section-select');

    function buildField(label, key, type = 'text', value = '') {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'grid';
        wrapper.style.gap = '6px';

        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.fontWeight = '600';
        labelEl.style.fontSize = '14px';

        let input;
        if (type === 'textarea') {
            input = document.createElement('textarea');
            input.style.minHeight = '90px';
        } else {
            input = document.createElement('input');
            input.type = type;
        }
        input.style.padding = '8px 10px';
        input.style.border = '1px solid #ddd';
        input.style.borderRadius = '6px';
        input.value = value || '';
        input.dataset.fieldKey = key;

        wrapper.appendChild(labelEl);
        wrapper.appendChild(input);
        return wrapper;
    }

    function renderFields(section) {
        const sectionData = currentData[section] || {};
        const fields = [];
        if (section === 'home') {
            fields.push(buildField('Hero title', 'title', 'text', sectionData.title));
            fields.push(buildField('Hero subtitle', 'subtitle', 'text', sectionData.subtitle));
            fields.push(buildField('Hero video URL', 'video', 'text', sectionData.video));
        } else if (section === 'about') {
            fields.push(buildField('About description', 'description', 'textarea', sectionData.description));
            fields.push(buildField('Team member name', 'teamName', 'text', sectionData.team && sectionData.team[0] ? sectionData.team[0].name : ''));
            fields.push(buildField('Team member bio', 'teamBio', 'textarea', sectionData.team && sectionData.team[0] ? sectionData.team[0].bio : ''));
        } else if (section === 'services') {
            fields.push(buildField('Service title', 'title', 'text', sectionData.slides && sectionData.slides[0] && sectionData.slides[0][0] ? sectionData.slides[0][0].title : ''));
            fields.push(buildField('Service description', 'description', 'textarea', sectionData.slides && sectionData.slides[0] && sectionData.slides[0][0] ? sectionData.slides[0][0].description : ''));
        } else if (section === 'portfolio') {
            fields.push(buildField('Portfolio title', 'title', 'text', Array.isArray(sectionData) && sectionData[0] ? sectionData[0].title : ''));
            fields.push(buildField('Portfolio category', 'category', 'text', Array.isArray(sectionData) && sectionData[0] ? sectionData[0].category : ''));
            fields.push(buildField('Portfolio URL', 'url', 'text', Array.isArray(sectionData) && sectionData[0] ? sectionData[0].url : ''));
        } else if (section === 'video') {
            fields.push(buildField('Video title', 'title', 'text', sectionData.title));
            fields.push(buildField('Video description', 'description', 'textarea', sectionData.description));
            fields.push(buildField('Video URL', 'videoUrl', 'text', sectionData.videoUrl));
        } else if (section === 'testimonials') {
            fields.push(buildField('Testimonial text', 'text', 'textarea', Array.isArray(sectionData) && sectionData[0] ? sectionData[0].text : ''));
            fields.push(buildField('Testimonial author', 'author', 'text', Array.isArray(sectionData) && sectionData[0] ? sectionData[0].author : ''));
        } else if (section === 'contact') {
            fields.push(buildField('Contact description', 'description', 'textarea', sectionData.description));
            fields.push(buildField('Contact email', 'email', 'text', sectionData.email));
            fields.push(buildField('Contact phone', 'phone', 'text', sectionData.phone));
            fields.push(buildField('WhatsApp', 'whatsapp', 'text', sectionData.whatsapp));
        }

        fieldsContainer.innerHTML = '';
        fields.forEach(field => fieldsContainer.appendChild(field));
    }

    function handleFiles(files) {
        uploadPreview.innerHTML = '';
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                const fileUrl = e.target.result;
                const previewDiv = document.createElement('div');
                previewDiv.style.marginBottom = '12px';
                previewDiv.style.padding = '10px';
                previewDiv.style.border = '1px solid #eee';
                previewDiv.style.borderRadius = '6px';
                previewDiv.style.background = '#fff';

                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = fileUrl;
                    img.style.maxWidth = '180px';
                    img.style.marginBottom = '8px';
                    previewDiv.appendChild(img);
                } else if (file.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = fileUrl;
                    video.controls = true;
                    video.style.maxWidth = '260px';
                    video.style.marginBottom = '8px';
                    previewDiv.appendChild(video);
                }

                const label = document.createElement('p');
                label.style.margin = '0';
                label.style.fontWeight = '700';
                label.textContent = file.name;
                previewDiv.appendChild(label);
                uploadPreview.appendChild(previewDiv);
                pendingAsset = { name: file.name, type: file.type, dataUrl: fileUrl };
            };
            reader.readAsDataURL(file);
        });
    }

    dropZone.addEventListener('click', () => fileInput.click());
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    fileInput.addEventListener('change', e => handleFiles(e.target.files));
    dropZone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));

    document.getElementById('load-section').addEventListener('click', function() {
        currentFile = sectionSelect.value;
        renderFields(currentFile);
    });

    document.getElementById('save-section').addEventListener('click', function() {
        const section = currentFile || sectionSelect.value;
        const payload = JSON.parse(JSON.stringify(currentData[section] || {}));
        const inputs = fieldsContainer.querySelectorAll('[data-field-key]');
        const newValues = {};
        inputs.forEach(input => {
            newValues[input.dataset.fieldKey] = input.value;
        });

        if (section === 'home') {
            payload.title = newValues.title;
            payload.subtitle = newValues.subtitle;
            payload.video = newValues.video;
        } else if (section === 'about') {
            payload.description = newValues.description;
            payload.team = [{ name: newValues.teamName, position: 'Team Member', bio: newValues.teamBio, image: 'demo-images/about_img_01.jpg' }];
        } else if (section === 'services') {
            payload.slides = payload.slides || [[{}]];
            payload.slides[0][0] = { ...(payload.slides[0][0] || {}), title: newValues.title, description: newValues.description };
        } else if (section === 'portfolio') {
            payload[0] = { ...(Array.isArray(payload) && payload[0] ? payload[0] : {}), title: newValues.title, category: newValues.category, url: newValues.url };
        } else if (section === 'video') {
            payload.title = newValues.title;
            payload.description = newValues.description;
            payload.videoUrl = newValues.videoUrl;
        } else if (section === 'testimonials') {
            payload[0] = { ...(Array.isArray(payload) && payload[0] ? payload[0] : {}), text: newValues.text, author: newValues.author };
        } else if (section === 'contact') {
            payload.description = newValues.description;
            payload.email = newValues.email;
            payload.phone = newValues.phone;
            payload.whatsapp = newValues.whatsapp;
        }

        if (pendingAsset) {
            applyUploadedAssetToJson(payload, pendingAsset);
        }

        currentData[section] = payload;
        localStorage.setItem(getStorageKey(currentLanguage, section), JSON.stringify(payload));
        renderContent();

        const status = document.getElementById('save-status');
        status.style.display = 'inline';
        setTimeout(() => { status.style.display = 'none'; }, 2500);
    });

    sectionSelect.value = currentFile || 'home';
    renderFields(currentFile || 'home');
}
