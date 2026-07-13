// Admin password - change this to your secret code!
const ADMIN_PASSWORD = "mado260805A";

let currentLanguage = localStorage.getItem('okawe-language') || 'en'; // Default to English
let currentData = {};
let currentLangData = {};
let currentFile = "";

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
    
    // Update active button styles
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderContent();
}

document.addEventListener('DOMContentLoaded', async function() {
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
                <p><a href="${branch.facebook}" target="_blank">${branch.name}</a></p>
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

    // File selector
    let html = `
        <div style="margin-bottom: 20px;">
            <label>Select data file to edit:</label>
            <select id="file-select" style="margin-left: 10px; padding: 5px;">
                <option value="home">Home (home.json)</option>
                <option value="about">About (about.json)</option>
                <option value="services">Services (services.json)</option>
                <option value="portfolio">Portfolio (portfolio.json)</option>
                <option value="video">Video & Why Choose Us (video.json)</option>
                <option value="testimonials">Testimonials (testimonials.json)</option>
                <option value="contact">Contact (contact.json)</option>
            </select>
            <button id="load-file" style="margin-left: 10px; padding: 5px 15px;">Load</button>
        </div>
        <div style="margin-bottom: 30px; padding: 20px; border: 1px dashed #ddd; border-radius: 4px;">
            <h3 style="margin-top: 0; margin-bottom: 10px;">Upload Images/Videos</h3>
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                Drag & drop files here, or click to browse. You'll get a base64 string (for small files) or instructions to upload to GitHub.
            </p>
            <div id="drop-zone" style="padding: 30px; text-align: center; border: 2px dashed #aaa; border-radius: 4px; cursor: pointer;">
                <p style="margin: 0;">Drop files here or click to browse</p>
                <input type="file" id="file-input" style="display: none;" multiple accept="image/*,video/*">
            </div>
            <div id="upload-preview" style="margin-top: 15px;"></div>
        </div>
        <div id="json-editor-container">
            <textarea id="json-editor" style="width: 100%; height: 400px; font-family: monospace; font-size: 14px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            <div style="margin-top: 10px;">
                <button id="copy-json" style="padding: 8px 20px; background: #32db89; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Copy JSON</button>
                <button id="save-json" style="padding: 8px 20px; background: #0056d2; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Save JSON</button>
                <span id="copy-status" style="color: #32db89; display: none; margin-right: 10px;">Copied!</span>
                <span id="save-status" style="color: #32db89; display: none;">Saved!</span>
            </div>
            <p style="margin-top: 10px; color: #666; font-size: 14px;">After editing, save the JSON file locally or copy it to paste into GitHub.</p>
        </div>
    `;
    content.innerHTML = html;

    // Set up drag-and-drop
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadPreview = document.getElementById('upload-preview');

    dropZone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.style.borderColor = '#32db89';
            dropZone.style.backgroundColor = '#f0fff5';
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.style.borderColor = '#aaa';
            dropZone.style.backgroundColor = 'transparent';
        });
    });

    dropZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', e => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        uploadPreview.innerHTML = '';
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                const fileUrl = e.target.result;
                const previewDiv = document.createElement('div');
                previewDiv.style.marginBottom = '15px';
                previewDiv.style.padding = '10px';
                previewDiv.style.border = '1px solid #eee';
                previewDiv.style.borderRadius = '4px';

                const previewContent = document.createElement('div');
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = fileUrl;
                    img.style.maxWidth = '200px';
                    img.style.marginBottom = '10px';
                    previewContent.appendChild(img);
                } else if (file.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = fileUrl;
                    video.controls = true;
                    video.style.maxWidth = '400px';
                    video.style.marginBottom = '10px';
                    previewContent.appendChild(video);
                }

                const fileName = document.createElement('p');
                fileName.style.margin = '0 0 10px 0';
                fileName.style.fontWeight = 'bold';
                fileName.textContent = file.name;

                const copyBtn = document.createElement('button');
                copyBtn.textContent = 'Copy Base64';
                copyBtn.style.padding = '6px 12px';
                copyBtn.style.backgroundColor = '#007bff';
                copyBtn.style.color = 'white';
                copyBtn.style.border = 'none';
                copyBtn.style.borderRadius = '4px';
                copyBtn.style.cursor = 'pointer';
                copyBtn.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(fileUrl);
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => copyBtn.textContent = 'Copy Base64', 2000);
                    } catch (err) {
                        alert('Failed to copy base64!');
                    }
                });

                const instructions = document.createElement('p');
                instructions.style.margin = '10px 0 0 0';
                instructions.style.color = '#666';
                instructions.style.fontSize = '13px';
                instructions.innerHTML = `
                    OR: Upload to GitHub's <strong>demo-images/</strong> (images) or <strong>videos/</strong> (videos) folder, then use URL like <code>videos/${file.name}</code> or <code>demo-images/${file.name}</code>
                `;

                previewDiv.appendChild(fileName);
                previewDiv.appendChild(previewContent);
                previewDiv.appendChild(copyBtn);
                previewDiv.appendChild(instructions);
                uploadPreview.appendChild(previewDiv);
            };
            reader.readAsDataURL(file);
        });
    }

    // File selector and load handler
    document.getElementById('load-file').addEventListener('click', function() {
        const file = document.getElementById('file-select').value;
        if (currentData[file]) {
            document.getElementById('json-editor').value = JSON.stringify(currentData[file], null, 2);
            currentFile = file;
        }
    });

    // Copy button handler
    document.getElementById('copy-json').addEventListener('click', async function() {
        const text = document.getElementById('json-editor').value;
        try {
            await navigator.clipboard.writeText(text);
            const status = document.getElementById('copy-status');
            status.style.display = 'inline';
            setTimeout(() => {
                status.style.display = 'none';
            }, 2000);
            
            // Update currentData from edited JSON
            try {
                currentData[currentFile] = JSON.parse(text);
                renderContent();
            } catch (e) {
                alert("Invalid JSON, please check your changes!");
            }
        } catch (e) {
            alert("Failed to copy!");
        }
    });

    document.getElementById('save-json').addEventListener('click', function() {
        const text = document.getElementById('json-editor').value;
        try {
            const json = JSON.parse(text);
            currentData[currentFile] = json;
            renderContent();

            const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentFile || 'data'}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            const status = document.getElementById('save-status');
            if (status) {
                status.style.display = 'inline';
                setTimeout(() => {
                    status.style.display = 'none';
                }, 2000);
            }
        } catch (e) {
            alert("Invalid JSON, please check your changes!");
        }
    });

    // Load default file
    document.getElementById('load-file').click();
}
