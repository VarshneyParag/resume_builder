/* ==========================================================================
   ResumeCraft — Main JavaScript
   Dynamic form management, live preview, validation, and micro-interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initFlashMessages();
    initDynamicSections();
    initSkillsInput();
    initPhotoUpload();
    initLivePreview();
    initFormValidation();
    initStepperNavigation();
    initMicroInteractions();
    initDashboardSearch();
    initAuthTabs();
    initAutoSave();
    initScrollAnimations();
    initHeaderDropdowns();
    initCustomModals();
    initAIWriter();
    initEditorDownloadButton();
});


/* ---- Flash Messages ---- */
function initFlashMessages() {
    document.querySelectorAll('.flash-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.closest('.flash-message');
            msg.style.opacity = '0';
            msg.style.transform = 'translateX(100px)';
            setTimeout(() => msg.remove(), 300);
        });
    });

    // Auto-dismiss after 5 seconds
    document.querySelectorAll('.flash-message').forEach(msg => {
        setTimeout(() => {
            if (msg.parentElement) {
                msg.style.opacity = '0';
                msg.style.transform = 'translateX(100px)';
                setTimeout(() => msg.remove(), 300);
            }
        }, 5000);
    });
}


/* ---- Dynamic Sections (Education, Experience, Projects) ---- */
function initDynamicSections() {
    // Education
    const addEduBtn = document.getElementById('add-education');
    if (addEduBtn) {
        addEduBtn.addEventListener('click', () => {
            addDynamicEntry('education-list', createEducationEntry());
        });
    }

    // Work Experience
    const addExpBtn = document.getElementById('add-experience');
    if (addExpBtn) {
        addExpBtn.addEventListener('click', () => {
            addDynamicEntry('experience-list', createExperienceEntry());
        });
    }

    // Projects
    const addProjBtn = document.getElementById('add-project');
    if (addProjBtn) {
        addProjBtn.addEventListener('click', () => {
            addDynamicEntry('projects-list', createProjectEntry());
        });
    }

    // Attach remove handlers to existing entries
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', () => removeEntry(btn));
    });
}

function addDynamicEntry(containerId, html) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const entry = wrapper.firstElementChild;
    container.appendChild(entry);

    // Attach remove handler
    const removeBtn = entry.querySelector('.btn-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => removeEntry(removeBtn));
    }

    // Trigger animation
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
        entry.style.transition = 'all 300ms ease-out';
        entry.style.opacity = '1';
        entry.style.transform = 'translateY(0)';
    });

    updatePreview();
    reindexEntries(containerId);
}

function removeEntry(btn) {
    const entry = btn.closest('.dynamic-entry');
    if (!entry) return;

    entry.style.transition = 'all 250ms ease-in';
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(-10px)';
    entry.style.maxHeight = entry.scrollHeight + 'px';

    setTimeout(() => {
        entry.style.maxHeight = '0';
        entry.style.padding = '0';
        entry.style.margin = '0';
        entry.style.overflow = 'hidden';
    }, 200);

    setTimeout(() => {
        const container = entry.parentElement;
        entry.remove();
        if (container) reindexEntries(container.id);
        updatePreview();
    }, 400);
}

function reindexEntries(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const entries = container.querySelectorAll('.dynamic-entry');
    entries.forEach((entry, idx) => {
        entry.querySelectorAll('input, textarea, select').forEach(input => {
            const name = input.getAttribute('name');
            if (name) {
                input.setAttribute('name', name.replace(/\[\d+\]/, `[${idx}]`));
            }
        });
        const header = entry.querySelector('.entry-index');
        if (header) header.textContent = `#${idx + 1}`;
    });
}

function createEducationEntry() {
    const idx = document.querySelectorAll('#education-list .dynamic-entry').length;
    return `
        <div class="dynamic-entry">
            <button type="button" class="btn-remove" title="Remove">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="dynamic-entry-header">
                <span class="text-label-md" style="color: var(--primary)">Education <span class="entry-index">#${idx + 1}</span></span>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Degree</label>
                    <input type="text" name="education[${idx}][degree]" class="form-input" placeholder="e.g. B.Tech in Computer Science">
                </div>
                <div class="form-group">
                    <label class="form-label">Institution</label>
                    <input type="text" name="education[${idx}][institution]" class="form-input" placeholder="University name">
                </div>
                <div class="form-group">
                    <label class="form-label">Year</label>
                    <input type="text" name="education[${idx}][year]" class="form-input" placeholder="e.g. 2020-2024">
                </div>
                <div class="form-group">
                    <label class="form-label">Percentage / CGPA</label>
                    <input type="text" name="education[${idx}][percentage]" class="form-input" placeholder="e.g. 8.5 CGPA">
                </div>
            </div>
        </div>
    `;
}

function createExperienceEntry() {
    const idx = document.querySelectorAll('#experience-list .dynamic-entry').length;
    return `
        <div class="dynamic-entry">
            <button type="button" class="btn-remove" title="Remove">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="dynamic-entry-header">
                <span class="text-label-md" style="color: var(--primary)">Experience <span class="entry-index">#${idx + 1}</span></span>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Job Title</label>
                    <input type="text" name="experience[${idx}][job_title]" class="form-input" placeholder="e.g. Python Developer">
                </div>
                <div class="form-group">
                    <label class="form-label">Company</label>
                    <input type="text" name="experience[${idx}][company]" class="form-input" placeholder="Company name">
                </div>
                <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input type="text" name="experience[${idx}][start_date]" class="form-input" placeholder="e.g. Jan 2022">
                </div>
                <div class="form-group">
                    <label class="form-label">End Date</label>
                    <input type="text" name="experience[${idx}][end_date]" class="form-input" placeholder="e.g. Present">
                </div>
                <div class="form-group col-span-2">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xs);">
                        <label class="form-label" style="margin-bottom:0;">Description</label>
                        <button type="button" class="btn btn-ghost open-ai-writer" data-section="experience" style="font-size:11px;padding:2px 8px;height:auto;">
                            <span class="material-symbols-outlined" style="font-size:14px;">auto_awesome</span>
                            AI Bullet Points
                        </button>
                    </div>
                    <textarea name="experience[${idx}][description]" class="form-textarea" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
                </div>
            </div>
        </div>
    `;
}

function createProjectEntry() {
    const idx = document.querySelectorAll('#projects-list .dynamic-entry').length;
    return `
        <div class="dynamic-entry">
            <button type="button" class="btn-remove" title="Remove">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="dynamic-entry-header">
                <span class="text-label-md" style="color: var(--primary)">Project <span class="entry-index">#${idx + 1}</span></span>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Project Name</label>
                    <input type="text" name="projects[${idx}][name]" class="form-input" placeholder="e.g. E-Commerce Platform">
                </div>
                <div class="form-group">
                    <label class="form-label">Tech Stack</label>
                    <input type="text" name="projects[${idx}][tech_stack]" class="form-input" placeholder="e.g. Python, Django, PostgreSQL">
                </div>
                <div class="form-group col-span-2">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xs);">
                        <label class="form-label" style="margin-bottom:0;">Description</label>
                        <button type="button" class="btn btn-ghost open-ai-writer" data-section="project" style="font-size:11px;padding:2px 8px;height:auto;">
                            <span class="material-symbols-outlined" style="font-size:14px;">auto_awesome</span>
                            AI Writer
                        </button>
                    </div>
                    <textarea name="projects[${idx}][description]" class="form-textarea" rows="3" placeholder="Describe the project..."></textarea>
                </div>
                <div class="form-group col-span-2">
                    <label class="form-label">Live Link</label>
                    <input type="url" name="projects[${idx}][live_link]" class="form-input" placeholder="https://...">
                </div>
            </div>
        </div>
    `;
}


/* ---- Skills Tag Input ---- */
function initSkillsInput() {
    const container = document.getElementById('skills-container');
    const input = document.getElementById('skill-input');
    const hiddenField = document.getElementById('skills-hidden');

    if (!container || !input) return;

    // Click on container focuses input
    container.addEventListener('click', () => input.focus());

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const skill = input.value.trim().replace(',', '');
            if (skill && !isDuplicateSkill(skill)) {
                addSkillTag(skill);
                input.value = '';
                updateSkillsHidden();
                updatePreview();
            }
        }

        if (e.key === 'Backspace' && !input.value) {
            const tags = container.querySelectorAll('.skill-tag');
            if (tags.length > 0) {
                tags[tags.length - 1].remove();
                updateSkillsHidden();
                updatePreview();
            }
        }
    });

    // Initialize existing skill tags remove buttons
    container.querySelectorAll('.skill-tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.skill-tag').remove();
            updateSkillsHidden();
            updatePreview();
        });
    });
}

function isDuplicateSkill(skill) {
    const container = document.getElementById('skills-container');
    if (!container) return false;
    const existing = Array.from(container.querySelectorAll('.skill-tag'))
        .map(t => t.textContent.replace('×', '').trim().toLowerCase());
    return existing.includes(skill.toLowerCase());
}

function addSkillTag(skill) {
    const container = document.getElementById('skills-container');
    const input = document.getElementById('skill-input');
    if (!container) return;

    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.innerHTML = `${escapeHtml(skill)}<button type="button" class="skill-tag-remove" title="Remove">×</button>`;

    tag.querySelector('.skill-tag-remove').addEventListener('click', () => {
        tag.remove();
        updateSkillsHidden();
        updatePreview();
    });

    container.insertBefore(tag, input);
}

function updateSkillsHidden() {
    const container = document.getElementById('skills-container');
    const hidden = document.getElementById('skills-hidden');
    if (!container || !hidden) return;

    const skills = Array.from(container.querySelectorAll('.skill-tag'))
        .map(t => t.textContent.replace('×', '').trim());
    hidden.value = skills.join(',');
}


/* ---- Photo Upload ---- */
function initPhotoUpload() {
    const input = document.getElementById('photo-input');
    const preview = document.getElementById('photo-preview-img');
    const removeBtn = document.getElementById('photo-remove');

    if (!input) return;

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowed.includes(file.type)) {
            showFlash('Please upload a valid image file (JPG, PNG, GIF, WebP).', 'error');
            input.value = '';
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showFlash('Image must be under 5MB.', 'error');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            if (preview) {
                preview.src = ev.target.result;
                preview.style.display = 'block';
                const placeholder = document.getElementById('photo-placeholder');
                if (placeholder) placeholder.style.display = 'none';
            }
            updatePreview();
        };
        reader.readAsDataURL(file);
    });

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            if (input) input.value = '';
            if (preview) {
                preview.src = '';
                preview.style.display = 'none';
            }
            const placeholder = document.getElementById('photo-placeholder');
            if (placeholder) placeholder.style.display = 'flex';
            updatePreview();
        });
    }
}


/* ---- Live Preview Update ---- */
function initLivePreview() {
    // Bind all form inputs to live preview
    const form = document.getElementById('resume-form');
    if (!form) return;

    form.addEventListener('input', debounce(updatePreview, 150));
    form.addEventListener('change', updatePreview);

    // Initial preview update
    updatePreview();
}

function updatePreview() {
    // Personal Details
    updatePreviewText('preview-name', getVal('full_name') || 'Your Name');
    updatePreviewText('preview-title', getVal('job_title') || 'Job Title');
    updatePreviewText('preview-email', getVal('email') || 'email@example.com');
    updatePreviewText('preview-phone', getVal('phone') || '+1 (555) 000-0000');
    updatePreviewText('preview-address', getVal('address') || 'City, Country');

    // Summary
    updatePreviewText('preview-summary', getVal('profile_summary') || 'Your professional summary will appear here...');

    // LinkedIn & GitHub
    const linkedinEl = document.getElementById('preview-linkedin');
    const githubEl = document.getElementById('preview-github');
    const linkedin = getVal('linkedin');
    const github = getVal('github');
    if (linkedinEl) linkedinEl.style.display = linkedin ? 'block' : 'none';
    if (linkedinEl) linkedinEl.textContent = linkedin;
    if (githubEl) githubEl.style.display = github ? 'block' : 'none';
    if (githubEl) githubEl.textContent = github;

    // Skills preview
    updateSkillsPreview();

    // Education preview
    updateEducationPreview();

    // Experience preview
    updateExperiencePreview();

    // Projects preview
    updateProjectsPreview();
}

function updatePreviewText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function getVal(name) {
    const el = document.querySelector(`[name="${name}"]`);
    return el ? el.value.trim() : '';
}

function updateSkillsPreview() {
    const previewContainer = document.getElementById('preview-skills');
    if (!previewContainer) return;

    const container = document.getElementById('skills-container');
    if (!container) return;

    const skills = Array.from(container.querySelectorAll('.skill-tag'))
        .map(t => t.textContent.replace('×', '').trim());

    if (skills.length === 0) {
        previewContainer.innerHTML = '<span style="color:var(--outline-variant);font-size:12px;">Add skills to see them here</span>';
        return;
    }

    previewContainer.innerHTML = skills.map(s =>
        `<span class="pdf-skill-chip">${escapeHtml(s)}</span>`
    ).join('');
}

function updateEducationPreview() {
    const previewContainer = document.getElementById('preview-education');
    if (!previewContainer) return;

    const entries = document.querySelectorAll('#education-list .dynamic-entry');
    if (entries.length === 0) {
        previewContainer.innerHTML = '<p style="color:var(--outline-variant);font-size:12px;">Add education entries</p>';
        return;
    }

    let html = '';
    entries.forEach(entry => {
        const degree = entry.querySelector('[name*="[degree]"]')?.value || '';
        const institution = entry.querySelector('[name*="[institution]"]')?.value || '';
        const year = entry.querySelector('[name*="[year]"]')?.value || '';
        const percentage = entry.querySelector('[name*="[percentage]"]')?.value || '';

        if (degree || institution) {
            html += `
                <div style="margin-bottom:8px;">
                    <div style="font-size:12px;font-weight:600;">${escapeHtml(degree)}</div>
                    <div style="font-size:11px;color:var(--on-surface-variant);">${escapeHtml(institution)}${year ? ` • ${escapeHtml(year)}` : ''}${percentage ? ` • ${escapeHtml(percentage)}` : ''}</div>
                </div>
            `;
        }
    });

    previewContainer.innerHTML = html || '<p style="color:var(--outline-variant);font-size:12px;">Add education entries</p>';
}

function updateExperiencePreview() {
    const previewContainer = document.getElementById('preview-experience');
    if (!previewContainer) return;

    const entries = document.querySelectorAll('#experience-list .dynamic-entry');
    if (entries.length === 0) {
        previewContainer.innerHTML = '<p style="color:var(--outline-variant);font-size:12px;">Add work experience</p>';
        return;
    }

    let html = '';
    entries.forEach(entry => {
        const title = entry.querySelector('[name*="[job_title]"]')?.value || '';
        const company = entry.querySelector('[name*="[company]"]')?.value || '';
        const start = entry.querySelector('[name*="[start_date]"]')?.value || '';
        const end = entry.querySelector('[name*="[end_date]"]')?.value || '';
        const desc = entry.querySelector('[name*="[description]"]')?.value || '';

        if (title || company) {
            html += `
                <div style="margin-bottom:10px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                        <span style="font-size:12px;font-weight:600;">${escapeHtml(title)}${company ? ` • ${escapeHtml(company)}` : ''}</span>
                        <span style="font-size:11px;color:var(--on-surface-variant);font-style:italic;">${escapeHtml(start)}${end ? ` - ${escapeHtml(end)}` : ''}</span>
                    </div>
                    ${desc ? `<p style="font-size:11px;color:var(--on-surface-variant);line-height:1.5;">${escapeHtml(desc).substring(0, 150)}${desc.length > 150 ? '...' : ''}</p>` : ''}
                </div>
            `;
        }
    });

    previewContainer.innerHTML = html || '<p style="color:var(--outline-variant);font-size:12px;">Add work experience</p>';
}

function updateProjectsPreview() {
    const previewContainer = document.getElementById('preview-projects');
    if (!previewContainer) return;

    const entries = document.querySelectorAll('#projects-list .dynamic-entry');
    if (entries.length === 0) {
        previewContainer.innerHTML = '<p style="color:var(--outline-variant);font-size:12px;">Add projects</p>';
        return;
    }

    let html = '';
    entries.forEach(entry => {
        const name = entry.querySelector('[name*="[name]"]')?.value || '';
        const tech = entry.querySelector('[name*="[tech_stack]"]')?.value || '';
        const desc = entry.querySelector('[name*="[description]"]')?.value || '';

        if (name) {
            html += `
                <div style="margin-bottom:8px;">
                    <div style="font-size:12px;font-weight:600;">${escapeHtml(name)}</div>
                    ${tech ? `<div style="font-size:10px;color:var(--primary);margin-bottom:2px;">${escapeHtml(tech)}</div>` : ''}
                    ${desc ? `<p style="font-size:11px;color:var(--on-surface-variant);line-height:1.4;">${escapeHtml(desc).substring(0, 100)}${desc.length > 100 ? '...' : ''}</p>` : ''}
                </div>
            `;
        }
    });

    previewContainer.innerHTML = html || '<p style="color:var(--outline-variant);font-size:12px;">Add projects</p>';
}


/* ---- Form Validation ---- */
function initFormValidation() {
    // Registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            let valid = true;
            clearErrors(registerForm);

            const name = registerForm.querySelector('[name="name"]');
            const email = registerForm.querySelector('[name="email"]');
            const password = registerForm.querySelector('[name="password"]');

            if (name && !name.value.trim()) {
                showFieldError(name, 'Name is required');
                valid = false;
            }
            if (email && !isValidEmail(email.value)) {
                showFieldError(email, 'Please enter a valid email');
                valid = false;
            }
            if (password && password.value.length < 8) {
                showFieldError(password, 'Password must be at least 8 characters');
                valid = false;
            }

            if (!valid) e.preventDefault();
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            let valid = true;
            clearErrors(loginForm);

            const email = loginForm.querySelector('[name="email"]');
            const password = loginForm.querySelector('[name="password"]');

            if (email && !isValidEmail(email.value)) {
                showFieldError(email, 'Please enter a valid email');
                valid = false;
            }
            if (password && !password.value) {
                showFieldError(password, 'Password is required');
                valid = false;
            }

            if (!valid) e.preventDefault();
        });
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(input, message) {
    input.style.borderColor = 'var(--error)';
    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    input.parentElement.appendChild(error);
}

function clearErrors(form) {
    form.querySelectorAll('.form-error').forEach(e => e.remove());
    form.querySelectorAll('input, textarea').forEach(input => {
        input.style.borderColor = '';
    });
}


/* ---- Stepper Navigation ---- */
function initStepperNavigation() {
    const tabs = document.querySelectorAll('.stepper-tab');
    const sections = document.querySelectorAll('.form-section');
    const progressFill = document.querySelector('.stepper-progress-fill');
    const stepLabel = document.getElementById('step-label');
    const stepPercent = document.getElementById('step-percent');

    if (tabs.length === 0 || sections.length === 0) return;

    const stepNames = ['Basics', 'Experience', 'Education', 'Skills', 'Projects'];

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update sections
            sections.forEach(s => s.classList.add('hidden'));
            if (sections[index]) sections[index].classList.remove('hidden');

            // Update progress
            const percent = Math.round(((index + 1) / tabs.length) * 100);
            if (progressFill) progressFill.style.width = `${percent}%`;
            if (stepLabel) stepLabel.textContent = `Step ${index + 1}: ${stepNames[index] || ''}`;
            if (stepPercent) stepPercent.textContent = `${percent}% Complete`;
        });
    });

    // Next/Back buttons
    document.querySelectorAll('.btn-next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const activeTab = document.querySelector('.stepper-tab.active');
            const activeIndex = Array.from(tabs).indexOf(activeTab);
            if (activeIndex < tabs.length - 1) {
                tabs[activeIndex + 1].click();
                document.querySelector('.editor-form')?.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('.btn-prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const activeTab = document.querySelector('.stepper-tab.active');
            const activeIndex = Array.from(tabs).indexOf(activeTab);
            if (activeIndex > 0) {
                tabs[activeIndex - 1].click();
                document.querySelector('.editor-form')?.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}


/* ---- Micro-Interactions ---- */
function initMicroInteractions() {
    // Button press effect
    document.querySelectorAll('.btn, .btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = '';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}


/* ---- Dashboard Search ---- */
function initDashboardSearch() {
    const searchInput = document.getElementById('dashboard-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.resume-card-item').forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            if (title.includes(query) || !query) {
                card.style.display = '';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.3';
            }
        });
    }, 200));
}


/* ---- Auth Tabs ---- */
function initAuthTabs() {
    const signinTab = document.getElementById('signin-tab');
    const createTab = document.getElementById('create-tab');
    const signinForm = document.getElementById('signin-form');
    const createForm = document.getElementById('create-form');

    if (!signinTab || !createTab) return;

    signinTab.addEventListener('click', () => {
        signinTab.classList.add('active');
        createTab.classList.remove('active');
        if (signinForm) signinForm.classList.remove('hidden');
        if (createForm) createForm.classList.add('hidden');
    });

    createTab.addEventListener('click', () => {
        createTab.classList.add('active');
        signinTab.classList.remove('active');
        if (createForm) createForm.classList.remove('hidden');
        if (signinForm) signinForm.classList.add('hidden');
    });
}


/* ---- Auto-Save Draft ---- */
function initAutoSave() {
    const form = document.getElementById('resume-form');
    if (!form) return;

    const statusEl = document.getElementById('autosave-status');

    // Auto-save every 30 seconds
    setInterval(() => {
        const formData = new FormData(form);
        const resumeId = form.dataset.resumeId;
        if (!resumeId) return;

        fetch(`/resume/${resumeId}/autosave`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(res => {
            if (res.ok && statusEl) {
                statusEl.textContent = 'Saved just now';
                setTimeout(() => {
                    statusEl.textContent = 'Autosaved';
                }, 2000);
            }
        }).catch(() => {
            // Silent fail for autosave
        });
    }, 30000);
}


/* ---- Scroll Animations ---- */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 600ms ease-out';
        observer.observe(el);
    });
}


/* ---- Utility Functions ---- */
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showFlash(message, type = 'info') {
    let container = document.querySelector('.flash-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flash-container';
        document.body.appendChild(container);
    }

    const msg = document.createElement('div');
    msg.className = `flash-message flash-${type}`;
    msg.innerHTML = `
        <span class="material-symbols-outlined">${type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'info'}</span>
        ${escapeHtml(message)}
        <button class="flash-close" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(msg);

    setTimeout(() => {
        if (msg.parentElement) {
            msg.style.opacity = '0';
            msg.style.transform = 'translateX(100px)';
            setTimeout(() => msg.remove(), 300);
        }
    }, 5000);
}

// Delete resume confirmation
function confirmDelete(resumeId) {
    if (confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/resume/${resumeId}/delete`;

        // Add CSRF token
        const csrf = document.querySelector('meta[name="csrf-token"]');
        if (csrf) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'csrf_token';
            input.value = csrf.content;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    }
}

// Set default resume
function setDefaultResume(resumeId) {
    fetch(`/resume/${resumeId}/set-default`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.ok) {
            window.location.reload();
        }
    });
}


/* ---- Auto-Save Before PDF Download ---- */
function initEditorDownloadButton() {
    const downloadBtn = document.getElementById('editor-download-pdf-btn');
    const form = document.getElementById('resume-form');
    if (downloadBtn && form) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            showFlash("Saving latest changes before downloading...", "info");
            
            const formData = new FormData(form);
            const actionUrl = form.action;
            
            fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(res => {
                if (res.ok) {
                    showFlash("Changes saved! Initiating PDF download...", "success");
                    const resumeId = form.dataset.resumeId;
                    window.location.href = `/resume/${resumeId}/download-pdf`;
                } else {
                    showFlash("Failed to auto-save changes before download.", "error");
                }
            })
            .catch(() => {
                showFlash("Connection error. Could not save details.", "error");
            });
        });
    }
}


/* ---- Header Dropdowns ---- */
function initHeaderDropdowns() {
    const notifBtn = document.getElementById('header-notif-btn');
    const notifDropdown = document.getElementById('header-notif-dropdown');
    const profileBtn = document.getElementById('header-profile-btn');
    const profileDropdown = document.getElementById('header-profile-dropdown');

    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (profileDropdown) profileDropdown.classList.remove('active');
            notifDropdown.classList.toggle('active');
        });
    }

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (notifDropdown) notifDropdown.classList.remove('active');
            profileDropdown.classList.toggle('active');
        });
    }

    document.addEventListener('click', () => {
        if (notifDropdown) notifDropdown.classList.remove('active');
        if (profileDropdown) profileDropdown.classList.remove('active');
    });
}


/* ---- Custom Modals (Tips & Help) ---- */
function initCustomModals() {
    // Help Modal
    const helpBtns = document.querySelectorAll('#help-sidebar-btn');
    const helpModal = document.getElementById('help-overlay-modal');
    const helpClose = document.getElementById('help-modal-close');
    const helpOk = document.getElementById('help-modal-ok');

    helpBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (helpModal) helpModal.classList.add('active');
        });
    });

    [helpClose, helpOk].forEach(el => {
        if (el) {
            el.addEventListener('click', () => {
                if (helpModal) helpModal.classList.remove('active');
            });
        }
    });

    if (helpModal) {
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) helpModal.classList.remove('active');
        });
    }

    // Optimization Tips Modal
    const tipsBtn = document.getElementById('view-tips-btn');
    const tipsModal = document.getElementById('tips-overlay-modal');
    const tipsClose = document.getElementById('tips-modal-close');
    const tipsOk = document.getElementById('tips-modal-ok');

    if (tipsBtn && tipsModal) {
        tipsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            tipsModal.classList.add('active');
        });
    }

    [tipsClose, tipsOk].forEach(el => {
        if (el) {
            el.addEventListener('click', () => {
                if (tipsModal) tipsModal.classList.remove('active');
            });
        }
    });

    if (tipsModal) {
        tipsModal.addEventListener('click', (e) => {
            if (e.target === tipsModal) tipsModal.classList.remove('active');
        });
    }
    
    // Settings Connected Accounts Toggle Simulation
    const googleToggle = document.getElementById('google-connect-toggle');
    const googleStatus = document.getElementById('google-status-text');
    if (googleToggle) {
        googleToggle.addEventListener('change', () => {
            if (googleToggle.checked) {
                googleStatus.textContent = "Connected as googleuser@example.com";
                showFlash("Connected with Google successfully!", "success");
            } else {
                googleStatus.textContent = "Not connected";
                showFlash("Disconnected Google account.", "info");
            }
        });
    }
}


/* ---- AI Resume Writer ---- */
let activeAIField = null;
let generatedAIText = "";

function initAIWriter() {
    const aiModal = document.getElementById('ai-writer-overlay-modal');
    const aiClose = document.getElementById('ai-writer-modal-close');
    const aiGenerateBtn = document.getElementById('ai-writer-generate-btn');
    const aiInsertBtn = document.getElementById('ai-writer-insert-btn');
    const aiSectionSelect = document.getElementById('ai-section-select');
    const aiRoleInput = document.getElementById('ai-role-input');
    const aiKeywordsInput = document.getElementById('ai-keywords-input');
    const aiLoader = document.getElementById('ai-writer-loader');
    const aiResultText = document.getElementById('ai-writer-result-text');

    // Use event delegation so that dynamic entries work perfectly too
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.open-ai-writer');
        if (!btn) return;

        e.preventDefault();
        
        let targetTextarea = null;
        const section = btn.dataset.section;

        if (section === 'summary') {
            targetTextarea = document.querySelector('[name="profile_summary"]');
        } else {
            const entry = btn.closest('.dynamic-entry');
            if (entry) {
                targetTextarea = entry.querySelector('textarea');
            }
        }

        if (!targetTextarea) {
            showFlash("Could not locate the input text area.", "error");
            return;
        }

        activeAIField = targetTextarea;
        generatedAIText = "";
        
        if (aiModal) {
            aiModal.classList.add('active');
            if (aiSectionSelect) aiSectionSelect.value = section;
            if (aiKeywordsInput) aiKeywordsInput.value = "";
            if (aiResultText) {
                aiResultText.textContent = "AI generated suggestions will appear here...";
                aiResultText.style.color = "var(--outline-variant)";
            }
            if (aiInsertBtn) aiInsertBtn.disabled = true;
            
            const basicsTitle = document.querySelector('[name="job_title"]');
            if (aiRoleInput && basicsTitle && basicsTitle.value.trim()) {
                aiRoleInput.value = basicsTitle.value.trim();
            } else if (aiRoleInput) {
                aiRoleInput.value = "";
            }
        }
    });

    if (aiClose && aiModal) {
        aiClose.addEventListener('click', () => {
            aiModal.classList.remove('active');
        });
        aiModal.addEventListener('click', (e) => {
            if (e.target === aiModal) aiModal.classList.remove('active');
        });
    }

    if (aiGenerateBtn) {
        aiGenerateBtn.addEventListener('click', () => {
            const section = aiSectionSelect ? aiSectionSelect.value : "summary";
            const role = aiRoleInput ? aiRoleInput.value.trim() : "";
            const keywords = aiKeywordsInput ? aiKeywordsInput.value.trim() : "";

            if (!role) {
                showFlash("Please specify a Job Title / Role first.", "error");
                return;
            }

            if (aiLoader) aiLoader.style.display = "flex";
            if (aiResultText) aiResultText.textContent = "";

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

            fetch('/api/ai-generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken || ''
                },
                body: JSON.stringify({ section, role, keywords })
            })
            .then(res => res.json())
            .then(data => {
                if (aiLoader) aiLoader.style.display = "none";
                if (data.status === 'success' && data.generated_text) {
                    generatedAIText = data.generated_text;
                    if (aiResultText) {
                        aiResultText.style.color = "var(--on-surface)";
                        typeWriterEffect(aiResultText, generatedAIText, () => {
                            if (aiInsertBtn) aiInsertBtn.disabled = false;
                        });
                    }
                } else {
                    if (aiResultText) aiResultText.textContent = "Failed to generate suggestions. Please try again.";
                }
            })
            .catch(() => {
                if (aiLoader) aiLoader.style.display = "none";
                if (aiResultText) aiResultText.textContent = "Server communication failure.";
            });
        });
    }

    if (aiInsertBtn) {
        aiInsertBtn.addEventListener('click', () => {
            if (activeAIField && generatedAIText) {
                if (activeAIField.value.trim()) {
                    activeAIField.value = activeAIField.value.trim() + "\n" + generatedAIText;
                } else {
                    activeAIField.value = generatedAIText;
                }
                
                activeAIField.dispatchEvent(new Event('input', { bubbles: true }));
                activeAIField.dispatchEvent(new Event('change', { bubbles: true }));
                
                showFlash("AI content inserted successfully!", "success");
            }
            if (aiModal) aiModal.classList.remove('active');
        });
    }
}

// Typing animation effect
function typeWriterEffect(element, text, callback) {
    element.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            const parent = element.parentElement;
            if (parent) parent.scrollTop = parent.scrollHeight;
        } else {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 12);
}
