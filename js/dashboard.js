/**
 * EduLearn - Student Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  loadDashboardData();
});

async function loadDashboardData() {
  const welcomeName = document.getElementById('dashboard-user-name');
  const statsContainer = document.getElementById('dashboard-stats-grid');
  const inProgressContainer = document.getElementById('dashboard-in-progress-list');
  const completedContainer = document.getElementById('dashboard-completed-list');
  const certsContainer = document.getElementById('dashboard-certificates-list');
  const recommendedContainer = document.getElementById('dashboard-recommended-grid');

  try {
    const res = await window.api.get('/users/me/dashboard');
    const user = res.user || {};
    const stats = res.stats || {};
    const inProgress = res.in_progress_courses || [];
    const completed = res.completed_courses || [];
    const certificates = res.certificates || [];
    const recommended = res.recommended_courses || [];

    // Welcome Greeting
    if (welcomeName) {
      welcomeName.textContent = user.name || 'Student';
    }

    // Stats Grid
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="card" style="padding: 1.5rem; text-align: center;">
          <div style="font-size: 2.25rem; font-weight: 800; color: var(--primary-600);">${stats.in_progress_count || 0}</div>
          <div style="font-size: 0.875rem; color: var(--slate-600); font-weight: 600; margin-top: 0.25rem;">In-Progress Courses</div>
        </div>
        <div class="card" style="padding: 1.5rem; text-align: center;">
          <div style="font-size: 2.25rem; font-weight: 800; color: var(--success);">${stats.completed_count || 0}</div>
          <div style="font-size: 0.875rem; color: var(--slate-600); font-weight: 600; margin-top: 0.25rem;">Completed Courses</div>
        </div>
        <div class="card" style="padding: 1.5rem; text-align: center;">
          <div style="font-size: 2.25rem; font-weight: 800; color: var(--accent-600);">${stats.certificates_count || 0}</div>
          <div style="font-size: 0.875rem; color: var(--slate-600); font-weight: 600; margin-top: 0.25rem;">Certificates Earned</div>
        </div>
        <div class="card" style="padding: 1.5rem; text-align: center;">
          <div style="font-size: 2.25rem; font-weight: 800; color: var(--slate-800);">${stats.total_enrolled || 0}</div>
          <div style="font-size: 0.875rem; color: var(--slate-600); font-weight: 600; margin-top: 0.25rem;">Total Enrollments</div>
        </div>
      `;
    }

    // In Progress Courses
    if (inProgressContainer) {
      if (inProgress.length === 0) {
        inProgressContainer.innerHTML = `
          <div style="text-align: center; padding: 2.5rem; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
            <p class="text-muted" style="margin-bottom: 1rem;">You don't have any active courses in progress.</p>
            <a href="courses.html" class="btn btn-primary btn-sm">Explore Course Catalog</a>
          </div>
        `;
      } else {
        inProgressContainer.innerHTML = inProgress.map(enr => {
          const course = enr.course || {};
          return `
            <div class="card" style="padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 1.25rem; min-width: 280px; flex: 1;">
                <img src="${escapeHtml(course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200')}" style="width: 100px; height: 64px; object-fit: cover; border-radius: var(--radius-md);" alt="${escapeHtml(course.title)}" />
                <div>
                  <span class="badge badge-category" style="margin-bottom: 0.25rem;">${escapeHtml(course.category || '')}</span>
                  <h4 style="font-size: 1.05rem; margin-bottom: 0.35rem;">
                    <a href="course-detail.html?id=${course.id}">${escapeHtml(course.title)}</a>
                  </h4>
                  <div style="font-size: 0.8125rem; color: var(--slate-500);">By ${escapeHtml(course.instructor?.name || 'EduLearn')}</div>
                </div>
              </div>
              <div style="min-width: 220px; flex: 1;">
                <div class="progress-bar-container">
                  <div class="progress-header">
                    <span>Progress</span>
                    <span>${enr.progress_percent}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width: ${enr.progress_percent}%;"></div>
                  </div>
                </div>
              </div>
              <div>
                <a href="lesson-player.html?course_id=${course.id}" class="btn btn-primary btn-sm">
                  Resume Lesson
                </a>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Completed Courses
    if (completedContainer) {
      if (completed.length === 0) {
        completedContainer.innerHTML = '<p class="text-muted" style="padding: 1rem 0;">Complete courses to earn certificates and unlock your achievements!</p>';
      } else {
        completedContainer.innerHTML = completed.map(enr => {
          const course = enr.course || {};
          return `
            <div class="card" style="padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 1.25rem;">
                <img src="${escapeHtml(course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200')}" style="width: 80px; height: 50px; object-fit: cover; border-radius: var(--radius-md);" alt="${escapeHtml(course.title)}" />
                <div>
                  <h4 style="font-size: 1rem; margin-bottom: 0.2rem;">${escapeHtml(course.title)}</h4>
                  <span class="badge badge-beginner" style="font-size: 0.75rem;">Completed 100%</span>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <a href="lesson-player.html?course_id=${course.id}" class="btn btn-secondary btn-sm">Review Course</a>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Certificates Grid
    if (certsContainer) {
      if (certificates.length === 0) {
        certsContainer.innerHTML = '<p class="text-muted" style="padding: 1rem 0;">No certificates issued yet. Complete all lessons of any course to receive your verified diploma.</p>';
      } else {
        certsContainer.innerHTML = certificates.map(cert => `
          <div class="card" style="padding: 1.5rem; border: 1px solid var(--border-light); background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
              <span class="badge badge-verified">Verified Credential</span>
              <span style="font-size: 0.75rem; color: var(--slate-400);">${formatDate(cert.issued_at)}</span>
            </div>
            <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--slate-900);">${escapeHtml(cert.course_title || 'Certificate of Completion')}</h4>
            <p style="font-size: 0.8125rem; color: var(--slate-500); margin-bottom: 1rem;">Recipient: <strong>${escapeHtml(cert.recipient_name || user.name)}</strong></p>
            <div style="font-family: monospace; font-size: 0.75rem; background: var(--slate-100); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); color: var(--slate-700); margin-bottom: 1rem; word-break: break-all;">
              Code: ${escapeHtml(cert.certificate_code)}
            </div>
            <button class="btn btn-outline btn-sm btn-block" onclick='openCertificateModal(${JSON.stringify(cert)})'>
              View Certificate
            </button>
          </div>
        `).join('');
      }
    }

    // Recommended Grid
    if (recommendedContainer && recommended.length > 0) {
      recommendedContainer.innerHTML = recommended.map(course => renderCourseCard(course)).join('');
    }

  } catch (err) {
    showToast(err.message || 'Failed to load dashboard.', 'error');
  }
}

// Certificate Modal Preview
window.openCertificateModal = function(cert) {
  const recipientEl = document.getElementById('cert-modal-recipient');
  const courseEl = document.getElementById('cert-modal-course');
  const instructorEl = document.getElementById('cert-modal-instructor');
  const dateEl = document.getElementById('cert-modal-date');
  const codeEl = document.getElementById('cert-modal-code');

  if (recipientEl) recipientEl.textContent = cert.recipient_name || 'Alex Morgan';
  if (courseEl) courseEl.textContent = cert.course_title || 'Course of Study';
  if (instructorEl) instructorEl.textContent = cert.instructor_name || 'EduLearn Faculty';
  if (dateEl) dateEl.textContent = formatDate(cert.issued_at);
  if (codeEl) codeEl.textContent = cert.certificate_code || '';

  openModal('modal-certificate-view');
};
