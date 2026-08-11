/**
 * Premium Utilities
 * ==================
 * Cursor trail, toast notifications, loading skeletons, etc.
 */

class CursorTrail {
  constructor(color = '#FFD700', size = 8) {
    this.color = color;
    this.size = size;
    this.particles = [];
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => this.createTrail(e));
  }

  createTrail(e) {
    const particle = document.createElement('div');
    particle.className = 'cursor-trail';
    particle.style.left = e.clientX - this.size / 2 + 'px';
    particle.style.top = e.clientY - this.size / 2 + 'px';
    particle.style.width = this.size + 'px';
    particle.style.height = this.size + 'px';
    particle.style.backgroundColor = this.color;

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 800);
  }
}

class ToastNotification {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return toast;
  }

  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }

  warning(message, duration = 3500) {
    return this.show(message, 'warning', duration);
  }
}

class FormValidator {
  static validateEmail(email) {
    const regex = /^[^\s@.][^\s@]*@[^\s@.][^\s@]*\.[^\s@.]{2,}$/;
    return regex.test(String(email));
  }

  static validatePhone(phone) {
    const regex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return regex.test(String(phone).replace(/\s/g, ''));
  }

  static validatePasswordStrength(password) {
    if (String(password).length < 8) return false;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    return hasUpper && hasLower && hasNum;
  }

  static validatePassport(passportNumber) {
    return String(passportNumber).trim().length >= 6;
  }

  static validateFileSize(file, maxMB = 5) {
    return file && file.size <= maxMB * 1024 * 1024;
  }

  static validateFileType(file, allowedTypes = ['pdf', 'jpg', 'jpeg', 'png']) {
    if (!file) return false;
    const ext = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(ext);
  }
}

class LoadingSkeleton {
  static createCardSkeleton() {
    return `
      <div class="skeleton skeleton-card">
        <div class="skeleton skeleton-line" style="width: 40%; height: 1.2rem;"></div>
        <div class="skeleton skeleton-line" style="width: 80%; height: 1rem;"></div>
        <div class="skeleton skeleton-line" style="width: 70%; height: 1rem;"></div>
        <div class="skeleton skeleton-line" style="width: 50%; height: 0.8rem;"></div>
      </div>
    `;
  }

  static createTableRowSkeleton(columns = 5) {
    return `
      <tr>
        ${Array(columns).fill(0).map(() => `
          <td>
            <div class="skeleton skeleton-line" style="width: 80%; height: 1rem;"></div>
          </td>
        `).join('')}
      </tr>
    `;
  }

  static showLoading(element) {
    if (element) {
      element.style.opacity = '0.6';
      element.style.pointerEvents = 'none';
    }
  }

  static hideLoading(element) {
    if (element) {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    }
  }
}

// Export for use in app.js and other modules
window.CursorTrail = CursorTrail;
window.ToastNotification = ToastNotification;
window.FormValidator = FormValidator;
window.LoadingSkeleton = LoadingSkeleton;

// Initialize cursor trail on page load
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on desktop (not mobile)
  if (window.innerWidth > 768) {
    window.cursorTrail = new CursorTrail('#FFD700', 6);
  }

  // Initialize toast notification system
  window.toast = new ToastNotification();
});
