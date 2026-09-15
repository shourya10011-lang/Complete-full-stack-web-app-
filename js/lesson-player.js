/**
 * EduLearn - Interactive Lesson Player Logic
 */

let currentCourseId = null;
let currentLessonId = null;
let allLessons = [];
let isEnrolled = false;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  initLessonPlayer();
});

async function initLessonPlayer() {
  currentCourseId = getQueryParam('course_id');
  const targetLessonId = getQueryParam('lesson_id');

  if (!currentCourseId) {
    window.location.href = 'courses.html';
    return;
  }

  try {
    const res = await window.api.get(`/lessons/course/${currentCourseId}`);
    allLessons = res.lessons || [];
    isEnrolled = res.is_enrolled;

    if (allLessons.length === 0) {
      showToast('No lessons found for this course.', 'warning');
      return;
    }

    // Determine initial lesson
    let initialLesson = null;
    if (targetLessonId) {
      initialLesson = allLessons.find(l => String(l.id) === String(targetLessonId));
    }
    if (!initialLesson) {
      // Find first incomplete or first unlocked lesson
      initialLesson = allLessons.find(l => !l.completed && !l.is_locked) || allLessons[0];
    }

    renderLessonSidebar();
    await loadLessonContent(initialLesson.id);

  } catch (err) {
    showToast(err.message || 'Failed to load course lessons.', 'error');
  }

  // Next / Previous buttons
  const prevBtn = document.getElementById('btn-prev-lesson');
  const nextBtn = document.getElementById('btn-next-lesson');
  const completeBtn = document.getElementById('btn-mark-complete');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateLesson(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateLesson(1));
  }
  if (completeBtn) {
    completeBtn.addEventListener('click', handleMarkCompleteAndNext);
  }
}

function renderLessonSidebar() {
  const sidebarList = document.getElementById('player-sidebar-list');
  const progressPercentEl = document.getElementById('player-progress-percent');
  const progressFillEl = document.getElementById('player-progress-fill');
  if (!sidebarList) return;

  const total = allLessons.length;
  const completedCount = allLessons.filter(l => l.completed).length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  if (progressPercentEl) progressPercentEl.textContent = `${percent}%`;
  if (progressFillEl) progressFillEl.style.width = `${percent}%`;

  sidebarList.innerHTML = allLessons.map((lesson, idx) => {
    const isActive = String(lesson.id) === String(currentLessonId);
    let statusIcon = '';

    if (lesson.completed) {
      statusIcon = '<span style="color: var(--success); font-weight: bold;">✓</span>';
    } else if (lesson.is_locked) {
      statusIcon = '<span style="color: var(--slate-500); font-size: 0.8rem;">🔒</span>';
    } else {
      statusIcon = `<span style="color: var(--slate-400); font-size: 0.8rem;">${idx + 1}</span>`;
    }

    let typeBadge = '';
    if (lesson.type === 'video') typeBadge = '🎥 Video';
    else if (lesson.type === 'reading') typeBadge = '📖 Reading';
    else if (lesson.type === 'quiz') typeBadge = '📝 Quiz';

    return `
      <li class="player-sidebar-item ${isActive ? 'active' : ''} ${lesson.completed ? 'completed' : ''}" 
          onclick="handleSelectLesson(${lesson.id})">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1; overflow: hidden;">
          <div style="width: 24px; text-align: center;">${statusIcon}</div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.875rem; font-weight: ${isActive ? '700' : '500'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(lesson.title)}
            </div>
            <div style="font-size: 0.75rem; color: var(--slate-400); display: flex; gap: 0.5rem; margin-top: 0.2rem;">
              <span>${typeBadge}</span>
              <span>•</span>
              <span>${lesson.duration_minutes || 10}m</span>
            </div>
          </div>
        </div>
      </li>
    `;
  }).join('');
}

window.handleSelectLesson = async function(lessonId) {
  const lesson = allLessons.find(l => l.id === lessonId);
  if (!lesson) return;

  if (lesson.is_locked) {
    showToast('This lesson is locked. Please enroll to view full lessons.', 'warning');
    return;
  }

  await loadLessonContent(lessonId);
};

async function loadLessonContent(lessonId) {
  currentLessonId = lessonId;
  renderLessonSidebar();

  const titleEl = document.getElementById('player-lesson-title');
  const typeEl = document.getElementById('player-lesson-type');
  const screenEl = document.getElementById('player-screen-content');
  const completeBtn = document.getElementById('btn-mark-complete');

  try {
    const res = await window.api.get(`/lessons/${lessonId}`);
    const lesson = res.lesson;

    if (titleEl) titleEl.textContent = lesson.title;
    if (typeEl) typeEl.textContent = `${lesson.type.toUpperCase()} • ${lesson.duration_minutes || 10} MINS`;

    if (completeBtn) {
      if (lesson.completed) {
        completeBtn.textContent = 'Completed ✓ Next';
        completeBtn.className = 'btn btn-secondary';
      } else {
        completeBtn.textContent = 'Mark Complete & Next';
        completeBtn.className = 'btn btn-primary';
      }
    }

    if (!screenEl) return;

    if (lesson.type === 'video') {
      const videoSrc = lesson.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4';
      screenEl.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <video controls autoplay playsinline style="max-height: 65vh; width: 100%; background: #000;">
            <source src="${videoSrc}" type="video/mp4">
            Your browser does not support HTML video.
          </video>
          <div style="padding: 1rem 2rem; width: 100%; background: var(--slate-900); font-size: 0.875rem; color: var(--slate-400);">
            ${escapeHtml(lesson.content_text || 'Watch the lecture video thoroughly. You can adjust playback speed using the video controls.')}
          </div>
        </div>
      `;
    } else if (lesson.type === 'reading') {
      screenEl.innerHTML = `
        <div class="player-screen-reading">
          <h2>${escapeHtml(lesson.title)}</h2>
          <div style="margin-bottom: 1.5rem; color: var(--slate-400); font-size: 0.875rem;">Estimated reading time: ${lesson.duration_minutes || 15} minutes</div>
          <p style="font-size: 1.0625rem; line-height: 1.8; margin-bottom: 1.5rem;">
            ${escapeHtml(lesson.content_text || 'Comprehensive lecture notes and code reference materials for this module.')}
          </p>
          <div style="padding: 1.25rem; background: rgba(59, 130, 246, 0.1); border-left: 4px solid var(--primary-500); border-radius: 4px; margin-top: 2rem;">
            <strong style="color: white;">Pro Tip:</strong>
            <p style="margin-top: 0.25rem; color: var(--slate-300); font-size: 0.9375rem;">
              Practice each syntax block in your own local environment or code playground to solidify muscle memory.
            </p>
          </div>
        </div>
      `;
    } else if (lesson.type === 'quiz') {
      screenEl.innerHTML = `
        <div class="player-screen-quiz">
          <div class="badge badge-intermediate" style="margin-bottom: 1rem;">Knowledge Assessment</div>
          <h2>${escapeHtml(lesson.title)}</h2>
          <p style="color: var(--slate-400); margin-bottom: 2rem;">Check your understanding of key architectural concepts covered in the preceding modules.</p>

          <div style="background: rgba(255, 255, 255, 0.04); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            <p style="font-weight: 600; margin-bottom: 1rem; color: white;">Question 1: Which HTTP status code represents a successful resource creation?</p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                <input type="radio" name="q1" value="200" /> <span>200 OK</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                <input type="radio" name="q1" value="201" checked /> <span style="color: var(--success); font-weight: 600;">201 Created</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                <input type="radio" name="q1" value="204" /> <span>204 No Content</span>
              </label>
            </div>
          </div>

          <button class="btn btn-primary btn-sm" onclick="showToast('Quiz answer verified! Great job.', 'success')">Verify Answer</button>
        </div>
      `;
    }

  } catch (err) {
    showToast(err.message || 'Failed to load lesson content.', 'error');
  }
}

async function handleMarkCompleteAndNext() {
  if (!currentLessonId) return;

  const completeBtn = document.getElementById('btn-mark-complete');
  if (completeBtn) {
    completeBtn.disabled = true;
    completeBtn.textContent = 'Saving progress...';
  }

  try {
    const res = await window.api.post('/lesson-progress', { lesson_id: currentLessonId });

    // Update local lesson completed status
    const target = allLessons.find(l => l.id === currentLessonId);
    if (target) target.completed = true;

    showToast('Lesson marked complete!', 'success');

    // Check if course completed and certificate issued!
    if (res.course_completed && res.certificate) {
      openCourseCompletedCelebration(res.certificate);
    } else {
      // Advance to next lesson
      navigateLesson(1);
    }

  } catch (err) {
    showToast(err.message || 'Failed to save progress.', 'error');
  } finally {
    if (completeBtn) completeBtn.disabled = false;
  }
}

function navigateLesson(direction) {
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1) return;

  const nextIndex = currentIndex + direction;
  if (nextIndex >= 0 && nextIndex < allLessons.length) {
    const nextLesson = allLessons[nextIndex];
    if (nextLesson.is_locked) {
      showToast('The next lesson is locked.', 'warning');
      return;
    }
    loadLessonContent(nextLesson.id);
  } else if (nextIndex >= allLessons.length) {
    showToast('You have reached the final lesson of this course!', 'info');
  }
}

function openCourseCompletedCelebration(cert) {
  const certModal = document.getElementById('modal-course-completed');
  const codeEl = document.getElementById('completed-cert-code');
  if (codeEl) codeEl.textContent = cert.certificate_code;
  openModal('modal-course-completed');
}
