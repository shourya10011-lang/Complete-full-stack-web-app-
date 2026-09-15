/**
 * EduLearn - User Profile Management
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  initProfilePage();
});

async function initProfilePage() {
  const form = document.getElementById('profile-form');
  const avatarInput = document.getElementById('profile-avatar-url');
  const avatarPreview = document.getElementById('profile-avatar-preview');

  try {
    const res = await window.api.get('/auth/me');
    const user = res.user;

    // Fill form fields
    document.getElementById('profile-name').value = user.name || '';
    document.getElementById('profile-email').value = user.email || '';
    document.getElementById('profile-role').textContent = (user.role || 'Student').toUpperCase();
    document.getElementById('profile-bio').value = user.bio || '';
    document.getElementById('profile-joined').textContent = formatDate(user.created_at);

    if (avatarInput) {
      avatarInput.value = user.avatar_url || '';
    }
    if (avatarPreview) {
      avatarPreview.src = user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
    }

    // Avatar URL change listener
    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener('input', (e) => {
        avatarPreview.src = e.target.value.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
      });
    }

  } catch (err) {
    showToast(err.message || 'Failed to load profile.', 'error');
  }

  // Handle Profile Update Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const name = document.getElementById('profile-name').value.trim();
      const bio = document.getElementById('profile-bio').value.trim();
      const avatar_url = document.getElementById('profile-avatar-url').value.trim();

      if (!name) {
        showToast('Full name is required.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving changes...';

      try {
        const res = await window.api.put('/users/me', {
          name,
          bio,
          avatar_url,
        });

        window.api.setCurrentUser(res.user);
        showToast('Profile updated successfully!', 'success');

        // Update navbar state
        if (typeof initNavbarAuth === 'function') {
          initNavbarAuth();
        }
      } catch (err) {
        showToast(err.message || 'Failed to update profile.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
      }
    });
  }
}
