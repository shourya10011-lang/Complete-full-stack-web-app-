/**
 * EduLearn - Course Catalog, Landing Features & Course Detail Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.endsWith('courses.html')) {
    initCatalogPage();
  } else if (path.endsWith('course-detail.html')) {
    initCourseDetailPage();
  } else if (path.endsWith('index.html') || path === '/' || path === '') {
    initLandingPage();
  }
});

// 1. LANDING PAGE
async function initLandingPage() {
  const container = document.getElementById('featured-courses-grid');
  if (!container) return;

  container.innerHTML = renderSkeletonCards(3);

  try {
    const res = await window.api.get('/courses?limit=3&sort=popular');
    const courses = res.courses || [];

    if (courses.length === 0) {
      container.innerHTML = '<p class="text-muted text-center" style="grid-column: 1/-1;">No courses available right now.</p>';
      return;
    }

    container.innerHTML = courses.map(course => renderCourseCard(course)).join('');
  } catch (err) {
    console.error('Error loading featured courses:', err);
    container.innerHTML = `<div class="card p-4 text-center" style="grid-column: 1/-1; padding: 2rem;">
      <p class="text-danger">Failed to load courses from API.</p>
      <button class="btn btn-secondary btn-sm" onclick="initLandingPage()" style="margin-top: 1rem;">Retry</button>
    </div>`;
  }
}

// 2. CATALOG PAGE
let catalogState = {
  category: 'all',
  difficulty: 'all',
  search: '',
  sort: 'popular',
  page: 1,
  limit: 9,
};

async function initCatalogPage() {
  const urlCategory = getQueryParam('category');
  const urlSearch = getQueryParam('search');
  if (urlCategory) catalogState.category = urlCategory;
  if (urlSearch) catalogState.search = urlSearch;

  // Search input binding
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) {
    searchInput.value = catalogState.search;
    searchInput.addEventListener('input', debounce((e) => {
      catalogState.search = e.target.value;
      catalogState.page = 1;
      loadCatalogCourses();
    }, 350));
  }

  // Sort dropdown
  const sortSelect = document.getElementById('catalog-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      catalogState.sort = e.target.value;
      catalogState.page = 1;
      loadCatalogCourses();
    });
  }

  // Category filter chips
  document.querySelectorAll('.filter-chip-category').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-chip-category').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      catalogState.category = btn.getAttribute('data-category');
      catalogState.page = 1;
      loadCatalogCourses();
    });
  });

  // Difficulty filter chips
  document.querySelectorAll('.filter-chip-difficulty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-chip-difficulty').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      catalogState.difficulty = btn.getAttribute('data-difficulty');
      catalogState.page = 1;
      loadCatalogCourses();
    });
  });

  loadCatalogCourses();
}

async function loadCatalogCourses() {
  const container = document.getElementById('catalog-courses-grid');
  const paginationContainer = document.getElementById('catalog-pagination');
  const countLabel = document.getElementById('catalog-results-count');
  if (!container) return;

  container.innerHTML = renderSkeletonCards(6);

  try {
    const params = new URLSearchParams({
      category: catalogState.category,
      difficulty: catalogState.difficulty,
      search: catalogState.search,
      sort: catalogState.sort,
      page: catalogState.page,
      limit: catalogState.limit,
    });

    const res = await window.api.get(`/courses?${params.toString()}`);
    const courses = res.courses || [];

    if (countLabel) {
      countLabel.textContent = `Showing ${courses.length} of ${res.total || 0} courses`;
    }

    if (courses.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
          <svg style="width: 48px; height: 48px; color: var(--slate-400); margin-bottom: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3>No courses found</h3>
          <p class="text-muted" style="margin: 0.5rem 0 1.5rem;">Try adjusting your search query or clearing filter categories.</p>
          <button class="btn btn-secondary btn-sm" onclick="resetCatalogFilters()">Reset All Filters</button>
        </div>
      `;
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    container.innerHTML = courses.map(course => renderCourseCard(course)).join('');
    renderPagination(res, paginationContainer);
  } catch (err) {
    console.error('Failed to load courses:', err);
    container.innerHTML = `<div class="card p-4 text-center" style="grid-column: 1/-1; padding: 2.5rem;">
      <p class="text-danger">Unable to load courses. Please check your backend connection.</p>
      <button class="btn btn-secondary btn-sm" onclick="loadCatalogCourses()" style="margin-top: 1rem;">Retry</button>
    </div>`;
  }
}

function resetCatalogFilters() {
  catalogState.category = 'all';
  catalogState.difficulty = 'all';
  catalogState.search = '';
  catalogState.page = 1;

  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.filter-chip-category').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-category') === 'all');
  });
  document.querySelectorAll('.filter-chip-difficulty').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-difficulty') === 'all');
  });

  loadCatalogCourses();
}

function renderPagination(meta, container) {
  if (!container || !meta || meta.pages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

  let html = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 3rem;">
      <button class="btn btn-secondary btn-sm" ${!meta.has_prev ? 'disabled' : ''} onclick="goToCatalogPage(${meta.page - 1})">Previous</button>
  `;

  for (let i = 1; i <= meta.pages; i++) {
    html += `
      <button class="btn ${i === meta.page ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="goToCatalogPage(${i})">${i}</button>
    `;
  }

  html += `
      <button class="btn btn-secondary btn-sm" ${!meta.has_next ? 'disabled' : ''} onclick="goToCatalogPage(${meta.page + 1})">Next</button>
    </div>
  `;

  container.innerHTML = html;
}

window.goToCatalogPage = function(page) {
  catalogState.page = page;
  loadCatalogCourses();
  window.scrollTo({ top: 200, behavior: 'smooth' });
};

// Reusable Course Card Template
function renderCourseCard(course) {
  const badgeClass = `badge-${course.difficulty || 'beginner'}`;
  const priceDisplay = course.discount_price 
    ? `<span class="price-current">${formatCurrency(course.discount_price)}</span><span class="price-original">${formatCurrency(course.price)}</span>`
    : `<span class="price-current">${Number(course.price) === 0 ? 'Free' : formatCurrency(course.price)}</span>`;

  const isYouTubePlaylist = course.youtube_playlist_url || (course.category && course.category.toLowerCase().includes('english'));

  return `
    <article class="course-card" id="course-card-${course.id}">
      <div class="course-card-thumb" style="position: relative;">
        <a href="course-detail.html?id=${course.id}">
          <img src="${escapeHtml(course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=380&fit=crop')}" alt="${escapeHtml(course.title)}" loading="lazy" />
        </a>
        <div class="course-card-badge">
          <span class="badge ${badgeClass}">${escapeHtml(course.difficulty)}</span>
        </div>
        ${isYouTubePlaylist ? `
          <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(15, 23, 42, 0.92); color: #f87171; padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; border: 1px solid rgba(239, 68, 68, 0.4); box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            ${course.category === 'Web Development' ? 'English Web Dev Playlist' : 'English YouTube Playlist'}
          </div>
        ` : ''}
      </div>
      <div class="course-card-body">
        <div class="course-card-category">${escapeHtml(course.category)}</div>
        <h3 class="course-card-title">
          <a href="course-detail.html?id=${course.id}">${escapeHtml(course.title)}</a>
        </h3>
        ${course.instructor ? `
          <div class="course-card-instructor">
            <img src="${escapeHtml(course.instructor.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')}" alt="${escapeHtml(course.instructor.name)}" />
            <span>${escapeHtml(course.instructor.name)}</span>
          </div>
        ` : ''}
        <div class="course-card-meta">
          <span class="rating-stars">★ ${course.rating_avg.toFixed(1)} <span style="font-weight: normal; color: var(--slate-400);">(${course.rating_count})</span></span>
          <span>•</span>
          <span>${course.duration_hours || 0} hrs</span>
          <span>•</span>
          <span>${(course.student_count || 0).toLocaleString()} students</span>
        </div>
        <div class="course-card-price">
          ${priceDisplay}
        </div>
      </div>
    </article>
  `;
}

// 3. COURSE DETAIL PAGE
let currentCourseData = null;

async function initCourseDetailPage() {
  const courseId = getQueryParam('id');
  if (!courseId) {
    window.location.href = 'courses.html';
    return;
  }

  // Setup tab switcher
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${btn.getAttribute('data-tab')}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  await loadCourseDetails(courseId);
  await loadCourseReviews(courseId);
  initReviewForm(courseId);
}

async function loadCourseDetails(courseId) {
  try {
    const res = await window.api.get(`/courses/${courseId}`);
    const course = res.course;
    currentCourseData = course;

    // Header & Meta
    document.title = `${course.title} | EduLearn`;
    document.getElementById('course-category-badge').textContent = course.category;
    document.getElementById('course-title').textContent = course.title;
    document.getElementById('course-description').textContent = course.description;
    document.getElementById('course-rating').innerHTML = `★ ${course.rating_avg.toFixed(1)} (${course.rating_count} reviews)`;
    document.getElementById('course-students').textContent = `${(course.student_count || 0).toLocaleString()} students enrolled`;
    document.getElementById('course-duration').textContent = `${course.duration_hours || 0} total hours`;
    document.getElementById('course-difficulty').textContent = course.difficulty.toUpperCase();

    // Sticky Enroll Box
    const thumbEl = document.getElementById('enroll-box-thumb-img');
    if (thumbEl) thumbEl.src = course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=380&fit=crop';

    const priceEl = document.getElementById('enroll-box-price');
    if (priceEl) {
      priceEl.innerHTML = course.discount_price 
        ? `<span class="price-current">${formatCurrency(course.discount_price)}</span> <span class="price-original">${formatCurrency(course.price)}</span>`
        : `<span class="price-current">${Number(course.price) === 0 ? 'Free' : formatCurrency(course.price)}</span>`;
    }

    const enrollBtn = document.getElementById('btn-enroll-action');
    if (enrollBtn) {
      if (course.is_enrolled) {
        enrollBtn.className = 'btn btn-primary btn-block btn-lg';
        enrollBtn.innerHTML = `
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Continue Learning
        `;
        enrollBtn.onclick = () => {
          window.location.href = `lesson-player.html?course_id=${course.id}`;
        };
      } else {
        enrollBtn.className = 'btn btn-primary btn-block btn-lg';
        enrollBtn.textContent = 'Enroll in Course';
        enrollBtn.onclick = () => handleEnrollCourse(course.id);
      }
    }

    // Overview Tab
    document.getElementById('overview-text').textContent = course.description;

    // Curriculum Tab
    const lessonsList = document.getElementById('curriculum-lessons-list');
    if (lessonsList && course.lessons) {
      document.getElementById('curriculum-count').textContent = `${course.lessons.length} lessons • ${course.duration_hours || 0} total hours`;
      
      const playlistBanner = course.youtube_playlist_url ? `
        <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #ef4444; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
            <div>
              <div style="font-weight: 700; color: var(--slate-900);">YouTube Video Series & Playlist Integrated</div>
              <div style="font-size: 0.8125rem; color: var(--slate-600);">Watch high-definition streaming lessons with synchronized notes, pronunciation practice, and quizzes.</div>
            </div>
          </div>
          <a href="lesson-player.html?course_id=${course.id}" class="btn btn-secondary btn-sm" style="color: #dc2626; border-color: rgba(239, 68, 68, 0.4);">
            Open Player ↗
          </a>
        </div>
      ` : '';

      const itemsHtml = course.lessons.map((lesson, idx) => {
        const isYt = lesson.video_url && (lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be'));
        return `
        <li class="curriculum-item">
          <div class="curriculum-left">
            <span style="font-weight: 700; color: var(--slate-400); width: 24px;">${idx + 1}.</span>
            <div>
              <div style="font-weight: 600; color: var(--slate-800); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span>${escapeHtml(lesson.title)}</span>
                ${isYt ? `<span style="font-size: 0.68rem; font-weight: 700; background: rgba(239, 68, 68, 0.12); color: #dc2626; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.25);">YouTube</span>` : ''}
              </div>
              <div style="font-size: 0.75rem; color: var(--slate-500); display: flex; gap: 0.5rem; align-items: center; margin-top: 0.2rem;">
                <span style="text-transform: capitalize;">${lesson.type}</span>
                <span>•</span>
                <span>${lesson.duration_minutes || 10} mins</span>
              </div>
            </div>
          </div>
          <div>
            ${lesson.is_preview ? `
              <a href="lesson-player.html?course_id=${course.id}&lesson_id=${lesson.id}" class="btn btn-outline btn-sm">Preview</a>
            ` : course.is_enrolled ? `
              <a href="lesson-player.html?course_id=${course.id}&lesson_id=${lesson.id}" class="btn btn-secondary btn-sm">Start</a>
            ` : `
              <span style="color: var(--slate-400); font-size: 0.8125rem; display: flex; align-items: center; gap: 0.35rem;">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Locked
              </span>
            `}
          </div>
        </li>
      `;
      }).join('');

      lessonsList.innerHTML = playlistBanner ? `${playlistBanner}<div>${itemsHtml}</div>` : itemsHtml;
    }

    // Instructor Tab
    if (course.instructor) {
      document.getElementById('instructor-name').textContent = course.instructor.name;
      document.getElementById('instructor-bio').textContent = course.instructor.bio || 'Experienced educator and industry practitioner.';
      const instImg = document.getElementById('instructor-avatar');
      if (instImg) instImg.src = course.instructor.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
    }

  } catch (err) {
    showToast(err.message || 'Failed to load course details.', 'error');
  }
}

async function handleEnrollCourse(courseId) {
  const token = window.api.getToken();
  if (!token) {
    window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    return;
  }

  const enrollBtn = document.getElementById('btn-enroll-action');
  if (enrollBtn) {
    enrollBtn.disabled = true;
    enrollBtn.textContent = 'Enrolling...';
  }

  try {
    const res = await window.api.post('/enrollments', { course_id: courseId });
    showToast('Enrollment successful! Welcome to the course.', 'success');

    setTimeout(() => {
      window.location.href = `lesson-player.html?course_id=${courseId}`;
    }, 800);
  } catch (err) {
    showToast(err.message || 'Enrollment failed.', 'error');
    if (enrollBtn) {
      enrollBtn.disabled = false;
      enrollBtn.textContent = 'Enroll in Course';
    }
  }
}

// 4. REVIEWS SECTION
async function loadCourseReviews(courseId) {
  const container = document.getElementById('reviews-list');
  if (!container) return;

  try {
    const res = await window.api.get(`/reviews/course/${courseId}`);
    const reviews = res.reviews || [];
    const breakdown = res.breakdown || {};
    const total = res.rating_count || 0;

    // Rating breakdown bars
    const breakdownContainer = document.getElementById('reviews-breakdown-bars');
    if (breakdownContainer) {
      let barsHtml = '';
      for (let star = 5; star >= 1; star--) {
        const count = breakdown[star] || 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        barsHtml += `
          <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; margin-bottom: 0.4rem;">
            <span style="width: 50px; color: var(--slate-600);">${star} stars</span>
            <div style="flex: 1; height: 8px; background: var(--slate-100); border-radius: 9999px; overflow: hidden;">
              <div style="width: ${pct}%; height: 100%; background: var(--warning);"></div>
            </div>
            <span style="width: 35px; text-align: right; color: var(--slate-400);">${count}</span>
          </div>
        `;
      }
      breakdownContainer.innerHTML = barsHtml;
    }

    if (reviews.length === 0) {
      container.innerHTML = '<p class="text-muted" style="padding: 1.5rem 0;">No reviews submitted yet for this course. Be the first to leave feedback!</p>';
      return;
    }

    container.innerHTML = reviews.map(rev => `
      <div style="padding: 1.25rem 0; border-bottom: 1px solid var(--border-light);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.625rem;">
            <img src="${escapeHtml(rev.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="${escapeHtml(rev.user?.name || 'Student')}" />
            <div>
              <div style="font-weight: 600; font-size: 0.9375rem;">${escapeHtml(rev.user?.name || 'Verified Student')}</div>
              <div style="font-size: 0.75rem; color: var(--slate-400);">${formatDate(rev.created_at)}</div>
            </div>
          </div>
          <div style="color: var(--warning); font-size: 1rem;">
            ${renderStars(rev.rating)}
          </div>
        </div>
        <p style="font-size: 0.9375rem; color: var(--slate-700); line-height: 1.5;">${escapeHtml(rev.comment)}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load reviews:', err);
  }
}

function initReviewForm(courseId) {
  const form = document.getElementById('form-submit-review');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = window.api.getToken();
    if (!token) {
      showToast('Please log in to submit a review.', 'warning');
      return;
    }

    const rating = form.querySelector('input[name="rating"]:checked')?.value;
    const comment = document.getElementById('review-comment')?.value.trim();

    if (!rating) {
      showToast('Please select a star rating.', 'error');
      return;
    }

    try {
      await window.api.post(`/reviews/course/${courseId}`, {
        rating: Number(rating),
        comment,
      });

      showToast('Thank you! Your review has been published.', 'success');
      closeModal('modal-write-review');
      loadCourseReviews(courseId);
      loadCourseDetails(courseId);
    } catch (err) {
      showToast(err.message || 'Failed to submit review.', 'error');
    }
  });
}
