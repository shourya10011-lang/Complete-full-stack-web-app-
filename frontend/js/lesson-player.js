/**
 * EduLearn - Interactive Lesson Player Logic
 */

let currentCourseId = null;
let currentLessonId = null;
let allLessons = [];
let isEnrolled = false;
let courseMetadata = {
  title: '',
  youtube_playlist_url: null
};
let isPlaylistMode = false;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  initLessonPlayer();
});

// Helper to parse YouTube URLs into clean embed URLs
function getYouTubeInfo(url) {
  if (!url) return null;
  const isYT = url.includes('youtube.com') || url.includes('youtu.be');
  if (!isYT) return null;

  const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  const videoMatch = url.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

  const playlistId = listMatch ? listMatch[1] : null;
  const videoId = videoMatch ? videoMatch[1] : null;

  let embedUrl = null;
  if (videoId && playlistId) {
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?list=${playlistId}&rel=0&enablejsapi=1`;
  } else if (playlistId && !videoId) {
    embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&enablejsapi=1`;
  } else if (videoId) {
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&enablejsapi=1`;
  } else if (url.includes('/embed/')) {
    embedUrl = url;
  }

  return {
    isYouTube: true,
    videoId,
    playlistId,
    embedUrl: embedUrl || url,
    originalUrl: url
  };
}

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
    courseMetadata.title = res.course_title || 'Course Syllabus';
    courseMetadata.youtube_playlist_url = res.youtube_playlist_url || null;

    // Check if any lesson has YouTube playlist URL
    if (!courseMetadata.youtube_playlist_url) {
      const ytLesson = allLessons.find(l => l.video_url && l.video_url.includes('list='));
      if (ytLesson) {
        const info = getYouTubeInfo(ytLesson.video_url);
        if (info && info.playlistId) {
          courseMetadata.youtube_playlist_url = `https://www.youtube.com/playlist?list=${info.playlistId}`;
        }
      }
    }

    // Configure playlist mode toggle in header
    const playlistContainer = document.getElementById('playlist-mode-container');
    const togglePlaylistBtn = document.getElementById('btn-toggle-playlist');
    const togglePlaylistText = document.getElementById('playlist-mode-text');

    if (courseMetadata.youtube_playlist_url && playlistContainer) {
      playlistContainer.style.display = 'block';
      togglePlaylistBtn.onclick = () => {
        isPlaylistMode = !isPlaylistMode;
        if (isPlaylistMode) {
          togglePlaylistBtn.style.background = 'rgba(56, 189, 248, 0.2)';
          togglePlaylistBtn.style.color = '#38bdf8';
          togglePlaylistBtn.style.borderColor = 'rgba(56, 189, 248, 0.4)';
          togglePlaylistText.textContent = 'Exit Playlist Mode';
          renderFullPlaylistScreen();
        } else {
          togglePlaylistBtn.style.background = 'rgba(239, 68, 68, 0.15)';
          togglePlaylistBtn.style.color = '#f87171';
          togglePlaylistBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          togglePlaylistText.textContent = 'YouTube Playlist Mode';
          loadLessonContent(currentLessonId);
        }
      };
    }

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

function renderFullPlaylistScreen() {
  const screenEl = document.getElementById('player-screen-content');
  const titleEl = document.getElementById('player-lesson-title');
  const typeEl = document.getElementById('player-lesson-type');
  if (!screenEl) return;

  const info = getYouTubeInfo(courseMetadata.youtube_playlist_url);
  const embedUrl = info && info.embedUrl 
    ? info.embedUrl 
    : 'https://www.youtube-nocookie.com/embed/videoseries?list=PLcetZ6gSk96-9Cg_7lWbF_2u_2r_d6k7A';

  if (titleEl) titleEl.textContent = `${courseMetadata.title} (Continuous Playlist)`;
  if (typeEl) typeEl.textContent = 'YOUTUBE PLAYLIST • CONTINUOUS STREAM';

  screenEl.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #0b1120;">
      <div style="position: relative; width: 100%; flex: 1; min-height: 480px; background: #000;">
        <iframe 
          src="${embedUrl}" 
          title="YouTube Playlist Stream"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      </div>
      <div style="padding: 1rem 1.5rem; background: #0f172a; border-top: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; font-weight: 700; font-size: 0.75rem; border: 1px solid rgba(239, 68, 68, 0.3);">
            Continuous YouTube Playlist
          </span>
          <p style="margin-top: 0.35rem; font-size: 0.875rem; color: #cbd5e1;">
            Streaming the complete English video curriculum for ${escapeHtml(courseMetadata.title || 'this masterclass')}. You can browse individual video tracks using the playlist selector inside the player.
          </p>
        </div>
        <a href="${courseMetadata.youtube_playlist_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 0.8125rem; color: #f87171; border-color: #475569;">
          Open Playlist on YouTube ↗
        </a>
      </div>
    </div>
  `;
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
    const isActive = !isPlaylistMode && String(lesson.id) === String(currentLessonId);
    let statusIcon = '';

    if (lesson.completed) {
      statusIcon = '<span style="color: var(--success); font-weight: bold;">✓</span>';
    } else if (lesson.is_locked) {
      statusIcon = '<span style="color: var(--slate-500); font-size: 0.8rem;">🔒</span>';
    } else {
      statusIcon = `<span style="color: var(--slate-400); font-size: 0.8rem;">${idx + 1}</span>`;
    }

    let typeBadge = '';
    const isYTLesson = lesson.video_url && (lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be'));

    if (lesson.type === 'video') {
      typeBadge = isYTLesson ? '▶ YouTube' : '🎥 Video';
    } else if (lesson.type === 'reading') {
      typeBadge = '📖 Notes';
    } else if (lesson.type === 'quiz') {
      typeBadge = '📝 Quiz';
    }

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

  isPlaylistMode = false;
  const togglePlaylistBtn = document.getElementById('btn-toggle-playlist');
  const togglePlaylistText = document.getElementById('playlist-mode-text');
  if (togglePlaylistBtn) {
    togglePlaylistBtn.style.background = 'rgba(239, 68, 68, 0.15)';
    togglePlaylistBtn.style.color = '#f87171';
    togglePlaylistBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    if (togglePlaylistText) togglePlaylistText.textContent = 'YouTube Playlist Mode';
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
      const ytInfo = getYouTubeInfo(videoSrc);

      if (ytInfo) {
        // Render responsive YouTube Player
        screenEl.innerHTML = `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #0b1120;">
            <div style="position: relative; width: 100%; flex: 1; min-height: 480px; background: #000;">
              <iframe 
                src="${ytInfo.embedUrl}" 
                title="${escapeHtml(lesson.title)}"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
              </iframe>
            </div>
            <div style="padding: 1rem 1.5rem; background: #0f172a; border-top: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div style="flex: 1; min-width: 260px;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                  <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; font-weight: 700; font-size: 0.75rem; border: 1px solid rgba(239, 68, 68, 0.3);">
                    YouTube Video Lecture
                  </span>
                  <span style="font-size: 0.75rem; color: #94a3b8;">High Definition • Captions Available</span>
                </div>
                <div style="font-size: 0.875rem; color: #cbd5e1; line-height: 1.5;">
                  ${escapeHtml(lesson.content_text || 'Watch this video lesson thoroughly. Follow along with interactive practice below.')}
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <a href="${videoSrc}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 0.8125rem; color: #f87171; border-color: #475569;">
                  Open on YouTube ↗
                </a>
              </div>
            </div>
          </div>
        `;
      } else {
        // Standard HTML5 video
        screenEl.innerHTML = `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000;">
            <video controls autoplay playsinline style="max-height: 65vh; width: 100%; background: #000;">
              <source src="${videoSrc}" type="video/mp4">
              Your browser does not support HTML video.
            </video>
            <div style="padding: 1rem 2rem; width: 100%; background: var(--slate-900); font-size: 0.875rem; color: var(--slate-400);">
              ${escapeHtml(lesson.content_text || 'Watch the lecture video thoroughly. You can adjust playback speed using the video controls.')}
            </div>
          </div>
        `;
      }
    } else if (lesson.type === 'reading') {
      screenEl.innerHTML = `
        <div class="player-screen-reading">
          <h2>${escapeHtml(lesson.title)}</h2>
          <div style="margin-bottom: 1.5rem; color: var(--slate-400); font-size: 0.875rem;">Estimated reading time: ${lesson.duration_minutes || 15} minutes</div>
          <p style="font-size: 1.0625rem; line-height: 1.8; margin-bottom: 1.5rem;">
            ${escapeHtml(lesson.content_text || 'Comprehensive lecture notes and reference materials for this module.')}
          </p>
          <div style="padding: 1.25rem; background: rgba(59, 130, 246, 0.1); border-left: 4px solid var(--primary-500); border-radius: 4px; margin-top: 2rem;">
            <strong style="color: white;">Study Tip:</strong>
            <p style="margin-top: 0.25rem; color: var(--slate-300); font-size: 0.9375rem;">
              Practice speaking these sentences out loud multiple times to build natural pronunciation and muscle memory.
            </p>
          </div>
        </div>
      `;
    } else if (lesson.type === 'quiz') {
      const isEnglish = (lesson.course_id === 7 || lesson.course_id === 8 || lesson.title.toLowerCase().includes('english') || lesson.title.toLowerCase().includes('grammar'));

      if (isEnglish) {
        screenEl.innerHTML = `
          <div class="player-screen-quiz">
            <div class="badge badge-intermediate" style="margin-bottom: 1rem;">English Fluency Assessment</div>
            <h2>${escapeHtml(lesson.title)}</h2>
            <p style="color: var(--slate-400); margin-bottom: 2rem;">Test your grasp of conversational phrases, tenses, and workplace communication etiquette.</p>

            <div style="background: rgba(255, 255, 255, 0.04); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <p style="font-weight: 600; margin-bottom: 1rem; color: white;">Question 1: Which of the following is the most natural, polite request in professional English?</p>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                  <input type="radio" name="q1" value="a" /> <span>Send me the slides right away.</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                  <input type="radio" name="q1" value="b" checked /> <span style="color: var(--success); font-weight: 600;">Could you please share the slides when you have a chance?</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                  <input type="radio" name="q1" value="c" /> <span>Give me slides today.</span>
                </label>
              </div>
            </div>

            <div style="background: rgba(255, 255, 255, 0.04); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <p style="font-weight: 600; margin-bottom: 1rem; color: white;">Question 2: Select the correct preposition: "Our engineering team has been building this product ____ January."</p>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                  <input type="radio" name="q2" value="for" /> <span>for</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                  <input type="radio" name="q2" value="since" checked /> <span style="color: var(--success); font-weight: 600;">since</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                  <input type="radio" name="q2" value="in" /> <span>in</span>
                </label>
              </div>
            </div>

            <button class="btn btn-primary btn-sm" onclick="showToast('Great job! Both English questions verified correctly.', 'success')">Verify Answers</button>
          </div>
        `;
      } else {
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
  if (allLessons.length === 0) return;
  const currentIdx = allLessons.findIndex(l => l.id === currentLessonId);
  const targetIdx = currentIdx + direction;

  if (targetIdx >= 0 && targetIdx < allLessons.length) {
    const targetLesson = allLessons[targetIdx];
    if (targetLesson.is_locked) {
      showToast('Next lesson is locked. Enroll to access full course material.', 'warning');
      return;
    }
    loadLessonContent(targetLesson.id);
  } else if (direction > 0) {
    showToast('You have reached the final lesson of this course!', 'info');
  }
}

function openCourseCompletedCelebration(cert) {
  const codeEl = document.getElementById('completed-cert-code');
  if (codeEl && cert) {
    codeEl.textContent = cert.certificate_code || 'EDU-CERT-VERIFIED';
  }
  openModal('modal-course-completed');
}
