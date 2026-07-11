// Admin password - change this to your secret code!
const ADMIN_PASSWORD = "mado260805A";

let currentData = {};
let currentFile = "";

document.addEventListener('DOMContentLoaded', async function() {
    // Load all data files
    const dataFiles = ['home', 'about', 'services', 'testimonials', 'contact', 'portfolio', 'video'];
    for (const file of dataFiles) {
        try {
            const response = await fetch(`data/${file}.json`);
            currentData[file] = await response.json();
        } catch (e) {
            console.error(`Error loading ${file}.json:`, e);
        }
    }

    // Render initial content
    renderContent();

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
            const oneHalf = videoSection.querySelector('.one_half');
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
        if (contactOneHalf) {
            contactOneHalf.innerHTML = `
                <p><strong><span style="color: #e64b77;">OKAWE Media.Ghana</span></strong> ${currentData.contact.description}</p>
                <br>
                <p>Email: <a href="mailto:${currentData.contact.email}" style="color: #32db89;">${currentData.contact.email}</a></p>
                <p>Phone/WhatsApp: <a href="tel:${currentData.contact.phone.replace(/\s/g, '')}" style="color: #32db89;">${currentData.contact.phone}</a></p>
                <p>WhatsApp: <a href="https://wa.me/${currentData.contact.whatsapp.replace(/\s/g, '')}" target="_blank" style="color: #32db89;">${currentData.contact.whatsapp}</a></p>
            `;
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
        <div id="json-editor-container">
            <textarea id="json-editor" style="width: 100%; height: 400px; font-family: monospace; font-size: 14px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            <div style="margin-top: 10px;">
                <button id="copy-json" style="padding: 8px 20px; background: #32db89; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Copy JSON</button>
                <span id="copy-status" style="color: #32db89; display: none;">Copied!</span>
            </div>
            <p style="margin-top: 10px; color: #666; font-size: 14px;">After editing, copy the JSON and paste it into the corresponding file on GitHub, then commit the changes.</p>
        </div>
    `;
    content.innerHTML = html;

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

    // Load default file
    document.getElementById('load-file').click();
}
